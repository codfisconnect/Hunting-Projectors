import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { generateToken } from '../utils/token.js';
import { emailService } from './emailService.js';
import { config } from '../config/env.js';

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

// In-memory rate limiting map for password reset attempts
const resetRateLimitMap = new Map<string, { count: number; firstAttempt: number }>();

function checkRateLimit(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = resetRateLimitMap.get(key);
  if (!record || now - record.firstAttempt > windowMs) {
    resetRateLimitMap.set(key, { count: 1, firstAttempt: now });
    return true;
  }
  if (record.count >= maxAttempts) {
    return false;
  }
  record.count += 1;
  return true;
}

/**
 * Sanitizes and validates client origin against explicitly approved production domains.
 * Prevents Host/Origin header injection into password reset or verification links.
 * Defaults securely to https://huntingprojector.in if no valid approved origin is provided.
 */
export function resolveSafeAuthOrigin(clientOrigin?: string): string {
  const defaultOrigin = 'https://huntingprojector.in';
  if (!clientOrigin || typeof clientOrigin !== 'string') {
    return defaultOrigin;
  }

  const trimmed = clientOrigin.trim().replace(/\/+$/, ''); // Remove trailing slashes

  // 1. Check primary and official Hunting Projectors domains
  if (/^https:\/\/(www\.)?huntingprojector\.in$/.test(trimmed)) {
    return trimmed;
  }

  // 2. Check NAP Computers apex and official subdomains
  if (/^https:\/\/(www\.|hunting\.|projectors\.)?napcomputers\.in$/.test(trimmed)) {
    return trimmed;
  }

  // 3. Check authorized Hunting Projectors Vercel deployment/preview domains
  if (/^https:\/\/hunting-projectors(-deploy)?(-[a-zA-Z0-9_-]+)*\.vercel\.app$/.test(trimmed)) {
    return trimmed;
  }

  // 4. In development mode only, permit localhost
  if (config.nodeEnv !== 'production') {
    if (trimmed === 'http://localhost:5173' || trimmed === 'http://127.0.0.1:5173') {
      return trimmed;
    }
  }

  // Fallback to default primary domain for any untrusted or unrecognized origin
  return defaultOrigin;
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

  /**
   * Request password reset token.
   * Generates a 256-bit cryptographically secure token, computes SHA-256 digest,
   * stores only the digest with a 15-minute expiration, and emails the reset link if SMTP configured.
   * Never leaks whether the email is registered.
   */
  async requestPasswordReset(email: string, clientOrigin?: string) {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      throw new Error('Email address is required.');
    }

    if (!checkRateLimit(`req_${trimmedEmail}`, 5, 15 * 60 * 1000)) {
      throw new Error('Too many password reset requests. Please try again after 15 minutes.');
    }

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
      select: { id: true, email: true, fullName: true }
    });

    if (user) {
      // 256-bit raw token
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      // Invalidate existing unused tokens for this user
      await prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() }
      }).catch(() => {});

      // Save token hash
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        }
      });

      // Resolve origin safely using strict whitelist, defaulting to https://huntingprojector.in
      const safeOrigin = resolveSafeAuthOrigin(clientOrigin || process.env.CLIENT_URL);
      const resetLink = `${safeOrigin}/reset-password?token=${rawToken}`;

      // Dispatch email if SMTP configured
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #0A0C10; color: #FFFFFF; padding: 32px; border-radius: 12px; border: 1px solid #1E2330;">
          <h2 style="color: #D4AF37; margin: 0 0 12px; font-size: 20px;">HUNTING PROJECTORS - PASSWORD RESET</h2>
          <p style="color: #A0AEC0; font-size: 14px; line-height: 1.6;">Hello ${user.fullName},</p>
          <p style="color: #A0AEC0; font-size: 14px; line-height: 1.6;">We received a request to reset your password for your Hunting Projectors by NAP Computers Electronics account. This link will expire in 15 minutes.</p>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${resetLink}" style="background: #D4AF37; color: #000000; padding: 12px 28px; border-radius: 6px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px;">Reset My Password</a>
          </div>
          <p style="color: #718096; font-size: 12px; line-height: 1.5;">If you did not request this password reset, please ignore this email or contact support at huntingprojectors@gmail.com. Your password remains safe.</p>
        </div>
      `;

      await emailService.sendEmail({
        to: user.email,
        subject: 'Password Reset Request - Hunting Projectors',
        html: emailHtml
      }).catch(err => {
        console.warn('[PasswordReset Email Delivery Note]:', err.message);
      });
    }

    // Generic safe message to prevent user enumeration
    return {
      message: 'If an account exists with that email address, you will receive password reset instructions shortly.'
    };
  }

  /**
   * Reset password using single-use SHA-256 token digest.
   * Performs the consumption and password update in a database transaction.
   */
  async resetPassword(rawToken: string, newPassword: string) {
    if (!rawToken || !newPassword) {
      throw new Error('Reset token and new password are required.');
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken.trim()).digest('hex');

    if (!checkRateLimit(`reset_${tokenHash}`, 10, 15 * 60 * 1000)) {
      throw new Error('Too many failed reset attempts. Please request a new link.');
    }

    const now = new Date();

    return await prisma.$transaction(async (tx) => {
      const resetRecord = await tx.passwordResetToken.findUnique({
        where: { tokenHash }
      });

      if (!resetRecord) {
        throw new Error('Invalid or expired password reset token.');
      }

      if (resetRecord.usedAt) {
        throw new Error('This password reset link has already been used. Please request a new one.');
      }

      if (resetRecord.expiresAt < now) {
        throw new Error('This password reset link has expired. Please request a new one.');
      }

      // Mark token as used
      await tx.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: now }
      });

      // Update password
      const newHash = await bcrypt.hash(newPassword, 10);
      await tx.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newHash }
      });

      return { success: true, message: 'Password has been reset successfully. You may now log in with your new password.' };
    });
  }
}

export const authService = new AuthService();
