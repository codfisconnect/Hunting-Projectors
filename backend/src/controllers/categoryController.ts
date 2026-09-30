import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validateCategoryInput } from '../utils/validation.js';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const categories = await categoryService.getAllCategories(includeInactive);
    return sendSuccess(res, categories, 'Categories fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function getCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const identifier = String(req.params.identifier);
    const category = await categoryService.getCategoryBySlugOrId(identifier);
    if (!category) {
      return sendError(res, `Category '${identifier}' not found`, 404);
    }
    return sendSuccess(res, category, 'Category fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const validation = validateCategoryInput(req.body);
    if (!validation.isValid) {
      return sendError(res, 'Validation failed', 400, validation.errors);
    }

    const existing = await categoryService.getCategoryBySlug(req.body.slug.trim().toLowerCase());
    if (existing) {
      return sendError(res, `Category with slug '${req.body.slug}' already exists`, 409);
    }

    const category = await categoryService.createCategory(req.body);
    return sendSuccess(res, category, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const existing = await categoryService.getCategoryBySlugOrId(id);
    if (!existing) {
      return sendError(res, `Category '${id}' not found`, 404);
    }

    if (req.body.slug && req.body.slug.trim().toLowerCase() !== existing.slug) {
      const slugExists = await categoryService.getCategoryBySlug(req.body.slug.trim().toLowerCase());
      if (slugExists) {
        return sendError(res, `Category with slug '${req.body.slug}' already exists`, 409);
      }
    }

    const updated = await categoryService.updateCategory(existing.id, req.body);
    return sendSuccess(res, updated, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const existing = await categoryService.getCategoryBySlugOrId(id);
    if (!existing) {
      return sendError(res, `Category '${id}' not found`, 404);
    }

    if (existing._count?.products && existing._count.products > 0) {
      return sendError(
        res,
        `Cannot delete category '${existing.name}' because it contains ${existing._count.products} associated product(s). Deactivate it instead.`,
        400
      );
    }

    await categoryService.deleteCategory(existing.id);
    return sendSuccess(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
}
