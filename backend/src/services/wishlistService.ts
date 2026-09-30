import { prisma } from '../config/database.js';

export class WishlistService {
  private async getOrCreateWishlist(userId: string) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId }
      });
    }

    return wishlist;
  }

  async getWishlist(userId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    const items = await prisma.wishlistItem.findMany({
      where: { wishlistId: wishlist.id },
      include: {
        product: {
          include: {
            category: true,
            images: {
              where: { viewType: 'hero' },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return items.map(item => {
      const p = item.product;
      const unitPrice = parseFloat(p.price.toString());
      const compareAt = p.compareAtPrice ? parseFloat(p.compareAtPrice.toString()) : null;
      const heroImg = p.images.length > 0 ? p.images[0].url : '/assets/products/hunting-h900-hero.svg';

      return {
        id: item.id,
        productId: p.id,
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle,
        category: p.category.name,
        price: unitPrice,
        compareAtPrice: compareAt,
        image: heroImg,
        inStock: p.isActive && p.stock > 0,
        addedAt: item.createdAt
      };
    });
  }

  async addItem(userId: string, productIdOrSlug: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: productIdOrSlug },
          { slug: productIdOrSlug }
        ]
      }
    });

    if (!product) {
      throw new Error('Projector not found.');
    }

    const wishlist = await this.getOrCreateWishlist(userId);

    // Prevent duplicate wishlist entries
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: product.id
        }
      }
    });

    if (!existing) {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId: product.id
        }
      });
    }

    return this.getWishlist(userId);
  }

  async removeItem(userId: string, productIdOrSlug: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: productIdOrSlug },
          { slug: productIdOrSlug }
        ]
      }
    });

    const targetProductId = product ? product.id : productIdOrSlug;

    await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        OR: [
          { id: productIdOrSlug },
          { productId: targetProductId }
        ]
      }
    });

    return this.getWishlist(userId);
  }

  async mergeGuestWishlist(userId: string, productIdentifiers: string[]) {
    if (!Array.isArray(productIdentifiers) || productIdentifiers.length === 0) {
      return this.getWishlist(userId);
    }

    for (const id of productIdentifiers) {
      try {
        await this.addItem(userId, id);
      } catch {
        // Continue merging remaining items
      }
    }

    return this.getWishlist(userId);
  }
}

export const wishlistService = new WishlistService();
