import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
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
router.patch('/orders/:id/payment', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const { paymentStatus, notes, transactionReference } = req.body;
    
    if (!paymentStatus) {
      return sendError(res, 'Payment status is required', 400);
    }

    const validStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
    if (!validStatuses.includes(paymentStatus)) {
      return sendError(res, `Invalid payment status. Allowed: ${validStatuses.join(', ')}`, 400);
    }

    const trimmedReference = typeof transactionReference === 'string' ? transactionReference.trim() : '';

    if (paymentStatus === 'PAID' && !trimmedReference) {
      return sendError(res, 'Transaction reference is required when marking payment as PAID', 400);
    }

    const trimmedNotes = typeof notes === 'string' ? notes.trim() : '';

    const orderId = String(req.params.id);
    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new Error('Order not found');

      const appendNote = trimmedNotes || trimmedReference
        ? `[Payment Status changed to ${paymentStatus} by Admin${req.user?.email ? ` (${req.user.email})` : ''}${trimmedReference ? ` - Ref: ${trimmedReference}` : ''}${trimmedNotes ? ` - Notes: ${trimmedNotes}` : ''}]`
        : null;

      const dataToUpdate: any = {
        paymentStatus,
        internalNotes: appendNote ? (order.internalNotes ? `${order.internalNotes}\n${appendNote}` : appendNote) : order.internalNotes
      };

      if (paymentStatus === 'PAID' && order.orderStatus === 'PENDING') {
        dataToUpdate.orderStatus = 'CONFIRMED';
      }

      return tx.order.update({
        where: { id: orderId },
        data: dataToUpdate,
        include: { items: true }
      });
    });

    return sendSuccess(res, updated, 'Order payment status updated successfully by administrator');
  } catch (err: any) {
    const { sendError } = await import('../utils/response.js');
    return sendError(res, err.message || 'Failed to update order payment status', 500);
  }
});
router.get('/orders/:id/invoice', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const { BUSINESS_CONFIG } = await import('../config/businessConfig.js');

    const order = await prisma.order.findUnique({
      where: { id: String(req.params.id) },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!order) return sendError(res, 'Order not found', 404);

    // Read dynamic tax settings if configured
    const taxSetting = await prisma.storeSetting.findUnique({
      where: { key: 'tax_settings' }
    });
    let taxConfig: any = null;
    if (taxSetting?.value) {
      try {
        taxConfig = JSON.parse(taxSetting.value);
      } catch {}
    }

    const hasConfiguredGstin = Boolean(taxConfig?.businessGstin && taxConfig.businessGstin.trim());
    const gstinValue = hasConfiguredGstin ? taxConfig.businessGstin.trim() : null;
    const documentTitle = hasConfiguredGstin ? 'TAX INVOICE' : 'COMMERCIAL ORDER RECEIPT';

    const invoiceNumber = `INV-${order.orderNumber.replace(/^HPT-/, '')}`;
    const invoiceData = {
      invoiceNumber,
      invoiceDate: order.createdAt.toISOString().slice(0, 10),
      documentTitle,
      orderId: order.id,
      orderNumber: order.orderNumber,
      store: {
        name: BUSINESS_CONFIG.brandName,
        company: BUSINESS_CONFIG.companyName,
        address: `${BUSINESS_CONFIG.address.line1}, ${BUSINESS_CONFIG.address.line2}, ${BUSINESS_CONFIG.address.city}, ${BUSINESS_CONFIG.address.state} — ${BUSINESS_CONFIG.address.pincode}`,
        phone: BUSINESS_CONFIG.phone,
        email: BUSINESS_CONFIG.email,
        gstin: gstinValue,
        taxRegistered: hasConfiguredGstin
      },
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        address: order.addressLine,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        shippingAddress: order.shippingAddress
      },
      items: order.items.map(item => ({
        id: item.id,
        productName: item.productName || item.product?.name || 'Projector Unit',
        sku: item.sku || item.product?.sku || 'HPT-UNIT',
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        total: Number(item.unitPrice) * item.quantity
      })),
      pricing: {
        subtotal: Number(order.subtotal),
        shippingAmount: Number(order.shippingAmount),
        discountAmount: Number(order.discountAmount),
        taxAmount: Number(order.taxAmount),
        grandTotal: Number(order.totalAmount),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus
      }
    };

    return sendSuccess(res, invoiceData, 'Invoice generated successfully');
  } catch (err) { next(err); }
});

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

