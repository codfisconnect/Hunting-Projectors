import { Router } from 'express';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import authRoutes from './authRoutes.js';
import customerRoutes from './customerRoutes.js';
import addressRoutes from './addressRoutes.js';
import cartRoutes from './cartRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import orderRoutes from './orderRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/addresses', addressRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/contact', enquiryRoutes); // Alias for contact form enquiries
router.use('/reviews', reviewRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: 'Hunting Projectors',
    supplier: 'NAP Computers & Electronics',
    location: 'Chennai, Tamil Nadu, India',
    timestamp: new Date().toISOString()
  });
});

export default router;
