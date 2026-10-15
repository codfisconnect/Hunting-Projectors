import { fetchJson, ApiError } from './api';
import { Product, ProductFilterOptions, ProductPagination, ProductSpecification, ProductImage } from '../types/product';
import { Category } from '../types/category';
import { products as fallbackProducts } from '../data/products';
import { categories as fallbackCategories } from '../data/categories';

/**
 * Normalizes backend Prisma/PostgreSQL product representation into typed frontend Product model.
 * Handles Decimal-as-string conversions, nested view-type image mappings, and safe fallbacks.
 */
export function normalizeProduct(raw: any): Product {
  if (!raw) {
    throw new Error('Cannot normalize null or undefined product');
  }

  const price = typeof raw.price === 'string' ? parseFloat(raw.price) : Number(raw.price || 0);
  const compareAtPrice = raw.compareAtPrice 
    ? (typeof raw.compareAtPrice === 'string' ? parseFloat(raw.compareAtPrice) : Number(raw.compareAtPrice)) 
    : undefined;
  const mrp = raw.mrp 
    ? (typeof raw.mrp === 'string' ? parseFloat(raw.mrp) : Number(raw.mrp)) 
    : undefined;
  const rating = typeof raw.rating === 'string' ? parseFloat(raw.rating) : Number(raw.rating || 5.0);

  // Normalize image records
  const rawImages: ProductImage[] = Array.isArray(raw.images) ? raw.images : [];
  const findView = (v: string) => rawImages.find(img => img.viewType?.toLowerCase() === v.toLowerCase())?.url;
  
  const hero = findView('hero') || rawImages[0]?.url || `/assets/products/${raw.slug}-hero.svg`;
  const angled = findView('angled') || `/assets/products/${raw.slug}-angled.svg` || hero;
  const backPorts = findView('back') || findView('backports') || `/assets/products/${raw.slug}-back.svg` || hero;
  const top = findView('top') || `/assets/products/${raw.slug}-top.svg` || hero;
  const ambient = findView('ambient') || `/assets/products/${raw.slug}-ambient.svg` || hero;
  const transparent = findView('transparent') || `/assets/products/${raw.slug}-transparent.svg` || hero;

  const gallery = rawImages.length > 0
    ? rawImages.map(img => img.url)
    : [hero, angled, top, backPorts, ambient].filter(Boolean);

  const categorySlug = raw.category?.slug || (typeof raw.category === 'string' ? raw.category : (raw.categoryId || 'home-cinema'));
  const categoryLabel = raw.category?.name || raw.categoryLabel || 'Home Cinema';

  // Normalize specifications
  const specs = raw.specifications || {};
  const specifications: ProductSpecification = {
    id: specs.id,
    resolution: specs.resolution || 'Not specified',
    supportedResolution: specs.supportedResolution,
    brightness: specs.brightness || 'Not specified',
    lightSource: specs.lightSource || 'Not specified',
    displayTechnology: specs.displayTechnology || 'Not specified',
    contrastRatio: specs.contrastRatio || 'Not specified',
    projectionSize: specs.projectionSize || 'Not specified',
    throwRatio: specs.throwRatio || 'Not specified',
    operatingSystem: specs.operatingSystem,
    audio: specs.audio || 'Integrated Audio',
    connectivity: Array.isArray(specs.connectivity) ? specs.connectivity : [],
    dimensions: specs.dimensions,
    weight: specs.weight,
    powerConsumption: specs.powerConsumption,
    noiseLevel: specs.noiseLevel,
    lampLifeHours: specs.lampLifeHours,
    focusType: specs.focusType,
    keystoneCorrection: specs.keystoneCorrection,
    refreshRate: specs.refreshRate,
    inputLag: specs.inputLag,
    hdr: specs.hdr,
    ram: specs.ram,
    storage: specs.storage,
  };

  // Build highlights
  const highlights = Array.isArray(raw.highlights) && raw.highlights.length > 0 
    ? raw.highlights 
    : [
        ...(specifications.resolution !== 'Not specified' ? [{
          title: 'Resolution',
          description: `${specifications.resolution} optical projection clarity.`,
          metric: specifications.resolution.split(' ')[0] || 'FHD',
          metricLabel: 'Resolution',
        }] : []),
        ...(specifications.brightness !== 'Not specified' ? [{
          title: 'Brightness',
          description: `${specifications.brightness} light output.`,
          metric: specifications.brightness.split(' ')[0] || 'Lumens',
          metricLabel: 'Luminance',
        }] : []),
        ...(specifications.projectionSize !== 'Not specified' ? [{
          title: 'Projection Canvas',
          description: `Supported display span ${specifications.projectionSize}.`,
          metric: specifications.projectionSize.split(' ')[0] || 'Screen',
          metricLabel: 'Canvas Size',
        }] : []),
        {
          title: 'Audio Output',
          description: specifications.audio || 'Direct speaker integration.',
          metric: 'Audio',
          metricLabel: 'Sound System',
        },
      ];

  // Build features
  const features = Array.isArray(raw.features) && raw.features.length > 0 
    ? raw.features 
    : [
        {
          title: 'Intelligent Autofocus & Keystone',
          description: specifications.keystoneCorrection || 'Real-time autofocus with omnidirectional keystone correction.',
        },
        {
          title: 'Smart Connectivity & Wireless Cast',
          description: 'Stream seamlessly with dual-band Wi-Fi, low-latency Bluetooth, and multi-port HDMI.',
        },
      ];

  return {
    id: raw.id,
    sku: raw.sku,
    slug: raw.slug,
    name: raw.name,
    subtitle: raw.subtitle || '',
    tagline: raw.tagline || '',
    categoryId: raw.categoryId,
    category: categorySlug,
    categoryLabel,
    price,
    compareAtPrice,
    mrp,
    stock: raw.stock ?? 0,
    isActive: raw.isActive ?? true,
    isNew: raw.isNew ?? false,
    isFlagship: raw.isFlagship ?? false,
    isBestSeller: raw.isBestSeller ?? false,
    isFeatured: raw.isFeatured ?? false,
    badge: raw.badge,
    availability: raw.availability || 'in-stock',
    warranty: raw.warranty || '2 Years Official Brand Warranty',
    shortDescription: raw.shortDescription || '',
    description: Array.isArray(raw.description) ? raw.description : (raw.description ? [raw.description] : []),
    images: {
      hero,
      transparent,
      ambient,
      top,
      backPorts,
      angled,
    },
    rawImages,
    gallery,
    rotationFrames: raw.rotationFrames || Array.from({ length: 16 }, (_, i) => `/assets/products/360/vision-x1-frame-${i + 1}.svg`),
    highlights,
    specifications,
    features,
    whatsIncluded: Array.isArray(raw.whatsIncluded) ? raw.whatsIncluded : ['Hunting Projector Unit', 'Voice Remote', 'Power Cable', 'Warranty Card'],
    recommendedUse: Array.isArray(raw.recommendedUse) ? raw.recommendedUse : ['Home Cinema', 'OTT Streaming', 'Gaming'],
    idealRoomSize: raw.idealRoomSize || 'medium',
    idealLighting: raw.idealLighting || 'ambient-light',
    rating,
    reviewsCount: raw.reviewsCount || 0,
  };
}

