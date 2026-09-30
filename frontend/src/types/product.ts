export interface ProductSpecification {
  id?: string;
  resolution: string;
  supportedResolution?: string;
  brightness: string;
  lightSource: string;
  displayTechnology: string;
  contrastRatio: string;
  projectionSize: string;
  throwRatio: string;
  operatingSystem: string;
  audio: string;
  connectivity: string[];
  dimensions: string;
  weight: string;
  powerConsumption: string;
  noiseLevel: string;
  lampLifeHours?: string;
  focusType: string;
  keystoneCorrection: string;
  refreshRate?: string;
  inputLag?: string;
  hdr?: string;
  ram?: string;
  storage?: string;
}

export interface ProductImage {
  id?: string;
  productId?: string;
  url: string;
  altText?: string;
  viewType?: string;
  sortOrder?: number;
}

export interface ProductHighlight {
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  iconName?: string;
}

export interface Product {
  id: string;
  sku?: string;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  categoryId?: string;
  category: 'home-cinema' | 'laser-4k' | 'ultra-short-throw' | 'smart-portable' | 'commercial-gaming' | 'gaming' | 'portable' | 'smart-projectors' | 'business' | string;
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  mrp?: number;
  stock?: number;
  isActive?: boolean;
  isNew?: boolean;
  isFlagship?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  badge?: string;
  availability: 'in-stock' | 'pre-order' | 'demo-available' | string;
  warranty?: string;
  shortDescription: string;
  description: string[];
  images: {
    hero: string;
    transparent: string;
    ambient: string;
    top?: string;
    backPorts?: string;
    angled?: string;
  };
  rawImages?: ProductImage[];
  gallery: string[];
  rotationFrames?: string[];
  model3d?: string;
  highlights: ProductHighlight[];
  specifications: ProductSpecification;
  features: {
    title: string;
    description: string;
  }[];
  whatsIncluded: string[];
  recommendedUse: string[];
  idealRoomSize: 'small' | 'medium' | 'large' | 'all' | string;
  idealLighting: 'dark-only' | 'ambient-light' | 'bright-room' | 'all-lighting' | string;
  rating: number;
  reviewsCount: number;
}

export interface ProductPagination {
  total: number;
  limit: number;
  offset: number;
}

export interface ProductFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  resolution?: string;
  brightness?: string;
  displayTechnology?: string;
  useCase?: string;
  searchQuery?: string;
  inStock?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  flagship?: boolean;
  new?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  limit?: number;
  offset?: number;
}
