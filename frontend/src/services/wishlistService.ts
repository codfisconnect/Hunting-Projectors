import { fetchJson } from './api';

export interface BackendWishlistItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  inStock: boolean;
  addedAt: string;
}

export const wishlistApiService = {
  async getWishlist(): Promise<BackendWishlistItem[]> {
    const res = await fetchJson<{ success: boolean; data: BackendWishlistItem[] }>('/wishlist');
    return res.data;
  },

  async addItem(productIdOrSlug: string): Promise<BackendWishlistItem[]> {
    const res = await fetchJson<{ success: boolean; data: BackendWishlistItem[] }>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId: productIdOrSlug }),
    });
    return res.data;
  },

  async removeItem(productIdOrId: string): Promise<BackendWishlistItem[]> {
    const res = await fetchJson<{ success: boolean; data: BackendWishlistItem[] }>(`/wishlist/${encodeURIComponent(productIdOrId)}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  async mergeGuestWishlist(productIds: string[]): Promise<BackendWishlistItem[]> {
    const res = await fetchJson<{ success: boolean; data: BackendWishlistItem[] }>('/wishlist/merge', {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    });
    return res.data;
  },
};
