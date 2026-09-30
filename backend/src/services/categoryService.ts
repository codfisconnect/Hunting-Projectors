import { prisma } from '../config/database.js';

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  featuredSpecs?: string[];
  isActive?: boolean;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  featuredSpecs?: string[];
  isActive?: boolean;
}

export class CategoryService {
  async getAllCategories(includeInactive = false) {
    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return categories.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      subtitle: cat.subtitle,
      description: cat.description,
      featuredSpecs: cat.featuredSpecs,
      isActive: cat.isActive,
      productsCount: cat._count.products,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));
  }

  async getCategoryBySlugOrId(identifier: string) {
    return prisma.category.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier },
        ],
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async createCategory(data: CreateCategoryDTO) {
    return prisma.category.create({
      data: {
        name: data.name.trim(),
        slug: data.slug.trim().toLowerCase(),
        subtitle: data.subtitle?.trim() || '',
        description: data.description?.trim() || '',
        featuredSpecs: data.featuredSpecs || [],
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateCategory(id: string, data: UpdateCategoryDTO) {
    return prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.slug && { slug: data.slug.trim().toLowerCase() }),
        ...(data.subtitle !== undefined && { subtitle: data.subtitle.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.featuredSpecs !== undefined && { featuredSpecs: data.featuredSpecs }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryService = new CategoryService();
