import { Router } from 'express';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import cmsRoutes from './cmsRoutes.js';
import authRoutes from './authRoutes.js';
import customerRoutes from './customerRoutes.js';
import addressRoutes from './addressRoutes.js';
import cartRoutes from './cartRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import adminRoutes from './adminRoutes.js';
import jobRoutes from './jobRoutes.js';
import { getSitemapXml } from '../controllers/sitemapController.js';

const router = Router();

// Dynamic XML Sitemap for Search Engines
router.get('/sitemap.xml', getSitemapXml);

router.use('/admin', adminRoutes);
router.use('/jobs', jobRoutes);
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/addresses', addressRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/payment', paymentRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/contact', enquiryRoutes); // Alias for contact form enquiries
router.use('/reviews', reviewRoutes);
router.use('/cms', cmsRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: 'Hunting Projector',
    supplier: 'Nap Computers Electronicss',
    location: 'Chennai, Tamil Nadu, India',
    timestamp: new Date().toISOString()
  });
});

export default router;
