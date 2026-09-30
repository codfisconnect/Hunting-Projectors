import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService.js';
import { sendSuccess } from '../utils/response.js';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoryService.getAllCategories();
    return sendSuccess(res, categories, 'Categories fetched successfully');
  } catch (error) {
    next(error);
  }
}
