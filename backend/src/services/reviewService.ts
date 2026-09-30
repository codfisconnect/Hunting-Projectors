import { ReviewItem } from '../types/review.js';

const mockReviews: ReviewItem[] = [
  {
    id: 'test-1',
    name: 'Karthik Ramanathan',
    location: 'Chennai, Tamil Nadu',
    verifiedBuyer: true,
    projectorModel: 'Hunting Vision X1 4K',
    rating: 5,
    reviewTitle: 'Astonishing 4K optical sharpness — replaced our 75" TV',
    comment: 'Visited the Chennai showroom to witness the demo before purchasing. The optical focus and deep black levels on a 120-inch ALR screen are unbelievable. The direct support from NAP Computers gave complete peace of mind.',
    date: 'Verified Purchaser',
    environment: 'Living Room',
  },
  {
    id: 'test-2',
    name: 'Arjun Mehta',
    location: 'Bengaluru, Karnataka',
    verifiedBuyer: true,
    projectorModel: 'Hunting Cinema X4 Laser',
    rating: 5,
    reviewTitle: 'ALPD laser brightness cuts straight through daylight',
    comment: 'The 3,500 ANSI output genuinely holds up even during afternoon football matches with partial curtains. The fan noise is virtually inaudible. A true reference-grade cinema investment.',
    date: 'Verified Purchaser',
    environment: 'Dedicated Theater',
  },
  {
    id: 'test-3',
    name: 'Siddharth V.',
    location: 'Hyderabad, Telangana',
    verifiedBuyer: true,
    projectorModel: 'Hunting Ultra Pro UST',
    rating: 5,
    reviewTitle: 'Incredible 150 inches from inches off the wall',
    comment: 'No messy ceiling mounts or trailing cables across our living room. It sits directly on our low TV credenza and turns our entire feature wall into an IMAX experience. The built-in Dolby soundbar is surprisingly punchy.',
    date: 'Verified Purchaser',
    environment: 'Living Room',
  },
];

export class ReviewService {
  async getAllReviews(): Promise<ReviewItem[]> {
    return mockReviews;
  }

  async getProductReviews(productId: string): Promise<ReviewItem[]> {
    return mockReviews.filter(r => r.projectorModel.toLowerCase().includes(productId.toLowerCase()));
  }

  async createReview(data: Partial<ReviewItem>): Promise<ReviewItem> {
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: data.name || 'Anonymous Guest',
      location: data.location || 'India',
      verifiedBuyer: false,
      projectorModel: data.projectorModel || 'Hunting Projector',
      rating: data.rating || 5,
      reviewTitle: data.reviewTitle || 'Customer Experience',
      comment: data.comment || '',
      date: 'Recent Demo Review',
      environment: data.environment || 'Home Cinema',
    };
    mockReviews.unshift(newReview);
    return newReview;
  }
}

export const reviewService = new ReviewService();