// 4b. Categories & Collections Management (full CRUD)
router.get('/categories', (req, res, next) => {
  req.query.includeInactive = 'true';
  return getCategories(req, res, next);
});
router.get('/categories/:identifier', getCategory);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

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

// 9. Customer Reviews & Testimonials Moderation
router.get('/reviews', async (req, res, next) => {
  try {
    const { reviewService } = await import('../services/reviewService.js');
    const { sendSuccess } = await import('../utils/response.js');
    const reviews = await reviewService.getAllReviews();
    return sendSuccess(res, reviews, 'Reviews retrieved successfully');
  } catch (err) { next(err); }
});

router.patch('/reviews/:id/moderate', async (req, res, next) => {
  try {
    const { reviewService } = await import('../services/reviewService.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const { action } = req.body;
    if (!action || !['approve', 'reject', 'hide', 'restore'].includes(action)) {
      return sendError(res, 'Valid action required: approve, reject, hide, restore', 400);
    }
    const updated = await reviewService.moderateReview(String(req.params.id), action);
    return sendSuccess(res, updated, `Review ${action}d successfully`);
  } catch (err) { next(err); }
});

// 10. Audit Trail / Activity Log
router.get('/audit-logs', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess } = await import('../utils/response.js');
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '50'), 10)));
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    return sendSuccess(res, logs, 'Audit logs retrieved');
  } catch (err) { next(err); }
});

// 11. Website CMS Settings (Hero, Banners, FAQs, Hours, Social, SEO)
router.get('/cms', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess } = await import('../utils/response.js');
    const settings = await prisma.storeSetting.findMany({
      where: {
        key: { in: ['cms_hero', 'cms_banners', 'cms_faqs', 'cms_announcement', 'cms_business_hours', 'cms_social_links', 'cms_seo'] }
      }
    });
    const cmsData: Record<string, any> = {};
    for (const s of settings) {
      try {
        cmsData[s.key] = JSON.parse(s.value);
      } catch {
        cmsData[s.key] = s.value;
      }
    }
    return sendSuccess(res, cmsData, 'CMS data retrieved');
  } catch (err) { next(err); }
});

router.post('/cms', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return sendError(res, 'Both key and value are required', 400);
    }
    const strVal = typeof value === 'string' ? value : JSON.stringify(value);
    const updated = await prisma.storeSetting.upsert({
      where: { key: String(key) },
      update: { value: strVal },
      create: { key: String(key), value: strVal }
    });

    // Record audit log
    const user = (req as any).user;
    await prisma.auditLog.create({
      data: {
        adminId: user?.id,
        adminEmail: user?.email,
        action: 'CMS_UPDATE',
        entity: 'StoreSetting',
        entityId: updated.id,
        details: { key, updatedBy: user?.email }
      }
    }).catch(() => {});

    return sendSuccess(res, updated, `CMS ${key} updated successfully`);
  } catch (err) { next(err); }
});

