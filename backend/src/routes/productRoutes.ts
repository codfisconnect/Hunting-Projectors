import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/id/:id', getProductById);
router.get('/:slug', getProductBySlug);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
