import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
} from '../controllers/productController.js';

const router = Router();

// Public read-only product endpoints
router.get('/', getProducts);
router.get('/id/:id', getProductById);
router.get('/:slug', getProductBySlug);

// POST, PUT, DELETE are intentionally absent here.
// All product mutation operations are protected under /api/admin/products.

export default router;
