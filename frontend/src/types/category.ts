export interface Category {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  count?: number;
  isActive?: boolean;
  featuredSpecs: string[];
  _count?: {
    products: number;
  };
}
