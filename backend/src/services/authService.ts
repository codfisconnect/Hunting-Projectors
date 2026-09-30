import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { generateToken } from '../utils/token.js';

export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterDTO) {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedName = data.fullName.trim();

    if (!trimmedEmail || !trimmedName || !data.password) {
      throw new Error('Name, email, and password are required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Please provide a valid email address.');
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    });

    if (existingUser) {
      throw new Error('An account with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        fullName: trimmedName,
        passwordHash,
        phoneNumber: data.phoneNumber?.trim() || null,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
      }
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(data: LoginDTO) {
    const trimmedEmail = data.email.trim().toLowerCase();

    if (!trimmedEmail || !data.password) {
      throw new Error('Email and password are required.');
    }

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    });

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      createdAt: user.createdAt,
    };

    return { user: safeUser, token };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        _count: {
          select: {
            orders: true,
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found.');
    }

    return user;
  }
}

export const authService = new AuthService();
