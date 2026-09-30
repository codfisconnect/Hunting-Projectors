import { fetchJson } from './api';
import { Product, ProductFilterOptions } from '../types/product';
import { Category } from '../types/category';
import { products as localProducts, getProductBySlug as getLocalProductBySlug } from '../data/products';
import { categories as localCategories } from '../data/categories';

export async function fetchProducts(filters?: ProductFilterOptions): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.searchQuery) params.append('q', filters.searchQuery);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const data = await fetchJson<{ success: boolean; data: Product[] }>(`/products${queryStr}`);
    return data.data;
  } catch {
    // Graceful offline/demo fallback using typed products dataset
    let result = [...localProducts];

    if (filters?.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.specifications.resolution.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        default:
          break;
      }
    }

    return result;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await fetchJson<{ success: boolean; data: Product }>(`/products/${slug}`);
    return data.data;
  } catch {
    // Graceful fallback
    return getLocalProductBySlug(slug) || null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await fetchJson<{ success: boolean; data: Category[] }>('/categories');
    return data.data;
  } catch {
    return localCategories;
  }
}
