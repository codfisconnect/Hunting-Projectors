import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';

export interface ProductFilterParams {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  resolution?: string;
  brightness?: string;
  displayTechnology?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isFlagship?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  includeInactive?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'featured';
  limit?: number;
  offset?: number;
}

export interface SpecificationInput {
  resolution: string;
  supportedResolution?: string;
  brightness: string;
  lightSource?: string;
  displayTechnology?: string;
  contrastRatio?: string;
  projectionSize?: string;
  throwRatio?: string;
  operatingSystem?: string;
  audio?: string;
  connectivity?: string[];
  dimensions?: string;
  weight?: string;
  powerConsumption?: string;
  noiseLevel?: string;
  lampLifeHours?: string;
  focusType?: string;
  keystoneCorrection?: string;
  refreshRate?: string;
  inputLag?: string;
  hdr?: string;
  ram?: string;
  storage?: string;
}

export interface ImageInput {
  url: string;
  altText?: string;
  viewType?: string;
  sortOrder?: number;
}

export interface CreateProductDTO {
  name: string;
  slug: string;
  sku?: string;
  subtitle?: string;
  tagline?: string;
  categoryId: string;
  price: number;
  mrp?: number;
  compareAtPrice?: number;
  stock?: number;
  isActive?: boolean;
  isNew?: boolean;
  isFlagship?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  badge?: string;
  availability?: string;
  warranty?: string;
  shortDescription?: string;
  description?: string[];
  whatsIncluded?: string[];
  recommendedUse?: string[];
  idealRoomSize?: string;
  idealLighting?: string;
  specifications?: SpecificationInput;
  images?: ImageInput[];
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export class ProductService {
  async getAllProducts(filters: ProductFilterParams = {}) {
    const where: Prisma.ProductWhereInput = {};

    // Active status filter
    if (!filters.includeInactive) {
      where.isActive = true;
    }

    // Category filter (supports either slug or UUID)
    if (filters.category && filters.category !== 'all') {
      where.OR = [
        { categoryId: filters.category },
        { category: { slug: filters.category } },
      ];
    }

    // Keyword search across name, subtitle, SKU, tagline
    if (filters.q && filters.q.trim().length > 0) {
      const q = filters.q.trim();
      where.AND = [
        {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { subtitle: { contains: q, mode: 'insensitive' } },
            { sku: { contains: q, mode: 'insensitive' } },
            { tagline: { contains: q, mode: 'insensitive' } },
            { shortDescription: { contains: q, mode: 'insensitive' } },
            {
              specifications: {
                resolution: { contains: q, mode: 'insensitive' },
              },
            },
          ],
        },
      ];
    }

    // Price range filters
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(filters.maxPrice);
      }
    }

    // Specification filters
    if (filters.resolution || filters.brightness || filters.displayTechnology) {
      where.specifications = {};
      if (filters.resolution && filters.resolution !== 'all') {
        where.specifications.resolution = { contains: filters.resolution, mode: 'insensitive' };
      }
      if (filters.brightness && filters.brightness !== 'all') {
        where.specifications.brightness = { contains: filters.brightness, mode: 'insensitive' };
      }
      if (filters.displayTechnology && filters.displayTechnology !== 'all') {
        where.specifications.displayTechnology = { contains: filters.displayTechnology, mode: 'insensitive' };
      }
    }

    // Boolean flags
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.isBestSeller !== undefined) where.isBestSeller = filters.isBestSeller;
    if (filters.isFlagship !== undefined) where.isFlagship = filters.isFlagship;
    if (filters.isNew !== undefined) where.isNew = filters.isNew;
    if (filters.inStock) where.stock = { gt: 0 };

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (filters.sortBy) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'featured':
        orderBy = { isFlagship: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          specifications: true,
        },
        orderBy,
        take: filters.limit,
        skip: filters.offset,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      totalCount,
      limit: filters.limit,
      offset: filters.offset,
    };
  }

  async getProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        specifications: true,
        reviews: {
          where: { isVerifiedDemo: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        specifications: true,
      },
    });
  }

  async getProductBySku(sku: string) {
    return prisma.product.findUnique({
      where: { sku },
    });
  }

  async createProduct(data: CreateProductDTO) {
    const { specifications, images, price, mrp, compareAtPrice, ...rest } = data;

    return prisma.product.create({
      data: {
        ...rest,
        price: new Prisma.Decimal(price),
        mrp: mrp ? new Prisma.Decimal(mrp) : undefined,
        compareAtPrice: compareAtPrice ? new Prisma.Decimal(compareAtPrice) : (mrp ? new Prisma.Decimal(mrp) : undefined),
        stock: rest.stock ?? 0,
        availability: rest.availability || (rest.stock && rest.stock > 0 ? 'in-stock' : 'in-stock'),
        shortDescription: rest.shortDescription || '',
        description: rest.description || [],
        whatsIncluded: rest.whatsIncluded || [],
        recommendedUse: rest.recommendedUse || [],
        subtitle: rest.subtitle || '',
        tagline: rest.tagline || '',
        // Create nested specifications if provided
        ...(specifications && {
          specifications: {
            create: {
              resolution: specifications.resolution,
              supportedResolution: specifications.supportedResolution,
              brightness: specifications.brightness,
              lightSource: specifications.lightSource || 'Solid-State LED/Laser',
              displayTechnology: specifications.displayTechnology || 'DLP Optical Engine',
              contrastRatio: specifications.contrastRatio || '1,000,000:1 Dynamic',
              projectionSize: specifications.projectionSize || '60" – 200" Diagonal',
              throwRatio: specifications.throwRatio || '1.2:1',
              operatingSystem: specifications.operatingSystem || 'Hunting Smart OS',
              audio: specifications.audio || 'Stereo Neodymium Speakers',
              connectivity: specifications.connectivity || ['HDMI', 'USB', 'Wi-Fi', 'Bluetooth'],
              dimensions: specifications.dimensions || '220 × 200 × 140 mm',
              weight: specifications.weight || '3.5 kg',
              powerConsumption: specifications.powerConsumption || '120W',
              noiseLevel: specifications.noiseLevel || '< 25 dB',
              lampLifeHours: specifications.lampLifeHours || '30,000+ Hours',
              focusType: specifications.focusType || 'Auto Focus',
              keystoneCorrection: specifications.keystoneCorrection || 'Auto Keystone',
              refreshRate: specifications.refreshRate,
              inputLag: specifications.inputLag,
              hdr: specifications.hdr,
              ram: specifications.ram,
              storage: specifications.storage,
            },
          },
        }),
        // Create nested images if provided
        ...(images && images.length > 0 && {
          images: {
            createMany: {
              data: images.map((img, idx) => ({
                url: img.url,
                altText: img.altText || data.name,
                viewType: img.viewType || 'hero',
                sortOrder: img.sortOrder ?? idx,
              })),
            },
          },
        }),
      },
      include: {
        category: true,
        images: true,
        specifications: true,
      },
    });
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    const { specifications, images, price, mrp, compareAtPrice, ...rest } = data;

    return prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(price !== undefined && { price: new Prisma.Decimal(price) }),
        ...(mrp !== undefined && { mrp: new Prisma.Decimal(mrp) }),
        ...(compareAtPrice !== undefined && { compareAtPrice: new Prisma.Decimal(compareAtPrice) }),
        // Update or Upsert specifications if provided
        ...(specifications && {
          specifications: {
            upsert: {
              create: {
                resolution: specifications.resolution || '1080p FHD',
                brightness: specifications.brightness || '1,000 ANSI',
                lightSource: specifications.lightSource || 'Solid-State LED',
                displayTechnology: specifications.displayTechnology || 'DLP',
                contrastRatio: specifications.contrastRatio || '1,000,000:1',
                projectionSize: specifications.projectionSize || '60" – 150"',
                throwRatio: specifications.throwRatio || '1.2:1',
                operatingSystem: specifications.operatingSystem || 'Hunting OS',
                audio: specifications.audio || 'Stereo Speakers',
                connectivity: specifications.connectivity || ['HDMI', 'USB'],
                dimensions: specifications.dimensions || '200 × 200 × 120 mm',
                weight: specifications.weight || '3 kg',
                powerConsumption: specifications.powerConsumption || '100W',
                noiseLevel: specifications.noiseLevel || '< 28 dB',
                focusType: specifications.focusType || 'Auto Focus',
                keystoneCorrection: specifications.keystoneCorrection || 'Auto Keystone',
                supportedResolution: specifications.supportedResolution,
                refreshRate: specifications.refreshRate,
                inputLag: specifications.inputLag,
                hdr: specifications.hdr,
                ram: specifications.ram,
                storage: specifications.storage,
                lampLifeHours: specifications.lampLifeHours,
              },
              update: {
                ...specifications,
              },
            },
          },
        }),
      },
      include: {
        category: true,
        images: true,
        specifications: true,
      },
    });
  }

  async deleteProduct(id: string, softDelete = true) {
    if (softDelete) {
      return prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
    }
    return prisma.product.delete({
      where: { id },
    });
  }
}

export const productService = new ProductService();
