import { Request, Response, NextFunction } from 'express';
import { productService, ProductFilterParams } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validateProductInput } from '../utils/validation.js';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const filters: ProductFilterParams = {
      category: req.query.category as string | undefined,
      q: req.query.q as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      resolution: req.query.resolution as string | undefined,
      brightness: req.query.brightness as string | undefined,
      displayTechnology: req.query.displayTechnology as string | undefined,
      isFeatured: req.query.featured === 'true' ? true : undefined,
      isBestSeller: req.query.bestseller === 'true' ? true : undefined,
      isFlagship: req.query.flagship === 'true' ? true : undefined,
      isNew: req.query.new === 'true' ? true : undefined,
      inStock: req.query.inStock === 'true' ? true : undefined,
      includeInactive: req.query.includeInactive === 'true',
      sortBy: req.query.sortBy as any,
      limit: req.query.limit ? Math.min(100, Math.max(1, Number(req.query.limit))) : undefined,
      offset: req.query.offset ? Math.max(0, Number(req.query.offset)) : undefined,
    };

    const result = await productService.getAllProducts(filters);
    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: result.products,
      pagination: {
        total: result.totalCount,
        limit: filters.limit ?? result.totalCount,
        offset: filters.offset ?? 0,
      },
      timestamp: new Date().toISOString(),
    });
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

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const product = await productService.getProductById(id);
    if (!product) {
      return sendError(res, `Product with ID '${id}' not found`, 404);
    }
    return sendSuccess(res, product, 'Product details fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const validation = validateProductInput(req.body);
    if (!validation.isValid) {
      return sendError(res, 'Validation failed', 400, validation.errors);
    }

    const { slug, sku, categoryId } = req.body;

    // Check slug uniqueness
    const existingSlug = await productService.getProductBySlug(slug.trim().toLowerCase());
    if (existingSlug) {
      return sendError(res, `Product with slug '${slug}' already exists`, 409);
    }

    // Check SKU uniqueness if provided
    if (sku && sku.trim().length > 0) {
      const existingSku = await productService.getProductBySku(sku.trim());
      if (existingSku) {
        return sendError(res, `Product with SKU '${sku}' already exists`, 409);
      }
    }

    // Validate category exists
    const category = await categoryService.getCategoryBySlugOrId(categoryId);
    if (!category) {
      return sendError(res, `Category with ID or slug '${categoryId}' not found`, 400);
    }

    const created = await productService.createProduct({
      ...req.body,
      categoryId: category.id,
      slug: slug.trim().toLowerCase(),
    });

    return sendSuccess(res, created, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const existing = await productService.getProductById(id);
    if (!existing) {
      return sendError(res, `Product with ID '${id}' not found`, 404);
    }

    const validation = validateProductInput(req.body, true);
    if (!validation.isValid) {
      return sendError(res, 'Validation failed', 400, validation.errors);
    }

    // Check slug collision if slug is being updated
    if (req.body.slug && req.body.slug.trim().toLowerCase() !== existing.slug) {
      const slugMatch = await productService.getProductBySlug(req.body.slug.trim().toLowerCase());
      if (slugMatch) {
        return sendError(res, `Product with slug '${req.body.slug}' already exists`, 409);
      }
    }

    // Check SKU collision if SKU is being updated
    if (req.body.sku && req.body.sku.trim() !== existing.sku) {
      const skuMatch = await productService.getProductBySku(req.body.sku.trim());
      if (skuMatch) {
        return sendError(res, `Product with SKU '${req.body.sku}' already exists`, 409);
      }
    }

    // Check category exists if updating categoryId
    if (req.body.categoryId && req.body.categoryId !== existing.categoryId) {
      const category = await categoryService.getCategoryBySlugOrId(req.body.categoryId);
      if (!category) {
        return sendError(res, `Category '${req.body.categoryId}' not found`, 400);
      }
      req.body.categoryId = category.id;
    }

    const updated = await productService.updateProduct(id, req.body);
    return sendSuccess(res, updated, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const existing = await productService.getProductById(id);
    if (!existing) {
      return sendError(res, `Product with ID '${id}' not found`, 404);
    }

    const hardDelete = req.query.hard === 'true';
    await productService.deleteProduct(id, !hardDelete);

    const message = hardDelete
      ? 'Product permanently deleted successfully'
      : 'Product deactivated (soft deleted) successfully';

    return sendSuccess(res, null, message);
  } catch (error) {
    next(error);
  }
}
