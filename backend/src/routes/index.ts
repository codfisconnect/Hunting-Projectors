import { Router } from 'express';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import reviewRoutes from './reviewRoutes.js';

const router = Router();

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
