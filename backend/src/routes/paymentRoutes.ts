import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  handleRazorpayWebhook
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public Webhook route (authenticated via HMAC signature, not JWT)
router.post('/webhooks/razorpay', handleRazorpayWebhook);

// Customer authenticated payment routes
router.post('/create-order', authenticate, createPaymentOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/status/:orderId', authenticate, getPaymentStatus);

export default router;
