import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  mergeWishlist
} from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate); // Wishlist persistence requires authentication

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:id', removeFromWishlist);
router.post('/merge', mergeWishlist);

export default router;
