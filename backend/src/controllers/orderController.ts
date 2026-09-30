import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function calculateCheckout(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const calculation = await orderService.calculateCheckout(req.user.id, req.body.directItem);
    return sendSuccess(res, calculation, 'Checkout calculation completed');
  } catch (error: any) {
    if (error.message?.includes('empty') || error.message?.includes('inventory') || error.message?.includes('unavailable')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const order = await orderService.createOrder(req.user.id, req.body);
    return sendSuccess(res, order, 'Order created successfully', 201);
  } catch (error: any) {
    if (error.message?.includes('inventory') || error.message?.includes('stock') || error.message?.includes('required') || error.message?.includes('address')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const orders = await orderService.getCustomerOrders(req.user.id);
    return sendSuccess(res, orders, 'Orders fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function getOrder(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const id = String(req.params.id);
    const order = await orderService.getOrderById(req.user.id, id);
    return sendSuccess(res, order, 'Order details fetched successfully');
  } catch (error: any) {
    if (error.message?.includes('not found') || error.message?.includes('denied')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}

export async function cancelOrder(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const id = String(req.params.id);
    const { reason } = req.body;
    const cancelled = await orderService.cancelOrder(req.user.id, id, reason);
    return sendSuccess(res, cancelled, 'Order cancelled successfully');
  } catch (error: any) {
    if (error.message?.includes('cannot be cancelled')) {
      return sendError(res, error.message, 400);
    }
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}

export async function confirmTestPayment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const id = String(req.params.id);
    const order = await orderService.confirmTestPayment(req.user.id, id);
    return sendSuccess(res, order, 'Test payment confirmed successfully');
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}