// 12. Complete Reports & Analytics Data Engine
router.get('/analytics', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess } = await import('../utils/response.js');
    const { range } = req.query; // 'today', '7d', '30d', 'this_month', 'prev_month', 'all'

    const now = new Date();
    let startDate: Date | undefined;

    if (range === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === 'this_month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === 'prev_month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    }

    const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

    const [orders, enquiries, products] = await Promise.all([
      prisma.order.findMany({
        where: dateFilter,
        include: { items: true },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.enquiry.findMany({
        where: dateFilter
      }),
      prisma.product.findMany({
        select: { id: true, name: true, sku: true, stock: true, price: true, isActive: true }
      })
    ]);

    // Financial Metrics
    let paidRevenue = 0;
    let pendingRevenue = 0;
    let cancelledOrdersCount = 0;

    const orderStatusCounts: Record<string, number> = {
      PENDING: 0, CONFIRMED: 0, PROCESSING: 0, DISPATCHED: 0, DELIVERED: 0, CANCELLED: 0
    };
    const paymentStatusCounts: Record<string, number> = {
      PENDING: 0, PAID: 0, FAILED: 0, REFUNDED: 0
    };

    const salesTimeline: Record<string, { date: string; paidSales: number; totalSales: number; ordersCount: number }> = {};
    const productSalesMap: Record<string, { name: string; sku: string; unitsSold: number; revenue: number }> = {};

    for (const o of orders) {
      const isPaid = o.paymentStatus === 'PAID';
      const isCancelled = o.orderStatus === 'CANCELLED';
      const amt = Number(o.totalAmount);

      if (isCancelled) {
        cancelledOrdersCount++;
      } else if (isPaid) {
        paidRevenue += amt;
      } else {
        pendingRevenue += amt;
      }

      orderStatusCounts[o.orderStatus] = (orderStatusCounts[o.orderStatus] || 0) + 1;
      paymentStatusCounts[o.paymentStatus] = (paymentStatusCounts[o.paymentStatus] || 0) + 1;

      // Group sales by day
      const dayKey = o.createdAt.toISOString().slice(0, 10);
      if (!salesTimeline[dayKey]) {
        salesTimeline[dayKey] = { date: dayKey, paidSales: 0, totalSales: 0, ordersCount: 0 };
      }
      salesTimeline[dayKey].ordersCount++;
      if (!isCancelled) {
        salesTimeline[dayKey].totalSales += amt;
        if (isPaid) salesTimeline[dayKey].paidSales += amt;
      }

      // Track item sales
      if (!isCancelled) {
        for (const item of o.items) {
          const key = String(item.productId || item.productName || 'unknown-item');
          if (!productSalesMap[key]) {
            productSalesMap[key] = { name: item.productName || 'Projector Unit', sku: item.sku || 'HP-SKU', unitsSold: 0, revenue: 0 };
          }
          productSalesMap[key].unitsSold += item.quantity;
          productSalesMap[key].revenue += Number(item.unitPrice) * item.quantity;
        }
      }
    }

    // Enquiry conversion
    const totalEnquiries = enquiries.length;
    const convertedEnquiries = enquiries.filter(e => e.status === 'CONVERTED').length;
    const conversionRate = totalEnquiries > 0 ? ((convertedEnquiries / totalEnquiries) * 100).toFixed(1) : '0';

    // Inventory status
    const adequateStock = products.filter(p => p.stock > 5).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter(p => p.stock <= 0).length;

    return sendSuccess(res, {
      summary: {
        paidRevenue,
        pendingRevenue,
        totalOrders: orders.length,
        cancelledOrders: cancelledOrdersCount,
        totalEnquiries,
        convertedEnquiries,
        conversionRate: `${conversionRate}%`
      },
      orderStatusDistribution: orderStatusCounts,
      paymentStatusDistribution: paymentStatusCounts,
      salesTimeline: Object.values(salesTimeline),
      productPerformance: Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 8),
      inventoryDistribution: { adequate: adequateStock, lowStock, outOfStock }
    }, 'Analytics report computed');
  } catch (err) { next(err); }
});

