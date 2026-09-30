export interface ProductSpecification {
  resolution: string;
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
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  category: 'home-cinema' | 'laser-4k' | 'ultra-short-throw' | 'smart-portable' | 'commercial-gaming';
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  isNew?: boolean;
  isFlagship?: boolean;
  isBestSeller?: boolean;
  badge?: string;
  availability: 'in-stock' | 'pre-order' | 'demo-available';
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
  idealRoomSize: 'small' | 'medium' | 'large' | 'all';
  idealLighting: 'dark-only' | 'ambient-light' | 'bright-room';
  rating: number;
  reviewsCount: number;
}

export type ProductFilterOptions = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  resolution?: string;
  brightness?: string;
  useCase?: string;
  searchQuery?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
};
