import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Mask database / Prisma internal errors from the response
  if (err.name?.includes('Prisma') || err.message?.includes('prisma') || err.message?.includes('DATABASE_URL')) {
    statusCode = 500;
    message = 'A database service error occurred. Please try again later.';
  }

  return sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
}

export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, `Endpoint ${req.method} ${req.originalUrl} not found on Hunting Projectors API`, 404);
}