// 13. Warranty & Service (RMA) Endpoints
router.get('/warranties', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess } = await import('../utils/response.js');
    const { q, status } = req.query;

    const where: any = {};
    if (status && status !== 'all') where.status = String(status);
    if (q) {
      where.OR = [
        { customerName: { contains: String(q), mode: 'insensitive' } },
        { customerPhone: { contains: String(q) } },
        { serialNumber: { contains: String(q), mode: 'insensitive' } },
        { orderNumber: { contains: String(q), mode: 'insensitive' } },
        { productName: { contains: String(q), mode: 'insensitive' } }
      ];
    }

    const warranties = await prisma.warrantyRecord.findMany({
      where,
      include: { serviceRequests: true },
      orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, warranties, 'Warranty records retrieved');
  } catch (err) { next(err); }
});

router.post('/warranties', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const {
      orderId, orderNumber, productId, productName, productSku,
      serialNumber, customerName, customerPhone, customerEmail,
      purchaseDate, warrantyMonths, warrantyTerms, notes
    } = req.body;

    if (!productName || !customerName || !customerPhone) {
      return sendError(res, 'Product Name, Customer Name, and Phone are required.', 400);
    }

    const pDate = purchaseDate ? new Date(purchaseDate) : new Date();
    const months = warrantyMonths ? Number(warrantyMonths) : 24;
    const expiry = new Date(pDate);
    expiry.setMonth(expiry.getMonth() + months);

    const record = await prisma.warrantyRecord.create({
      data: {
        orderId,
        orderNumber,
        productId: productId || 'custom-model',
        productName,
        productSku,
        serialNumber: serialNumber?.trim() || null,
        customerName,
        customerPhone,
        customerEmail,
        purchaseDate: pDate,
        warrantyMonths: months,
        warrantyExpiry: expiry,
        warrantyTerms: warrantyTerms || '2 Years Official Brand Warranty (Covering Optical Engine & Electronics)',
        status: expiry < new Date() ? 'EXPIRED' : 'ACTIVE',
        notes
      }
    });

    const user = (req as any).user;
    await prisma.auditLog.create({
      data: {
        adminId: user?.id,
        adminEmail: user?.email,
        action: 'WARRANTY_CREATE',
        entity: 'WarrantyRecord',
        entityId: record.id,
        details: { customerName, productName, serialNumber }
      }
    }).catch(() => {});

    return sendSuccess(res, record, 'Warranty record registered successfully');
  } catch (err) { next(err); }
});

router.get('/service-tickets', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess } = await import('../utils/response.js');
    const { status, q } = req.query;

    const where: any = {};
    if (status && status !== 'all') where.status = String(status);
    if (q) {
      where.OR = [
        { ticketNumber: { contains: String(q), mode: 'insensitive' } },
        { customerName: { contains: String(q), mode: 'insensitive' } },
        { customerPhone: { contains: String(q) } },
        { serialNumber: { contains: String(q), mode: 'insensitive' } }
      ];
    }

    const tickets = await prisma.serviceTicket.findMany({
      where,
      include: { warrantyRecord: true },
      orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, tickets, 'Service tickets retrieved');
  } catch (err) { next(err); }
});

