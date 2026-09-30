import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cartService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const cart = await cartService.getCart(req.user.id);
    return sendSuccess(res, cart, 'Cart fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function addItem(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const { productId, productSlug, quantity = 1 } = req.body;
    const identifier = productId || productSlug;

    if (!identifier) {
      return sendError(res, 'Product ID or slug is required.', 400);
    }

    const cart = await cartService.addItem(req.user.id, identifier, Number(quantity));
    return sendSuccess(res, cart, 'Item added to cart', 201);
  } catch (error: any) {
    if (error.message?.includes('out of stock') || error.message?.includes('available') || error.message?.includes('unavailable')) {
      return sendError(res, error.message, 400);
    }
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}

export async function updateQuantity(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const id = String(req.params.id);
    const { quantity } = req.body;

    if (quantity === undefined) {
      return sendError(res, 'Quantity is required.', 400);
    }

    const cart = await cartService.updateItemQuantity(req.user.id, id, Number(quantity));
    return sendSuccess(res, cart, 'Cart updated successfully');
  } catch (error: any) {
    if (error.message?.includes('available') || error.message?.includes('stock')) {
      return sendError(res, error.message, 400);
    }
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}

export async function removeItem(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const id = String(req.params.id);
    const cart = await cartService.removeItem(req.user.id, id);
    return sendSuccess(res, cart, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const cart = await cartService.clearCart(req.user.id);
    return sendSuccess(res, cart, 'Cart cleared successfully');
  } catch (error) {
    next(error);
  }
}

export async function mergeGuestCart(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const { items } = req.body;
    const cart = await cartService.mergeGuestCart(req.user.id, items || []);
    return sendSuccess(res, cart, 'Guest cart merged successfully');
  } catch (error) {
    next(error);
  }
}
