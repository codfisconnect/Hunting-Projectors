import { prisma } from '../config/database.js';

export interface UpdateProfileDTO {
  fullName?: string;
  name?: string;
  phoneNumber?: string;
  phone?: string;
  email?: string;
}

export class CustomerService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'desc' }
          ]
        },
        _count: {
          select: {
            orders: true,
          }
        }
      }
    });

    if (!user) {
      throw new Error('Customer account not found.');
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileDTO) {
    const updateData: { fullName?: string; phoneNumber?: string; email?: string } = {};

    const name = data.fullName || data.name;
    if (name && name.trim()) {
      updateData.fullName = name.trim();
    }

    const phone = data.phoneNumber || data.phone;
    if (phone !== undefined) {
      updateData.phoneNumber = phone.trim() || undefined;
    }

    if (data.email) {
      const email = data.email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please provide a valid email address.');
      }

      const existing = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId }
        }
      });

      if (existing) {
        throw new Error('This email address is already in use by another account.');
      }

      updateData.email = email;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        updatedAt: true,
      }
    });

    return updated;
  }
}

export const customerService = new CustomerService();
