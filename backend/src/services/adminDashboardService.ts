import { prisma } from '../config/database.js';

export class AdminDashboardService {
  async getOverviewStats(dateRange?: { from?: string; to?: string }) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const fromDate = dateRange?.from ? new Date(dateRange.from) : undefined;
    const toDate = dateRange?.to ? new Date(dateRange.to) : undefined;

    const dateFilter: any = {};
    if (fromDate || toDate) {
      dateFilter.createdAt = {};
      if (fromDate) dateFilter.createdAt.gte = fromDate;
      if (toDate) dateFilter.createdAt.lte = toDate;
    }

    // 1. Fetch Orders Aggregations
    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      allOrders
    ] = await Promise.all([
      prisma.order.count({ where: dateFilter }),
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { orderStatus: 'PENDING', ...dateFilter } }),
      prisma.order.count({ where: { orderStatus: 'PROCESSING', ...dateFilter } }),
      prisma.order.count({ where: { orderStatus: 'DELIVERED', ...dateFilter } }),
      prisma.order.count({ where: { orderStatus: 'CANCELLED', ...dateFilter } }),
      prisma.order.findMany({
        where: dateFilter,
        select: {
          totalAmount: true,
          paymentStatus: true,
          orderStatus: true,
          createdAt: true
        }
      })
    ]);

    // Truthful revenue calculation: Only PAID orders, avoiding double-counting or failed payments
    let totalRevenue = 0;
    let failedPayments = 0;
    for (const ord of allOrders) {
      if (ord.paymentStatus === 'PAID') {
        totalRevenue += Number(ord.totalAmount);
      } else if (ord.paymentStatus === 'FAILED') {
        failedPayments += 1;
      }
    }

    // 2. Customers, Products, Enquiries & Low Stock
    const [
      totalCustomers,
      activeProducts,
      lowStockProducts,
      pendingEnquiries,
      unreadNotifications
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.adminNotification.count({ where: { isRead: false } })
    ]);

    // 3. Recent activities
    const [recentOrders, recentCustomers, recentEnquiries] = await Promise.all([
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            take: 2,
            select: { productName: true, quantity: true, unitPrice: true }
          }
        }
      }),
      prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          createdAt: true
        }
      }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          referenceId: true,
          fullName: true,
          city: true,
          productName: true,
          status: true,
          createdAt: true
        }
      })
    ]);

    return {
      stats: {
        totalOrders,
        todayOrders,
        totalRevenue,
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        totalCustomers,
        activeProducts,
        lowStockProducts,
        pendingEnquiries,
        failedPayments,
        unreadNotifications
      },
      recent: {
        orders: recentOrders,
        customers: recentCustomers,
        enquiries: recentEnquiries
      }
    };
  }

  // Inventory Management Actions
  async getInventoryList(search?: string, lowStockOnly = false) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (lowStockOnly) {
      where.stock = { lte: 5 };
    }

    return prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        price: true,
        availability: true,
        isActive: true,
        images: { where: { viewType: 'hero' }, take: 1, select: { url: true } }
      },
      orderBy: { stock: 'asc' }
    });
  }

  async adjustStock(productId: string, adjustment: number, reason: string, adminId?: string, adminEmail?: string) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error('Product not found');

      const newQuantity = product.stock + adjustment;
      if (newQuantity < 0) {
        throw new Error(`Insufficient stock. Current: ${product.stock}, attempted change: ${adjustment}`);
      }

      const updated = await tx.product.update({
        where: { id: productId },
        data: {
          stock: newQuantity,
          availability: newQuantity > 0 ? 'in-stock' : 'out-of-stock'
        }
      });

      await tx.inventoryMovement.create({
        data: {
          productId,
          changeAmount: adjustment,
          newQuantity,
          reason,
          adminId,
          adminEmail
        }
      });

      return updated;
    });
  }

  // Customer Management
  async getCustomersList(page = 1, limit = 20, search?: string) {
    const where: any = { role: 'CUSTOMER' };
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          role: true,
          createdAt: true,
          _count: { select: { orders: true } },
          orders: {
            where: { paymentStatus: 'PAID' },
            select: { totalAmount: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Map total spending
    const mapped = customers.map(c => {
      const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
      const { orders, ...rest } = c;
      return {
        ...rest,
        totalSpent,
        totalOrders: c._count.orders
      };
    });

    return { customers: mapped, pagination: { total, page, limit } };
  }

  async getCustomerDetails(customerId: string) {
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        addresses: true,
        enquiries: { orderBy: { createdAt: 'desc' } },
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              select: {
                id: true,
                productName: true,
                quantity: true,
                unitPrice: true
              }
            }
          }
        }
      }
    });

    if (!customer) throw new Error('Customer not found');

    const totalSpent = customer.orders
      .filter(o => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    return {
      ...customer,
      totalSpent
    };
  }

  // Order Management Details & Status Update
  async getOrdersList(filters?: { status?: string; paymentStatus?: string; search?: string; page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.status && filters.status !== 'all') {
      where.orderStatus = filters.status;
    }
    if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
      where.paymentStatus = filters.paymentStatus;
    }
    if (filters?.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { customerName: { contains: filters.search, mode: 'insensitive' } },
        { customerEmail: { contains: filters.search, mode: 'insensitive' } },
        { customerPhone: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: { where: { viewType: 'hero' }, take: 1, select: { url: true } }
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    return { orders, pagination: { total, page, limit } };
  }

  async updateOrderStatus(orderId: string, newStatus: any, notes?: string, carrier?: string, trackingNumber?: string, adminUser?: any) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new Error('Order not found');

      const oldStatus = order.orderStatus;

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: newStatus,
          trackingCarrier: carrier !== undefined ? carrier : order.trackingCarrier,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : order.trackingNumber,
          internalNotes: notes ? (order.internalNotes ? `${order.internalNotes}\n${notes}` : notes) : order.internalNotes
        }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          fromStatus: oldStatus,
          toStatus: newStatus,
          changedById: adminUser?.id,
          changedByName: adminUser?.fullName || adminUser?.email,
          notes
        }
      });

      return updated;
    });
  }

  // Enquiry Management
  async getEnquiriesList(status?: string, search?: string) {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { referenceId: { contains: search, mode: 'insensitive' } }
      ];
    }

    return prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true, price: true, slug: true } }
      }
    });
  }

  async updateEnquiryStatus(id: string, status: any) {
    return prisma.enquiry.update({
      where: { id },
      data: { status }
    });
  }
}

export const adminDashboardService = new AdminDashboardService();
