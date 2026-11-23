import { fetchJson } from './api';

export interface RazorpayOrderData {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface VerificationResponse {
  verified: boolean;
  orderNumber: string;
  paymentStatus: string;
  orderStatus: string;
  message?: string;
}

export interface PaymentStatusResponse {
  id: string;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentAttempts: Array<{
    id: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    status: string;
    method?: string;
    createdAt: string;
  }>;
}

export const paymentClient = {
  /**
   * Initializes authoritative Razorpay order on the backend using server-calculated prices.
   */
  async createPaymentOrder(orderId: string): Promise<RazorpayOrderData> {
    const res = await fetchJson<{ success: boolean; data: RazorpayOrderData }>('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
    return res.data;
  },

  /**
   * Verifies payment HMAC signature on the backend.
   */
  async verifyPayment(payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<VerificationResponse> {
    const res = await fetchJson<{ success: boolean; data: VerificationResponse }>('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  /**
   * Fetches payment status and attempt audit history.
   */
  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    const res = await fetchJson<{ success: boolean; data: PaymentStatusResponse }>(`/payment/status/${encodeURIComponent(orderId)}`);
    return res.data;
  },
};
