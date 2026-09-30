import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as string | undefined;
    const q = req.query.q as string | undefined;
    const products = await productService.getAllProducts({ category, q });
    return sendSuccess(res, products, 'Products fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = String(req.params.slug);
    const product = await productService.getProductBySlug(slug);
    if (!product) {
      return sendError(res, `Product with slug '${slug}' not found`, 404);
    }
    return sendSuccess(res, product, 'Product details fetched successfully');
  } catch (error) {
    next(error);
  }
}
