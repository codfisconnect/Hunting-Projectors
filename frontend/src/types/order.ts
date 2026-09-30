export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  product?: {
    id: string;
    slug: string;
    name: string;
    images?: Array<{ url: string }>;
  };
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress?: any;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CheckoutCalculation {
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    sku?: string;
    image: string;
    quantity: number;
    unitPrice: number;
    compareAtPrice?: number | null;
    lineSubtotal: number;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface CreateOrderPayload {
  addressId?: string;
  shippingAddress?: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  paymentMethod?: string;
  directItem?: {
    productId: string;
    quantity: number;
  };
}
