import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getOverview,
  getOrders,
  updateOrderStatus,
  getCustomers,
  getCustomerProfile,
  getInventory,
  adjustInventory,
  getEnquiries,
  updateEnquiryStatus,
  getNotifications,
  markNotificationAsRead,
  getSettings,
  uploadProductImage
} from '../controllers/adminController.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = Router();

// Protect ALL admin routes with token authentication & ADMIN role
router.use(authenticate);
router.use(requireRole(['ADMIN']));

// 1. Dashboard Overview Stats
router.get('/overview', getOverview);

// 2. Orders Management
router.get('/orders', getOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// 3. Customers Management
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerProfile);

// 4. Products Management (full CRUD — always includes inactive products for admin)
router.get('/products', (req, res, next) => {
  // Force includeInactive=true for admin product list
  req.query.includeInactive = 'true';
  return getProducts(req, res, next);
});
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Reactivate a product (restore isActive=true)
router.patch('/products/:id/reactivate', async (req, res, next) => {
  try {
    const { productService } = await import('../services/productService.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const id = String(req.params.id);
    const existing = await productService.getProductById(id);
    if (!existing) return sendError(res, `Product '${id}' not found`, 404);
    const updated = await productService.updateProduct(id, { isActive: true });
    return sendSuccess(res, updated, 'Product reactivated successfully');
  } catch (err) {
    next(err);
  }
});

router.post('/upload', upload.single('image'), uploadProductImage);

// 5. Inventory Management
router.get('/inventory', getInventory);
router.post('/inventory/adjust', adjustInventory);

// 6. Enquiries Management
router.get('/enquiries', getEnquiries);
router.patch('/enquiries/:id/status', updateEnquiryStatus);

// 7. Notification Center
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationAsRead);

// 8. Settings & Integrations
router.get('/settings', getSettings);

export default router;
