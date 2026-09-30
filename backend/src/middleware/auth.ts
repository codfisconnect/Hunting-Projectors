import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/token.js';
import { prisma } from '../config/database.js';
import { sendError } from '../utils/response.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token required', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      return sendError(res, 'Invalid or expired session. Please log in again.', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, fullName: true, role: true }
    });

    if (!user) {
      return sendError(res, 'User account no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);
      if (payload) {
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
          select: { id: true, email: true, fullName: true, role: true }
        });
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  } catch {
    next();
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Forbidden: insufficient permissions', 403);
    }
    next();
  };
}
