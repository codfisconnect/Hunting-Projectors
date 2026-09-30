import { Router } from 'express';
import { getReviews, getProductReviews, createReview } from '../controllers/reviewController.js';

const router = Router();

router.get('/', getReviews);
router.get('/product/:productId', getProductReviews);
router.post('/', createReview);

export default router;
