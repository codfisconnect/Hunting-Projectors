import { Request, Response, NextFunction } from 'express';
import { customerService } from '../services/customerService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const profile = await customerService.getProfile(req.user.id);
    return sendSuccess(res, profile, 'Customer profile fetched successfully');
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const updated = await customerService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, updated, 'Customer profile updated successfully');
  } catch (error: any) {
    if (error.message?.includes('already in use')) {
      return sendError(res, error.message, 409);
    }
    if (error.message?.includes('valid email')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}
