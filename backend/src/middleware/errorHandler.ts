import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  return sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
}

export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, `Endpoint ${req.method} ${req.originalUrl} not found on Hunting Projectors API`, 404);
}