router.post('/service-tickets', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const {
      warrantyRecordId, orderId, orderNumber, serialNumber,
      customerName, customerPhone, customerEmail, productName,
      issueType, issueDescription, serviceNotes, priority
    } = req.body;

    if (!customerName || !customerPhone || !issueDescription || !productName) {
      return sendError(res, 'Customer Name, Phone, Product Name, and Issue Description are required', 400);
    }

    const ticketNumber = `RMA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const ticket = await prisma.serviceTicket.create({
      data: {
        ticketNumber,
        warrantyRecordId,
        orderId,
        orderNumber,
        serialNumber,
        customerName,
        customerPhone,
        customerEmail,
        productName,
        issueType: issueType || 'HARDWARE',
        issueDescription,
        serviceNotes,
        priority: priority || 'NORMAL',
        status: 'OPEN'
      }
    });

    const user = (req as any).user;
    await prisma.auditLog.create({
      data: {
        adminId: user?.id,
        adminEmail: user?.email,
        action: 'RMA_TICKET_CREATE',
        entity: 'ServiceTicket',
        entityId: ticket.id,
        details: { ticketNumber, customerName, issueType }
      }
    }).catch(() => {});

    return sendSuccess(res, ticket, 'Service ticket created successfully');
  } catch (err) { next(err); }
});

router.patch('/service-tickets/:id/status', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const { status, serviceNotes } = req.body;

    const validStatuses = ['OPEN', 'UNDER_REVIEW', 'AWAITING_CUSTOMER', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const updateData: any = { status };
    if (serviceNotes !== undefined) updateData.serviceNotes = serviceNotes;
    if (status === 'RESOLVED') updateData.resolvedAt = new Date();

    const updated = await prisma.serviceTicket.update({
      where: { id: String(req.params.id) },
      data: updateData
    });

    return sendSuccess(res, updated, `Ticket status updated to ${status}`);
  } catch (err) { next(err); }
});

// 14. Quotations Management Endpoints
router.get('/quotations', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess } = await import('../utils/response.js');
    const quotations = await prisma.quotation.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, quotations, 'Quotations retrieved');
  } catch (err) { next(err); }
});

router.post('/quotations', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const {
      customerName, customerPhone, customerEmail, companyName,
      city, state, validDays, discountAmount, shippingAmount,
      taxAmount, notes, items
    } = req.body;

    if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 'Customer Name, Phone, and at least one item are required.', 400);
    }

    let subtotal = 0;
    const quotationItems = items.map((it: any) => {
      const q = Number(it.quantity || 1);
      const u = Number(it.unitPrice || 0);
      const tot = q * u;
      subtotal += tot;
      return {
        productId: it.productId || null,
        productName: it.productName,
        sku: it.sku || null,
        quantity: q,
        unitPrice: u,
        total: tot
      };
    });

    const disc = Number(discountAmount || 0);
    const ship = Number(shippingAmount || 0);
    const tax = Number(taxAmount || 0);
    const totalAmount = Math.max(0, subtotal - disc + ship + tax);

    const quotationNumber = `QT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + Number(validDays || 15));

    const quote = await prisma.quotation.create({
      data: {
        quotationNumber,
        customerName,
        customerPhone,
        customerEmail,
        companyName,
        city,
        state,
        validUntil,
        subtotal,
        discountAmount: disc,
        shippingAmount: ship,
        taxAmount: tax,
        totalAmount,
        notes,
        status: 'DRAFT',
        items: {
          create: quotationItems
        }
      },
      include: { items: true }
    });

    const user = (req as any).user;
    await prisma.auditLog.create({
      data: {
        adminId: user?.id,
        adminEmail: user?.email,
        action: 'QUOTATION_CREATE',
        entity: 'Quotation',
        entityId: quote.id,
        details: { quotationNumber, customerName, totalAmount }
      }
    }).catch(() => {});

    return sendSuccess(res, quote, 'Quotation drafted successfully');
  } catch (err) { next(err); }
});

router.patch('/quotations/:id/status', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const { status } = req.body;
    const valid = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED'];
    if (!valid.includes(status)) {
      return sendError(res, `Status must be one of: ${valid.join(', ')}`, 400);
    }
    const updated = await prisma.quotation.update({
      where: { id: String(req.params.id) },
      data: { status }
    });
    return sendSuccess(res, updated, `Quotation status updated to ${status}`);
  } catch (err) { next(err); }
});

