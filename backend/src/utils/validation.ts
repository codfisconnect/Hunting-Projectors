export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function validateCategoryInput(input: any): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object.'] };
  }

  if (!input.name || typeof input.name !== 'string' || input.name.trim().length < 2) {
    errors.push('Category name is required and must be at least 2 characters.');
  }

  if (!input.slug || typeof input.slug !== 'string' || !isValidSlug(input.slug.trim())) {
    errors.push('Category slug is required and must contain only lowercase alphanumeric characters and hyphens (e.g., home-cinema).');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateProductInput(input: any, isUpdate = false): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object.'] };
  }

  if (!isUpdate || input.name !== undefined) {
    if (!input.name || typeof input.name !== 'string' || input.name.trim().length < 2) {
      errors.push('Product name is required and must be at least 2 characters.');
    }
  }

  if (!isUpdate || input.slug !== undefined) {
    if (!input.slug || typeof input.slug !== 'string' || !isValidSlug(input.slug.trim())) {
      errors.push('Product slug is required and must contain only lowercase alphanumeric characters and hyphens (e.g., hunting-h500).');
    }
  }

  if (!isUpdate || input.categoryId !== undefined) {
    if (!input.categoryId || typeof input.categoryId !== 'string' || input.categoryId.trim().length === 0) {
      errors.push('A valid categoryId is required.');
    }
  }

  if (!isUpdate || input.price !== undefined) {
    const numPrice = Number(input.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      errors.push('Price is required and must be a positive number greater than 0.');
    }
  }

  if (input.mrp !== undefined && input.mrp !== null) {
    const numMrp = Number(input.mrp);
    const numPrice = Number(input.price);
    if (isNaN(numMrp) || numMrp < 0) {
      errors.push('MRP must be a valid positive number.');
    } else if (!isNaN(numPrice) && numMrp < numPrice) {
      errors.push('MRP (Maximum Retail Price) cannot be less than the selling price.');
    }
  }

  if (input.stock !== undefined && input.stock !== null) {
    const numStock = Number(input.stock);
    if (!Number.isInteger(numStock) || numStock < 0) {
      errors.push('Stock must be a non-negative integer (0 or greater).');
    }
  }

  if (input.sku !== undefined && input.sku !== null) {
    if (typeof input.sku !== 'string' || input.sku.trim().length < 2) {
      errors.push('SKU must be a string of at least 2 characters.');
    }
  }

  // Specifications validation if provided
  if (input.specifications) {
    if (typeof input.specifications !== 'object') {
      errors.push('Specifications must be a valid JSON object.');
    } else if (!isUpdate) {
      if (!input.specifications.resolution || typeof input.specifications.resolution !== 'string') {
        errors.push('Specification resolution is required.');
      }
      if (!input.specifications.brightness || typeof input.specifications.brightness !== 'string') {
        errors.push('Specification brightness (ANSI lumens) is required.');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
