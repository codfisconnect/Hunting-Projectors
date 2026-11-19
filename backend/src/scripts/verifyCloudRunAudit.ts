import { prisma } from '../config/database.js';
import jwt from 'jsonwebtoken';

async function verifyCloudRunSetup() {
  console.log('=== NAP COMPUTERS CLOUD RUN & SECURITY AUDIT SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`[PASS] ${msg}`);
      passed++;
    } else {
      console.error(`[FAIL] ${msg}`);
      failed++;
    }
  }

  try {
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!adminUser) throw new Error('Admin user required for test verification');

    const adminToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: 'ADMIN' },
      process.env.JWT_SECRET || 'hunting-projectors-secret-jwt-key'
    );

    let realCustomer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
    let createdTempCustomer = false;
    if (!realCustomer) {
      realCustomer = await prisma.user.create({
        data: {
          email: `test_customer_${Date.now()}@example.com`,
          passwordHash: 'dummy-hash',
          fullName: 'Test Verification Customer',
          role: 'CUSTOMER'
        }
      });
      createdTempCustomer = true;
    }

    const customerToken = jwt.sign(
      { id: realCustomer.id, email: realCustomer.email, role: realCustomer.role },
      process.env.JWT_SECRET || 'hunting-projectors-secret-jwt-key'
    );

    // 1. Task 1 & 2: Cloud Scheduler protected endpoint
    console.log('--- 1. Testing Cloud Scheduler Cleanup Endpoint Security ---');

    // (a) Without auth -> 401
    const unauthRes = await fetch('http://localhost:4000/api/jobs/cleanup-unpaid-orders', {
      method: 'POST'
    });
    assert(unauthRes.status === 401, `Unauthenticated request correctly rejected with 401 (got ${unauthRes.status})`);

    // (b) With random customer token -> 401
    const custRes = await fetch('http://localhost:4000/api/jobs/cleanup-unpaid-orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    assert(custRes.status === 401, `Normal user Bearer token rejected with 401 (got ${custRes.status})`);

    // (c) Forged token -> 401
    const forgedToken = jwt.sign(
      {
        iss: 'https://accounts.google.com',
        aud: 'https://backend.napcomputers.in',
        email: 'cloud-scheduler@napcomputers.iam.gserviceaccount.com',
        exp: Math.floor(Date.now() / 1000) + 3600
      },
      'attacker-untrusted-key'
    );

    const forgedRes = await fetch('http://localhost:4000/api/jobs/cleanup-unpaid-orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${forgedToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timeoutMinutes: 30 })
    });
    assert(forgedRes.status === 401, `Forged Google OIDC token correctly rejected with 401 (got ${forgedRes.status})`);

    // (d) Authenticated via CRON_SECRET / X-Cloud-Scheduler-Secret -> 200 OK
    const cronSecret = process.env.CRON_SECRET || 'NapComputersCloudSchedulerSecret2026_SecureKey';
    const secretRes = await fetch('http://localhost:4000/api/jobs/cleanup-unpaid-orders', {
      method: 'POST',
      headers: {
        'X-Cloud-Scheduler-Secret': cronSecret,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timeoutMinutes: 30 })
    });
    const secretData: any = await secretRes.json();
    assert(secretRes.status === 200 && secretData.success === true, `Cloud Scheduler authorized request successfully executed cleanup job (got ${secretRes.status})`);

    // 2. Task 4: Verify offline payment admin endpoint
    console.log('\n--- 2. Testing Offline Payment Admin Endpoint Security ---');

    // Create a temporary test order for checking payment update
    const product = await prisma.product.findFirst({ where: { isActive: true } });
    const testOrder = await prisma.order.create({
      data: {
        orderNumber: `TEST-ORD-OFFLINE-${Date.now()}`,
        customerName: 'Test Offline Customer',
        customerPhone: '9876543210',
        customerEmail: 'offline@example.com',
        addressLine: '123 Anna Salai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600002',
        subtotal: 10000,
        totalAmount: 10000,
        orderStatus: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'DIRECT_BANK_TRANSFER',
        items: {
          create: {
            productId: product!.id,
            quantity: 1,
            unitPrice: 10000
          }
        }
      }
    });

    // (a) Customer attempt to update payment status -> 403 Forbidden
    const custPayRes = await fetch(`http://localhost:4000/api/admin/orders/${testOrder.id}/payment`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${customerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentStatus: 'PAID', notes: 'Hacked by customer' })
    });
    assert(custPayRes.status === 403, `Customer attempt to call admin payment endpoint rejected with 403 Forbidden (got ${custPayRes.status})`);

    // (b) Admin with invalid paymentStatus -> 400 Bad Request
    const adminBadPay = await fetch(`http://localhost:4000/api/admin/orders/${testOrder.id}/payment`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentStatus: 'INVALID_STATUS' })
    });
    assert(adminBadPay.status === 400, `Admin with invalid payment status rejected with 400 (got ${adminBadPay.status})`);

    // (c) Admin with valid payment details -> 200 OK, transitions to PAID, orderStatus to CONFIRMED, records audit note
    const adminGoodPay = await fetch(`http://localhost:4000/api/admin/orders/${testOrder.id}/payment`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentStatus: 'PAID',
        transactionReference: 'NEFT-HDFC-9988776655',
        notes: 'Verified funds received in HDFC Current A/C'
      })
    });
    const adminGoodData: any = await adminGoodPay.json();
    assert(adminGoodPay.status === 200 && adminGoodData.data.paymentStatus === 'PAID', `Admin payment update succeeded with 200 OK`);
    assert(adminGoodData.data.orderStatus === 'CONFIRMED', `Order automatically transitioned from PENDING to CONFIRMED`);
    assert(adminGoodData.data.internalNotes?.includes('NEFT-HDFC-9988776655'), `Audit trail recorded transaction reference and notes in internalNotes`);

    // Cleanup test order
    await prisma.orderItem.deleteMany({ where: { orderId: testOrder.id } });
    await prisma.order.deleteMany({ where: { id: testOrder.id } });
    if (createdTempCustomer && realCustomer) {
      await prisma.user.delete({ where: { id: realCustomer.id } });
    }

    // 3. Task 5: Health check endpoint
    console.log('\n--- 3. Testing Health & Port Configuration ---');
    const healthRes = await fetch('http://localhost:4000/api/health');
    const healthData: any = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', `Health check /api/health responding with 200 and status: ok`);

    console.log(`\n=========================================`);
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`=========================================`);

    if (failed > 0) process.exit(1);
  } catch (err: any) {
    console.error('Audit exception:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCloudRunSetup();