router.post('/quotations/:id/convert-to-order', async (req, res, next) => {
  try {
    const { prisma } = await import('../config/database.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');

    const quote = await prisma.quotation.findUnique({
      where: { id: String(req.params.id) },
      include: { items: true }
    });

    if (!quote) return sendError(res, 'Quotation not found', 404);
    if (quote.convertedOrderId) return sendError(res, 'Quotation has already been converted to an order', 400);

    const orderNumber = `HPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: quote.customerName,
        customerPhone: quote.customerPhone,
        customerEmail: quote.customerEmail || 'customer@napcomputers.in',
        addressLine: quote.city ? `${quote.city}, ${quote.state || 'India'}` : 'Direct Showroom Delivery',
        city: quote.city || 'Chennai',
        state: quote.state || 'Tamil Nadu',
        pincode: '600002',
        subtotal: Number(quote.subtotal),
        discountAmount: Number(quote.discountAmount),
        shippingAmount: Number(quote.shippingAmount),
        taxAmount: Number(quote.taxAmount),
        totalAmount: Number(quote.totalAmount),
        orderStatus: 'CONFIRMED',
        paymentStatus: 'PENDING', // STRICT SECURITY: Never mark PAID on quotation conversion
        paymentMethod: 'QUOTATION_INVOICE_CONVERSION',
        items: {
          create: quote.items.map(it => ({
            productId: it.productId || 'custom-item',
            productName: it.productName,
            sku: it.sku || 'HPT-UNIT',
            quantity: it.quantity,
            unitPrice: Number(it.unitPrice)
          }))
        }
      }
    });

    // Mark quotation converted
    await prisma.quotation.update({
      where: { id: quote.id },
      data: { status: 'CONVERTED', convertedOrderId: newOrder.id }
    });

    return sendSuccess(res, newOrder, `Quotation converted to Order ${orderNumber} (Payment PENDING)`);
  } catch (err) { next(err); }
});

// 12. Bulk Product CSV Import
router.post('/products/bulk-import', async (req, res, next) => {
  try {
    const { productService } = await import('../services/productService.js');
    const { prisma } = await import('../config/database.js');
    const { sendSuccess, sendError } = await import('../utils/response.js');
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return sendError(res, 'An array of products is required for bulk import', 400);
    }

    const created: any[] = [];
    const errors: { row: number; name?: string; error: string }[] = [];

    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      try {
        if (!item.name || !item.sku || !item.price) {
          throw new Error('Name, SKU, and Price are required fields.');
        }

        // Check if SKU exists
        const existing = await prisma.product.findUnique({ where: { sku: item.sku } });
        if (existing) {
          throw new Error(`SKU "${item.sku}" already exists.`);
        }

        // Find or fallback to first available category
        const cat = await prisma.category.findFirst({
          where: item.category ? { slug: item.category } : undefined
        }) || await prisma.category.findFirst();

        if (!cat) {
          throw new Error('No categories found in store. Please create at least one category first.');
        }

        const slug = item.slug || (item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.floor(Math.random() * 1000));

        const newProd = await productService.createProduct({
          name: item.name,
          slug,
          sku: item.sku,
          categoryId: cat.id,
          price: Number(item.price),
          compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : undefined,
          stock: Number(item.stock || 10),
          shortDescription: item.shortDescription || item.name,
          description: item.description ? (Array.isArray(item.description) ? item.description : [item.description]) : [item.name],
          whatsIncluded: item.whatsIncluded ? (Array.isArray(item.whatsIncluded) ? item.whatsIncluded : [item.whatsIncluded]) : ['Projector Unit', 'Power Cable', 'Remote Control', 'Manual'],
          recommendedUse: item.recommendedUse ? (Array.isArray(item.recommendedUse) ? item.recommendedUse : [item.recommendedUse]) : ['Home Cinema', 'Gaming'],
          isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
          isFeatured: Boolean(item.isFeatured),
          warranty: item.warranty || '2 Years Official Brand Warranty'
        });
        created.push(newProd);
      } catch (err: any) {
        errors.push({ row: i + 1, name: item.name, error: err.message || 'Import error' });
      }
    }

    // Record audit log
    const user = (req as any).user;
    await prisma.auditLog.create({
      data: {
        adminId: user?.id,
        adminEmail: user?.email,
        action: 'BULK_IMPORT',
        entity: 'Product',
        details: { importedCount: created.length, failedCount: errors.length }
      }
    }).catch(() => {});

    return sendSuccess(res, { createdCount: created.length, created, errors }, `Imported ${created.length} products, ${errors.length} failed`);
  } catch (err) { next(err); }
});

export default router;
