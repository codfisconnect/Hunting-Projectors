import { fetchJson } from './api';

export interface BackendCartCalculation {
  id: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    slug: string;
    sku: string | null;
    image: string | null;
    unitPrice: number;
    compareAtPrice: number | null;
    discountPerUnit: number;
    quantity: number;
    itemSubtotal: number;
    itemTotal: number;
    inStock: boolean;
    availableStock: number;
  }>;
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export const cartApiService = {
  async getCart(): Promise<BackendCartCalculation> {
    const res = await fetchJson<{ success: boolean; data: BackendCartCalculation }>('/cart');
    return res.data;
  },

  async addItem(productIdOrSlug: string, quantity = 1): Promise<BackendCartCalculation> {
    const res = await fetchJson<{ success: boolean; data: BackendCartCalculation }>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId: productIdOrSlug, quantity }),
    });
    return res.data;
  },

  async updateQuantity(itemIdOrProductId: string, quantity: number): Promise<BackendCartCalculation> {
    const res = await fetchJson<{ success: boolean; data: BackendCartCalculation }>(`/cart/items/${encodeURIComponent(itemIdOrProductId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
    return res.data;
  },

  async removeItem(itemIdOrProductId: string): Promise<BackendCartCalculation> {
    const res = await fetchJson<{ success: boolean; data: BackendCartCalculation }>(`/cart/items/${encodeURIComponent(itemIdOrProductId)}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  async clearCart(): Promise<BackendCartCalculation> {
    const res = await fetchJson<{ success: boolean; data: BackendCartCalculation }>('/cart', {
      method: 'DELETE',
    });
    return res.data;
  },

  async mergeGuestCart(items: Array<{ productId: string; quantity: number }>): Promise<BackendCartCalculation> {
    const res = await fetchJson<{ success: boolean; data: BackendCartCalculation }>('/cart/merge', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    return res.data;
  },
};
