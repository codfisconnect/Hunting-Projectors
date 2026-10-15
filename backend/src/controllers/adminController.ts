import { Request, Response, NextFunction } from 'express';
import { adminDashboardService } from '../services/adminDashboardService.js';
import { productService } from '../services/productService.js';
import { emailService } from '../services/emailService.js';
import { whatsappService } from '../services/whatsappService.js';
import { notificationService } from '../services/notificationService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getOverview(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const data = await adminDashboardService.getOverviewStats({ from, to });
    sendSuccess(res, data, 'Overview statistics retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve overview stats', 500);
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, paymentStatus, search, page, limit } = req.query as any;
    const data = await adminDashboardService.getOrdersList({
      status,
      paymentStatus,
      search,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20
    });
    sendSuccess(res, data, 'Orders retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve orders', 500);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { status, notes, trackingCarrier, trackingNumber } = req.body;
    
    if (!status) {
      return sendError(res, 'New order status is required', 400);
    }

    const updated = await adminDashboardService.updateOrderStatus(
      id,
      status,
      notes,
      trackingCarrier,
      trackingNumber,
      req.user
    );

    // Send email alert to customer on status update
    emailService.sendOrderStatusUpdate(updated, status, {
      carrier: trackingCarrier,
      trackingNumber
    }).catch(e => console.warn('[Auto Email Warning]:', e.message));

    sendSuccess(res, updated, `Order status updated to ${status}`);
  } catch (err: any) {
    sendError(res, err.message || 'Failed to update order status', 500);
  }
}

export async function getCustomers(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, search } = req.query as any;
    const data = await adminDashboardService.getCustomersList(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      search
    );
    sendSuccess(res, data, 'Customers retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve customers', 500);
  }
}

export async function getCustomerProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const customer = await adminDashboardService.getCustomerDetails(id);
    sendSuccess(res, customer, 'Customer profile retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Customer not found', 404);
  }
}

export async function getInventory(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, lowStock } = req.query as any;
    const list = await adminDashboardService.getInventoryList(search, lowStock === 'true');
    sendSuccess(res, list, 'Inventory retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve inventory', 500);
  }
}

export async function adjustInventory(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId, adjustment, reason } = req.body;
    if (!productId || adjustment === undefined) {
      return sendError(res, 'Product ID and adjustment number are required', 400);
    }

    const updated = await adminDashboardService.adjustStock(
      productId,
      Number(adjustment),
      reason || 'MANUAL_ADJUSTMENT',
      req.user?.id,
      req.user?.email
    );

    // Trigger low stock notification if <= 5
    if (updated.stock <= 5) {
      notificationService.createNotification({
        type: 'LOW_STOCK',
        title: `Low Stock Alert: ${updated.name}`,
        message: `Only ${updated.stock} units remaining in inventory for ${updated.name}.`,
        linkUrl: `/admin/inventory?search=${encodeURIComponent(updated.name)}`
      }).catch(() => {});
    }

    sendSuccess(res, updated, 'Inventory stock adjusted');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to adjust stock', 500);
  }
}

export async function getEnquiries(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, search } = req.query as any;
    const list = await adminDashboardService.getEnquiriesList(status, search);
    sendSuccess(res, list, 'Customer enquiries retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve enquiries', 500);
  }
}

export async function updateEnquiryStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const updated = await adminDashboardService.updateEnquiryStatus(id, status);
    sendSuccess(res, updated, 'Enquiry status updated');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to update enquiry status', 500);
  }
}

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, onlyUnread } = req.query as any;
    const result = await notificationService.getNotifications(
      limit ? Number(limit) : 50,
      onlyUnread === 'true'
    );
    sendSuccess(res, result, 'Notifications retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve notifications', 500);
  }
}

export async function markNotificationAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    if (id === 'all') {
      await notificationService.markAllAsRead();
      return sendSuccess(res, null, 'All notifications marked as read');
    }
    const updated = await notificationService.markAsRead(id);
    sendSuccess(res, updated, 'Notification marked as read');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to update notification', 500);
  }
}


export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const emailStatus = emailService.getStatus();
    const whatsappStatus = whatsappService.getStatus();

    sendSuccess(res, {
      store: {
        name: 'Hunting Projectors',
        company: 'NAP Computers & Electronics',
        location: 'Chennai, Tamil Nadu, India',
        phone: '+91 94440 12345',
        email: 'sales@huntingprojectors.com'
      },
      integrations: {
        email: emailStatus,
        whatsapp: whatsappStatus,
        storage: { provider: 'Local / Assets Store', active: true }
      }
    }, 'Settings retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve settings', 500);
  }
}

export async function uploadProductImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return sendError(res, 'No image file uploaded', 400);
    }

    const publicUrl = `/assets/uploads/${req.file.filename}`;
    sendSuccess(res, {
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    }, 'Product image uploaded successfully');
  } catch (err: any) {
    sendError(res, err.message || 'Image upload failed', 500);
  }
}
