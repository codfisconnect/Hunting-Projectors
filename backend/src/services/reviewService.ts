import { prisma } from '../config/database.js';
import { ReviewItem } from '../types/review.js';

export class ReviewService {
  async getAllReviews(status?: 'all' | 'approved' | 'pending' | 'rejected') {
    try {
      const dbReviews = await prisma.review.findMany({
        include: { product: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' }
      });

      if (dbReviews.length > 0) {
        return dbReviews;
      }
    } catch (e: any) {
      console.warn('[ReviewService] DB review query fallback:', e.message);
    }

    return [];
  }

  async getProductReviews(productIdOrSlug: string) {
    return this.getPublicProductReviews(productIdOrSlug);
  }

  async getPublicProductReviews(productIdOrSlug: string) {
    try {
      return await prisma.review.findMany({
        where: {
          OR: [
            { productId: productIdOrSlug },
            { product: { slug: productIdOrSlug } }
          ],
          isVerifiedDemo: true // Approved public reviews
        },
        include: { product: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } catch {
      return [];
    }
  }

  async moderateReview(id: string, action: 'approve' | 'reject' | 'hide' | 'restore') {
    const isVerifiedDemo = action === 'approve' || action === 'restore';
    return prisma.review.update({
      where: { id },
      data: { isVerifiedDemo }
    });
  }

  async createReview(data: {
    productId: string;
    authorName: string;
    location?: string;
    rating?: number;
    title: string;
    comment: string;
    environment?: string;
    userId?: string;
  }) {
    return prisma.review.create({
      data: {
        productId: data.productId,
        authorName: data.authorName,
        location: data.location || 'India',
        rating: data.rating || 5,
        title: data.title,
        comment: data.comment,
        environment: data.environment || 'Living Room',
        isVerifiedDemo: false, // Default to pending moderation
        userId: data.userId || null
      }
    });
  }
}

export const reviewService = new ReviewService();
