import { Router } from 'express';
import {
  calculateCheckout,
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
  confirmTestPayment
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate); // Order routes require authentication

router.post('/calculate', calculateCheckout);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/:id/cancel', cancelOrder);
// NOTE: Self-service payment simulation endpoint has been disabled for production readiness.
// router.post('/:id/confirm-payment', confirmTestPayment);

export default router;
