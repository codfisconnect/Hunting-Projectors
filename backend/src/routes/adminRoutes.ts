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
  createProduct,
  updateProduct,
  deleteProduct
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

// 4. Products Management
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
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
