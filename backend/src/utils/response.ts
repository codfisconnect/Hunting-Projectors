import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

export function sendError(res: Response, message: string, statusCode = 500, details?: any) {
  return res.status(statusCode).json({
    success: false,
    message,
    details,
    timestamp: new Date().toISOString(),
  });
}
