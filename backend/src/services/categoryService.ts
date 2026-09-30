export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  count: number;
  featuredSpecs: string[];
}

const mockCategories: CategoryItem[] = [
  {
    id: 'laser-4k',
    slug: 'laser-4k',
    name: '4K Laser Cinema',
    subtitle: 'Flagship Optical Engineering',
    description: 'Ultra-high-definition cinematic laser projectors engineered for dedicated theater rooms, unmatched contrast, and true-to-life DCI-P3 color reproduction.',
    count: 3,
    featuredSpecs: ['True 4K UHD', 'ALPD 4.0 Laser', '3,500 ANSI Lumens'],
  },
  {
    id: 'ultra-short-throw',
    slug: 'ultra-short-throw',
    name: 'Ultra Short Throw (UST)',
    subtitle: '150" Display From Inches Away',
    description: 'Triple-laser ultra-short-throw systems that sit right beneath your screen or wall, completely replacing conventional televisions with zero ceiling wiring.',
    count: 2,
    featuredSpecs: ['0.21:1 Throw Ratio', 'ALR Screen Ready', 'Integrated Dolby Atmos'],
  },
  {
    id: 'home-cinema',
    slug: 'home-cinema',
    name: 'Home Cinema Master',
    subtitle: 'Immersive Living Room Entertainment',
    description: 'High-brightness intelligent home cinema projectors engineered for everyday living room enjoyment, ambient light rejection, and low-latency sports streaming.',
    count: 4,
    featuredSpecs: ['Native 1080p / 4K Support', 'HDR10+ Dynamic', 'Intelligent Auto-Keystone'],
  },
  {
    id: 'smart-portable',
    slug: 'smart-portable',
    name: 'Smart Portable & Outdoor',
    subtitle: 'Cinema Everywhere You Travel',
    description: 'Compact, grab-and-go projectors with built-in high-fidelity audio, Android TV / Smart OS, dual-band Wi-Fi, and instant laser autofocus for outdoor nights.',
    count: 3,
    featuredSpecs: ['Ultra-Compact Chassis', 'Omnidirectional Sound', 'Instant Optical Autofocus'],
  },
  {
    id: 'commercial-gaming',
    slug: 'commercial-gaming',
    name: 'High-Refresh Gaming & Commercial',
    subtitle: '240Hz Speed & High-Lumen Precision',
    description: 'Low-input-lag high-refresh-rate projection systems engineered for competitive console gaming, corporate auditoriums, and high-ambient venues.',
    count: 2,
    featuredSpecs: ['240Hz High Refresh', '4.2ms Low Latency', 'High-Lumen Daylight Engine'],
  },
];

export class CategoryService {
  async getAllCategories(): Promise<CategoryItem[]> {
    return mockCategories;
  }
}

export const categoryService = new CategoryService();
