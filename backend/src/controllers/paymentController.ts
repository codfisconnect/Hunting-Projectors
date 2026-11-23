import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/paymentService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function createPaymentOrder(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const { orderId } = req.body;
    if (!orderId) {
      return sendError(res, 'orderId is required', 400);
    }

    const result = await paymentService.createRazorpayOrder(req.user.id, orderId);
    return sendSuccess(res, result, 'Razorpay order created successfully');
  } catch (error: any) {
    if (error.message?.includes('not found') || error.message?.includes('unauthorized')) {
      return sendError(res, error.message, 404);
    }
    if (error.message?.includes('already been paid') || error.message?.includes('cancelled')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}

export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return sendError(res, 'Missing required payment verification parameters', 400);
    }

    const result = await paymentService.verifyPayment(req.user.id, {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    return sendSuccess(res, result, 'Payment verified successfully');
  } catch (error: any) {
    if (error.message?.includes('verification failed') || error.message?.includes('untrusted')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}

export async function getPaymentStatus(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const orderId = String(req.params.orderId);
    const status = await paymentService.getPaymentStatus(req.user.id, orderId);
    return sendSuccess(res, status, 'Payment status fetched');
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}

export async function handleRazorpayWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      return sendError(res, 'Missing signature header', 400);
    }

    // Read raw body captured by raw body middleware
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    const result = await paymentService.handleWebhook(rawBody, signature);
    return res.status(200).json({ status: 'ok', data: result });
  } catch (error: any) {
    console.error('[Razorpay Webhook Error]:', error.message);
    if (error.message?.includes('Invalid webhook signature')) {
      return sendError(res, 'Signature mismatch', 400);
    }
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
