import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { emailService } from './emailService.js';

export interface RazorpayOrderResult {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface VerificationResult {
  verified: boolean;
  orderNumber: string;
  paymentStatus: string;
  orderStatus: string;
  message?: string;
}

export class PaymentService {
  private razorpayClient: any = null;

  private getRazorpay(): any {
    if (!this.razorpayClient) {
      const keyId = config.razorpay.keyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
      const keySecret = config.razorpay.keySecret || process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
      this.razorpayClient = new (Razorpay as any)({
        key_id: keyId,
        key_secret: keySecret
      });
    }
    return this.razorpayClient;
  }

  /**
   * Generates or retrieves an authoritative gateway order from database order totals.
   * NEVER trust frontend pricing.
   */
  async createRazorpayOrder(userId: string, orderId: string): Promise<RazorpayOrderResult> {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId
      },
      include: {
        paymentAttempts: true
      }
    });

    if (!order) {
      throw new Error('Order not found or unauthorized');
    }

    if (order.paymentStatus === 'PAID') {
      throw new Error('Order has already been paid successfully');
    }

    if (order.orderStatus === 'CANCELLED') {
      throw new Error('Cannot initiate payment on a cancelled order');
    }

    // Convert totalAmount (Decimal) to integer paise
    const amountInPaise = Math.round(Number(order.totalAmount) * 100);
    const currency = config.razorpay.currency || 'INR';

    let rzpOrderId: string;

    // Check if live credentials exist; otherwise provide deterministic mock/test order ID
    const hasLiveCreds = config.razorpay.keyId && !config.razorpay.keyId.includes('placeholder');

    if (hasLiveCreds) {
      const rzp = this.getRazorpay();
      const rzpOrder = await rzp.orders.create({
        amount: amountInPaise,
        currency,
        receipt: `rcpt_${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
        notes: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: userId
        }
      });
      rzpOrderId = rzpOrder.id;
    } else {
      // Deterministic fallback for automated tests / pending live keys
      rzpOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    }

    // Record PaymentAttempt in database for resilience and multi-attempt tracking
    await (prisma as any).paymentAttempt.create({
      data: {
        orderId: order.id,
        razorpayOrderId: rzpOrderId,
        amount: order.totalAmount,
        currency,
        status: 'PENDING'
      }
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: rzpOrderId,
      amount: amountInPaise,
      currency,
      keyId: config.razorpay.keyId || 'rzp_test_placeholder',
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone
      }
    };
  }

  /**
   * Verifies Razorpay payment signature using server-side HMAC-SHA256 secret.
   * Reconciles database order and payment attempt atomically.
   */
  async verifyPayment(
    userId: string,
    payload: {
      orderId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }
  ): Promise<VerificationResult> {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = payload;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId
      },
      include: {
        items: true
      }
    });

    if (!order) {
      throw new Error('Order not found or unauthorized');
    }

    if (order.paymentStatus === 'PAID') {
      return {
        verified: true,
        orderNumber: order.orderNumber,
        paymentStatus: 'PAID',
        orderStatus: order.orderStatus,
        message: 'Order was already verified and marked as PAID'
      };
    }

    // Verify HMAC SHA256 Signature
    const keySecret = config.razorpay.keySecret || process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpaySignature)
    );

    if (!isSignatureValid) {
      // Record failed payment attempt
      await (prisma as any).paymentAttempt.updateMany({
        where: { razorpayOrderId },
        data: {
          razorpayPaymentId,
          razorpaySignature,
          status: 'FAILED',
          errorCode: 'INVALID_SIGNATURE',
          errorDescription: 'HMAC signature verification failed'
        }
      });

      throw new Error('Payment signature verification failed. Untrusted payment payload.');
    }

    // Secondary Security Check: If live Razorpay API keys are configured, query gateway directly to verify payment is strictly 'captured'
    const hasLiveCreds = config.razorpay.keyId && !config.razorpay.keyId.includes('placeholder');
    let paymentDetails: any = null;

    if (hasLiveCreds) {
      try {
        const rzp = this.getRazorpay();
        paymentDetails = await rzp.payments.fetch(razorpayPaymentId);

        // Security Invariant: Payment must be strictly 'captured'
        if (paymentDetails.status !== 'captured') {
          // If status is 'authorized', try capturing it if auto-capture is not enabled
          if (paymentDetails.status === 'authorized') {
            const amountInPaise = Math.round(Number(order.totalAmount) * 100);
            paymentDetails = await rzp.payments.capture(razorpayPaymentId, amountInPaise, 'INR');
          } else {
            // Update attempt as FAILED/PENDING
            await (prisma as any).paymentAttempt.updateMany({
              where: { razorpayOrderId },
              data: {
                razorpayPaymentId,
                status: paymentDetails.status === 'failed' ? 'FAILED' : 'PENDING',
                errorCode: paymentDetails.error_code || 'PAYMENT_NOT_CAPTURED',
                errorDescription: `Gateway payment status is ${paymentDetails.status}`
              }
            });
            throw new Error(`Payment verification failed: Gateway reports payment status as '${paymentDetails.status}' (not captured).`);
          }
        }

        // Security Invariant: Validate amount and currency from gateway entity
        const expectedPaise = Math.round(Number(order.totalAmount) * 100);
        if (Number(paymentDetails.amount) !== expectedPaise) {
          throw new Error(`Payment amount mismatch: Expected ₹${Number(order.totalAmount)}, gateway recorded ₹${paymentDetails.amount / 100}`);
        }
        if (paymentDetails.currency !== 'INR') {
          throw new Error(`Currency mismatch: Expected INR, gateway recorded ${paymentDetails.currency}`);
        }
      } catch (fetchErr: any) {
        console.error('[PaymentService] Error verifying capture status with Razorpay API:', fetchErr.message);
        throw fetchErr;
      }
    }

    // Atomic reconciliation in database transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Update or create payment attempt record
      const existingAttempt = await (tx as any).paymentAttempt.findFirst({
        where: { razorpayOrderId }
      });

      if (existingAttempt) {
        await (tx as any).paymentAttempt.update({
          where: { id: existingAttempt.id },
          data: {
            razorpayPaymentId,
            razorpaySignature,
            status: 'PAID',
            method: 'ONLINE_GATEWAY'
          }
        });
      } else {
        await (tx as any).paymentAttempt.create({
          data: {
            orderId: order.id,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            amount: order.totalAmount,
            currency: 'INR',
            status: 'PAID',
            method: 'ONLINE_GATEWAY'
          }
        });
      }

      // 2. Mark order as PAID and CONFIRMED
      const nextOrderStatus = order.orderStatus === 'PENDING' ? 'CONFIRMED' : order.orderStatus;
      const noteEntry = `[PAYMENT CONFIRMED: Razorpay Payment ID: ${razorpayPaymentId} - Gateway Order: ${razorpayOrderId}]`;
      const updatedNotes = order.internalNotes ? `${order.internalNotes}\n${noteEntry}` : noteEntry;

      const orderUpdated = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          orderStatus: nextOrderStatus,
          paymentMethod: 'ONLINE_RAZORPAY',
          internalNotes: updatedNotes
        }
      });

      // 3. Record order status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.orderStatus,
          toStatus: nextOrderStatus,
          changedByName: 'RAZORPAY_GATEWAY_WEBHOOK',
          notes: `Payment verified successfully via Razorpay (Tx: ${razorpayPaymentId})`
        }
      });

      return orderUpdated;
    });

    // Send confirmation email asynchronously
    emailService.sendOrderConfirmation(updatedOrder as any).catch((err: any) => {
      console.warn('[PaymentService] Email dispatch notice:', err.message);
    });

    return {
      verified: true,
      orderNumber: updatedOrder.orderNumber,
      paymentStatus: 'PAID',
      orderStatus: updatedOrder.orderStatus
    };
  }

  /**
   * Queries payment status for a specific order.
   */
  async getPaymentStatus(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId
      },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        orderStatus: true,
        paymentStatus: true,
        paymentMethod: true,
        paymentAttempts: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  /**
   * Idempotent webhook event handler.
   * Verifies signature against raw webhook body.
   */
  async handleWebhook(rawBody: string, signature: string) {
    const webhookSecret = config.razorpay.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    console.log(`[Razorpay Webhook] Received event: ${eventType} (ID: ${event.id || 'N/A'})`);

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      const rzpPaymentId = paymentEntity?.id;

      if (!rzpOrderId) {
        console.warn('[Razorpay Webhook] No order_id present in captured payment payload');
        return { status: 'skipped', reason: 'Missing order_id' };
      }

      // Find attempt and order
      const attempt = await (prisma as any).paymentAttempt.findFirst({
        where: { razorpayOrderId: rzpOrderId },
        include: { order: true }
      });

      if (!attempt || !attempt.order) {
        console.warn(`[Razorpay Webhook] No matching order for razorpayOrderId: ${rzpOrderId}`);
        return { status: 'unmatched', razorpayOrderId: rzpOrderId };
      }

      // Check if already paid (idempotency guard)
      if (attempt.order.paymentStatus === 'PAID') {
        return { status: 'already_processed', orderNumber: attempt.order.orderNumber };
      }

      // Handle late payment after order cancellation:
      if (attempt.order.orderStatus === 'CANCELLED') {
        const flagNote = `[ATTENTION: Late payment captured for CANCELLED order. Tx: ${rzpPaymentId}. Manual inventory check or refund required.]`;
        await prisma.order.update({
          where: { id: attempt.order.id },
          data: {
            internalNotes: attempt.order.internalNotes ? `${attempt.order.internalNotes}\n${flagNote}` : flagNote
          }
        });
        await (prisma as any).adminNotification.create({
          data: {
            type: 'LATE_PAYMENT_ON_CANCELLED_ORDER',
            title: `Late Payment on Cancelled Order #${attempt.order.orderNumber}`,
            message: `Customer paid ₹${Number(attempt.amount).toLocaleString('en-IN')} via Razorpay (Tx: ${rzpPaymentId}) after order was cancelled. Action required.`
          }
        });
        return { status: 'flagged_late_payment', orderNumber: attempt.order.orderNumber };
      }

      // Reconcile order as PAID
      await prisma.$transaction(async (tx) => {
        await (tx as any).paymentAttempt.update({
          where: { id: attempt.id },
          data: {
            razorpayPaymentId: rzpPaymentId,
            status: 'PAID',
            method: paymentEntity.method || 'ONLINE_GATEWAY',
            bank: paymentEntity.bank,
            wallet: paymentEntity.wallet,
            vpa: paymentEntity.vpa,
            webhookReceivedAt: new Date(),
            rawResponse: paymentEntity
          }
        });

        await tx.order.update({
          where: { id: attempt.order.id },
          data: {
            paymentStatus: 'PAID',
            orderStatus: attempt.order.orderStatus === 'PENDING' ? 'CONFIRMED' : attempt.order.orderStatus,
            paymentMethod: 'ONLINE_RAZORPAY'
          }
        });
      });

      return { status: 'processed', orderNumber: attempt.order.orderNumber };
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      const rzpPaymentId = paymentEntity?.id;

      if (rzpOrderId) {
        await (prisma as any).paymentAttempt.updateMany({
          where: { razorpayOrderId: rzpOrderId },
          data: {
            razorpayPaymentId: rzpPaymentId,
            status: 'FAILED',
            errorCode: paymentEntity.error_code,
            errorDescription: paymentEntity.error_description,
            webhookReceivedAt: new Date(),
            rawResponse: paymentEntity
          }
        });
      }
      return { status: 'logged_failure' };
    }

    return { status: 'ignored_event', eventType };
  }
}

export const paymentService = new PaymentService();
