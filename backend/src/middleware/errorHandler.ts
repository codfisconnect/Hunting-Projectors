import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Server-side diagnostic log (never print database connection strings or secrets)
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.name || 'Error', err.message || '');

  // Mask database / Prisma / environment internals from client response
  const isPrismaError =
    err.name?.includes('Prisma') ||
    err.message?.includes('prisma') ||
    err.message?.includes('Prisma') ||
    err.message?.includes('DATABASE_URL') ||
    err.message?.includes('DIRECT_URL') ||
    err.message?.includes('invocation') ||
    err.message?.includes('database');

  if (isPrismaError) {
    statusCode = 500;
    message = 'A database service error occurred. Please try again later.';
  }

  // Never leak filesystem paths or stack traces in responses
  return sendError(res, message, statusCode);
}

export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, `Endpoint ${req.method} ${req.originalUrl} not found on Hunting Projector API`, 404);
}

