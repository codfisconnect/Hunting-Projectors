import { prisma } from '../config/database.js';

export interface CreateNotificationDTO {
  type: 'NEW_ORDER' | 'FAILED_PAYMENT' | 'CANCELLATION' | 'LOW_STOCK' | 'NEW_ENQUIRY' | 'EMAIL_FAILURE' | 'WHATSAPP_FAILURE';
  title: string;
  message: string;
  linkUrl?: string;
  metadata?: any;
}

export class NotificationService {
  async createNotification(dto: CreateNotificationDTO) {
    try {
      return await prisma.adminNotification.create({
        data: {
          type: dto.type,
          title: dto.title,
          message: dto.message,
          linkUrl: dto.linkUrl,
          metadata: dto.metadata || {}
        }
      });
    } catch (err) {
      console.warn('[NotificationService Error]:', err);
      return null;
    }
  }

  async getNotifications(limit = 50, onlyUnread = false) {
    const where: any = {};
    if (onlyUnread) {
      where.isRead = false;
    }

    const [items, unreadCount] = await Promise.all([
      prisma.adminNotification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit
      }),
      prisma.adminNotification.count({ where: { isRead: false } })
    ]);

    return { items, unreadCount };
  }

  async markAsRead(id: string) {
    return prisma.adminNotification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async markAllAsRead() {
    return prisma.adminNotification.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    });
  }
}

export const notificationService = new NotificationService();
