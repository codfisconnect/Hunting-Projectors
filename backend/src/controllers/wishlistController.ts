import { Request, Response, NextFunction } from 'express';
import { wishlistService } from '../services/wishlistService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const wishlist = await wishlistService.getWishlist(req.user.id);
    return sendSuccess(res, wishlist, 'Wishlist fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function addToWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const { productId, productSlug } = req.body;
    const identifier = productId || productSlug;

    if (!identifier) {
      return sendError(res, 'Product ID or slug is required.', 400);
    }

    const wishlist = await wishlistService.addItem(req.user.id, identifier);
    return sendSuccess(res, wishlist, 'Added to wishlist', 201);
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}

export async function removeFromWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const id = String(req.params.id);
    const wishlist = await wishlistService.removeItem(req.user.id, id);
    return sendSuccess(res, wishlist, 'Removed from wishlist');
  } catch (error) {
    next(error);
  }
}

export async function mergeWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const { productIds } = req.body;
    const wishlist = await wishlistService.mergeGuestWishlist(req.user.id, productIds || []);
    return sendSuccess(res, wishlist, 'Guest wishlist merged successfully');
  } catch (error) {
    next(error);
  }
}
