import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, fullName, email, password, phone, phoneNumber } = req.body;
    const result = await authService.register({
      fullName: fullName || name || '',
      email: email || '',
      password: password || '',
      phoneNumber: phoneNumber || phone || '',
    });

    return sendSuccess(res, result, 'Registration successful', 201);
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      return sendError(res, error.message, 409);
    }
    if (
      !error.message?.includes('prisma') &&
      !error.message?.includes('DATABASE_URL') &&
      (error.message?.includes('required') || error.message?.includes('valid') || error.message?.includes('Password'))
    ) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({
      email: email || '',
      password: password || '',
    });

    return sendSuccess(res, result, 'Login successful', 200);
  } catch (error: any) {
    if (error.message?.includes('Invalid email or password')) {
      return sendError(res, error.message, 401);
    }
    if (
      !error.message?.includes('prisma') &&
      !error.message?.includes('DATABASE_URL') &&
      error.message?.includes('required')
    ) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const clientOrigin = req.headers.origin as string;
    const result = await authService.requestPasswordReset(email || '', clientOrigin);
    return sendSuccess(res, result, result.message, 200);
  } catch (error: any) {
    if (error.message?.includes('required') || error.message?.includes('Too many')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token || '', newPassword || '');
    return sendSuccess(res, result, result.message, 200);
  } catch (error: any) {
    if (
      error.message?.includes('required') ||
      error.message?.includes('least 8') ||
      error.message?.includes('expired') ||
      error.message?.includes('already been used') ||
      error.message?.includes('Invalid')
    ) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const user = await authService.getCurrentUser(req.user.id);
    return sendSuccess(res, user, 'User profile fetched successfully');
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}

export async function logout(_req: Request, res: Response) {
  return sendSuccess(res, null, 'Logged out successfully');
}
