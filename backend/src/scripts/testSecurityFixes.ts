import { prisma } from '../config/database.js';
import { orderService } from '../services/orderService.js';
import { adminDashboardService } from '../services/adminDashboardService.js';

async function runAcceptanceTests() {
  console.log('=== NAP COMPUTERS SECURITY FIX VERIFICATION SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      failed++;
    }
  }

  try {
    // Locate a product for test fixtures
    const product = await prisma.product.findFirst({
      where: { isActive: true }
    });

    if (!product) {
      throw new Error('No active products found in database to execute test suite.');
    }

    const testAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    const testCustomer = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' }
    });

    console.log(`Test fixtures: Product '${product.name}' (Initial Stock: ${product.stock}), Admin: ${testAdmin?.email}, Customer: ${testCustomer?.email}`);

    // TEST 1: Fulfilment Security - Cannot mark order as SHIPPED/DISPATCHED if paymentStatus is PENDING (non-COD)
    console.log('\n--- Priority 3: Fulfilment Security Tests ---');
    const unpaidOrder = await prisma.order.create({
      data: {
        orderNumber: `TEST-ORD-UNPAID-${Date.now()}`,
        userId: testCustomer?.id || null,
        customerName: 'Test Security Customer',
        customerPhone: '9876543210',
        customerEmail: 'security_test@example.com',
        addressLine: '123 Anna Salai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600002',
        subtotal: 50000,
        totalAmount: 50000,
        orderStatus: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'ONLINE_CARD_RAZORPAY',
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            unitPrice: 50000
          }
        }
      }
    });

    try {
      await adminDashboardService.updateOrderStatus(unpaidOrder.id, 'DISPATCHED', 'Attempt shipping unpaid order', undefined, undefined, testAdmin);
      assert(false, 'Should block marking unpaid non-COD order as DISPATCHED');
    } catch (err: any) {
      assert(err.message.includes('Fulfilment Guard') && err.message.includes('PAID'),
        `Correctly rejected DISPATCHED for unpaid order: "${err.message}"`);
    }

    // TEST 2: Fulfilment Security - COD Order CAN be marked as DISPATCHED
    const codOrder = await prisma.order.create({
      data: {
        orderNumber: `TEST-ORD-COD-${Date.now()}`,
        userId: testCustomer?.id || null,
        customerName: 'Test COD Customer',
        customerPhone: '9876543210',
        customerEmail: 'security_test_cod@example.com',
        addressLine: '123 Anna Salai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600002',
        subtotal: 50000,
        totalAmount: 50000,
        orderStatus: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'COD_VERIFIED',
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            unitPrice: 50000
          }
        }
      }
    });

    const updatedCod = await adminDashboardService.updateOrderStatus(codOrder.id, 'DISPATCHED', 'Authorized COD dispatch', 'BlueDart', 'BD12345678', testAdmin);
    assert(updatedCod.orderStatus === 'DISPATCHED', 'Successfully allowed DISPATCHED for explicit Cash on Delivery (COD) order');

    // TEST 3: Fulfilment Security - PAID order CAN be marked as DISPATCHED
    const paidOrder = await prisma.order.create({
      data: {
        orderNumber: `TEST-ORD-PAID-${Date.now()}`,
        userId: testCustomer?.id || null,
        customerName: 'Test Paid Customer',
        customerPhone: '9876543210',
        customerEmail: 'security_test_paid@example.com',
        addressLine: '123 Anna Salai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600002',
        subtotal: 50000,
        totalAmount: 50000,
        orderStatus: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: 'NET_BANKING',
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            unitPrice: 50000
          }
        }
      }
    });

    const updatedPaid = await adminDashboardService.updateOrderStatus(paidOrder.id, 'DISPATCHED', 'Dispatching paid order', 'DTDC', 'DT987654', testAdmin);
    assert(updatedPaid.orderStatus === 'DISPATCHED', 'Successfully allowed DISPATCHED for genuine PAID order');

    // TEST 4: Abandoned Order Cancellation & Inventory Restoration
    console.log('\n--- Priority 2: Abandoned Orders & Inventory Restoration Tests ---');
    const stockBefore = (await prisma.product.findUnique({ where: { id: product.id } }))!.stock;

    // Simulate an abandoned order created 45 minutes ago
    const expiredTimestamp = new Date(Date.now() - 45 * 60 * 1000);
    const expiredOrder = await prisma.order.create({
      data: {
        orderNumber: `TEST-ORD-EXPIRED-${Date.now()}`,
        userId: testCustomer?.id || null,
        customerName: 'Abandoned Cart Customer',
        customerPhone: '9876543210',
        customerEmail: 'abandoned@example.com',
        addressLine: '456 OMR',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600096',
        subtotal: 25000,
        totalAmount: 25000,
        orderStatus: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'ONLINE_CARD_RAZORPAY',
        createdAt: expiredTimestamp,
        items: {
          create: {
            productId: product.id,
            quantity: 2,
            unitPrice: 12500
          }
        }
      }
    });

    // Run cancelExpiredPendingOrders(30)
    const cleanupResult = await orderService.cancelExpiredPendingOrders(30);
    assert(cleanupResult.cancelledCount >= 1 && cleanupResult.restoredOrders.includes(expiredOrder.orderNumber),
      `Successfully detected and cancelled expired order #${expiredOrder.orderNumber}`);

    // Verify stock incremented by 2
    const stockAfter = (await prisma.product.findUnique({ where: { id: product.id } }))!.stock;
    assert(stockAfter === stockBefore + 2, `Stock restored accurately: from ${stockBefore} to ${stockAfter} (+2)`);

    // Verify order record status updated to CANCELLED
    const cancelledRecord = await prisma.order.findUnique({ where: { id: expiredOrder.id } });
    assert(cancelledRecord?.orderStatus === 'CANCELLED', `Order #${expiredOrder.orderNumber} status changed to CANCELLED`);
    assert(cancelledRecord?.internalNotes?.includes('SYSTEM AUTO-CANCEL') === true, 'Internal note audit trail recorded');

    // TEST 5: Duplicate Restoration Protection (Idempotency)
    const duplicateRun = await orderService.cancelExpiredPendingOrders(30);
    const stockAfterDup = (await prisma.product.findUnique({ where: { id: product.id } }))!.stock;
    assert(stockAfterDup === stockAfter, `Idempotency verified: Duplicate cleanup run did not re-increment stock (${stockAfterDup} === ${stockAfter})`);

    // TEST 6: Paid Orders are NOT cancelled by cleanup
    const paidRecentOrder = await prisma.order.findUnique({ where: { id: paidOrder.id } });
    assert(paidRecentOrder?.orderStatus === 'DISPATCHED' && paidRecentOrder.paymentStatus === 'PAID',
      'Verified successfully paid order was NOT touched or cancelled by cleanup worker');

    // Cleanup test artifacts from database safely without affecting existing real orders
    await prisma.orderStatusHistory.deleteMany({
      where: { orderId: { in: [unpaidOrder.id, codOrder.id, paidOrder.id, expiredOrder.id] } }
    });
    await prisma.orderItem.deleteMany({
      where: { orderId: { in: [unpaidOrder.id, codOrder.id, paidOrder.id, expiredOrder.id] } }
    });
    await prisma.order.deleteMany({
      where: { id: { in: [unpaidOrder.id, codOrder.id, paidOrder.id, expiredOrder.id] } }
    });

    // Restore stock back to original balance (we added 2 during test simulation without prior decrement)
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: stockBefore }
    });

    console.log(`\nTest suite completed cleanly. Final stock restored to baseline: ${stockBefore}`);
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED.`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error: any) {
    console.error('Test Suite Exception:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runAcceptanceTests();