/**
 * Normalizes backend Category representation into frontend Category model.
 */
export function normalizeCategory(raw: any): Category {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    subtitle: raw.subtitle || '',
    description: raw.description || '',
    featuredSpecs: Array.isArray(raw.featuredSpecs) ? raw.featuredSpecs : [],
    count: raw._count?.products ?? raw.count ?? 0,
    isActive: raw.isActive ?? true,
    _count: raw._count,
  };
}

export interface ProductsResponse {
  products: Product[];
  pagination: ProductPagination;
}

/**
 * Fetches products from PostgreSQL backend with multi-facet filters.
 */
export async function getProducts(filters?: ProductFilterOptions): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  if (filters?.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }
  if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
    params.append('q', filters.searchQuery.trim());
  }
  if (filters?.minPrice !== undefined) {
    params.append('minPrice', String(filters.minPrice));
  }
  if (filters?.maxPrice !== undefined) {
    params.append('maxPrice', String(filters.maxPrice));
  }
  if (filters?.resolution && filters.resolution !== 'all') {
    params.append('resolution', filters.resolution);
  }
  if (filters?.brightness && filters.brightness !== 'all') {
    params.append('brightness', filters.brightness);
  }
  if (filters?.displayTechnology && filters.displayTechnology !== 'all') {
    params.append('displayTechnology', filters.displayTechnology);
  }
  if (filters?.inStock) {
    params.append('inStock', 'true');
  }
  if (filters?.featured) {
    params.append('featured', 'true');
  }
  if (filters?.bestseller) {
    params.append('bestseller', 'true');
  }
  if (filters?.flagship) {
    params.append('flagship', 'true');
  }
  if (filters?.new) {
    params.append('new', 'true');
  }
  if (filters?.sortBy) {
    params.append('sortBy', filters.sortBy);
  }
  if (filters?.limit) {
    params.append('limit', String(filters.limit));
  }
  if (filters?.offset) {
    params.append('offset', String(filters.offset));
  }

  try {
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const response = await fetchJson<{
      success: boolean;
      data: any[];
      pagination?: ProductPagination;
    }>(`/products${queryStr}`);

    const rawList = Array.isArray(response.data) ? response.data : [];
    const products = rawList.map(normalizeProduct);
    const pagination: ProductPagination = response.pagination || {
      total: products.length,
      limit: filters?.limit ?? products.length,
      offset: filters?.offset ?? 0,
    };

    return { products, pagination };
  } catch (err) {
    console.warn('API /products unavailable, using fallback verified catalog data:', err);
    let filtered = [...fallbackProducts];

    if (filters?.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q));
    }
    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters?.flagship) {
      filtered = filtered.filter(p => p.isFlagship);
    }
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return {
      products: filtered,
      pagination: {
        total: filtered.length,
        limit: filters?.limit ?? filtered.length,
        offset: 0,
      },
    };
  }
}

