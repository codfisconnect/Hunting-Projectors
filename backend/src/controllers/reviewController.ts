import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/reviewService.js';
import { sendSuccess } from '../utils/response.js';

export async function getReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await reviewService.getAllReviews();
    return sendSuccess(res, reviews, 'Customer demo reviews fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function getProductReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = String(req.params.productId);
    const reviews = await reviewService.getProductReviews(productId);
    return sendSuccess(res, reviews, 'Product reviews fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const review = await reviewService.createReview(req.body);
    return sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (error) {
    next(error);
  }
}

