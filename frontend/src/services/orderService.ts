import { fetchJson } from './api';
import { Order, CheckoutCalculation, CreateOrderPayload } from '../types/order';

export const orderService = {
  async calculateCheckout(directItem?: { productId: string; quantity: number }): Promise<CheckoutCalculation> {
    const res = await fetchJson<{ success: boolean; data: CheckoutCalculation }>('/orders/calculate', {
      method: 'POST',
      body: JSON.stringify({ directItem }),
    });
    return res.data;
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const res = await fetchJson<{ success: boolean; data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetchJson<{ success: boolean; data: Order[] }>('/orders');
    return res.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetchJson<{ success: boolean; data: Order }>(`/orders/${encodeURIComponent(id)}`);
    return res.data;
  },

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const res = await fetchJson<{ success: boolean; data: Order }>(`/orders/${encodeURIComponent(id)}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return res.data;
  },

  async confirmTestPayment(id: string): Promise<Order> {
    const res = await fetchJson<{ success: boolean; data: Order }>(`/orders/${encodeURIComponent(id)}/confirm-payment`, {
      method: 'POST',
    });
    return res.data;
  },
};