/**
 * Fetches a single product by its unique slug from PostgreSQL backend.
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  try {
    const response = await fetchJson<{
      success: boolean;
      data: any;
    }>(`/products/${encodeURIComponent(slug)}`);

    if (response.data) {
      return normalizeProduct(response.data);
    }
  } catch (err) {
    console.warn(`API /products/${slug} unavailable, checking fallback catalog:`, err);
  }

  const found = fallbackProducts.find(p => p.slug === slug);
  if (found) {
    return found;
  }

  throw new ApiError(404, `Product '${slug}' not found`);
}

/**
 * Fetches all categories from PostgreSQL backend with live product counts.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetchJson<{
      success: boolean;
      data: any[];
    }>('/categories');

    const rawList = Array.isArray(response.data) ? response.data : [];
    if (rawList.length > 0) {
      return rawList.map(normalizeCategory);
    }
  } catch (err) {
    console.warn('API /categories unavailable, using fallback categories:', err);
  }

  return fallbackCategories;
}

/**
 * Fetches a single category by slug or ID.
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  const response = await fetchJson<{
    success: boolean;
    data: any;
  }>(`/categories/${encodeURIComponent(slug)}`);

  if (!response.data) {
    throw new ApiError(404, `Category '${slug}' not found`);
  }

  return normalizeCategory(response.data);
}

/**
 * Fetches related products (e.g. for product detail recommendations).
 */
export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  try {
    const { products } = await getProducts({ limit: limit + 1 });
    return products.filter(p => p.slug !== slug).slice(0, limit);
  } catch {
    return [];
  }
}

// Backwards compatibility aliases
export async function fetchProducts(filters?: ProductFilterOptions): Promise<Product[]> {
  const result = await getProducts(filters);
  return result.products;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  return getCategories();
}
