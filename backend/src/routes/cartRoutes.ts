import { Router } from 'express';
import {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  mergeGuestCart
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate); // Persistent cart requires authentication

router.get('/', getCart);
router.post('/', addItem);
router.post('/items', addItem);
router.patch('/items/:id', updateQuantity);
router.delete('/items/:id', removeItem);
router.delete('/', clearCart);
router.post('/merge', mergeGuestCart);

export default router;
