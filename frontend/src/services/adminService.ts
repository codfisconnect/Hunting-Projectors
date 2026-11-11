import { fetchJson } from './api';
import { normalizeProduct } from './productService';
import { Product } from '../types/product';

export interface AdminStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  pendingEnquiries: number;
  failedPayments: number;
  unreadNotifications: number;
}

export interface AdminOverviewResponse {
  stats: AdminStats;
  recent: {
    orders: any[];
    customers: any[];
    enquiries: any[];
  };
}

export interface AdminOrderFilters {
  status?: string;
  paymentStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminCustomerFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminProductFilters {
  search?: string;
  category?: string;
  status?: 'all' | 'active' | 'inactive';
  limit?: number;
  offset?: number;
}

class AdminService {
  async getOverview(dateRange?: { from?: string; to?: string }): Promise<AdminOverviewResponse> {
    const params = new URLSearchParams();
    if (dateRange?.from) params.append('from', dateRange.from);
    if (dateRange?.to) params.append('to', dateRange.to);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetchJson<{ success: boolean; data: AdminOverviewResponse }>(`/admin/overview${query}`);
    return res.data;
  }

  async getOrders(filters?: AdminOrderFilters): Promise<{ orders: any[]; pagination: { total: number; page: number; limit: number } }> {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.paymentStatus && filters.paymentStatus !== 'all') params.append('paymentStatus', filters.paymentStatus);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetchJson<{ success: boolean; data: { orders: any[]; pagination: any } }>(`/admin/orders${query}`);
    return res.data;
  }

  async updateOrderStatus(orderId: string, payload: { status: string; notes?: string; trackingCarrier?: string; trackingNumber?: string }) {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    return res.data;
  }

  async getCustomers(filters?: AdminCustomerFilters): Promise<{ customers: any[]; pagination: { total: number; page: number; limit: number } }> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetchJson<{ success: boolean; data: { customers: any[]; pagination: any } }>(`/admin/customers${query}`);
    return res.data;
  }

  async getCustomerProfile(id: string): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/customers/${id}`);
    return res.data;
  }

  async getInventory(search?: string, lowStockOnly = false): Promise<any[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (lowStockOnly) params.append('lowStock', 'true');

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetchJson<{ success: boolean; data: any[] }>(`/admin/inventory${query}`);
    return res.data;
  }

  async adjustStock(productId: string, adjustment: number, reason: string): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>('/admin/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({ productId, adjustment, reason })
    });
    return res.data;
  }

  async getEnquiries(status?: string, search?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetchJson<{ success: boolean; data: any[] }>(`/admin/enquiries${query}`);
    return res.data;
  }

  async updateEnquiryStatus(id: string, status: string): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return res.data;
  }

  async getNotifications(limit = 50, onlyUnread = false): Promise<{ items: any[]; unreadCount: number }> {
    const params = new URLSearchParams();
    params.append('limit', String(limit));
    if (onlyUnread) params.append('onlyUnread', 'true');

    const res = await fetchJson<{ success: boolean; data: { items: any[]; unreadCount: number } }>(`/admin/notifications?${params.toString()}`);
    return res.data;
  }

  async markNotificationAsRead(id: string): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/notifications/${id}/read`, {
      method: 'PATCH'
    });
    return res.data;
  }

  async getSettings(): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>('/admin/settings');
    return res.data;
  }

  // ── Admin Product Management ────────────────────────────────────────────────

  /** Fetch all products (including inactive) for admin panel. */
  async getAdminProducts(filters?: AdminProductFilters): Promise<{ products: Product[]; total: number }> {
    const params = new URLSearchParams();
    params.append('includeInactive', 'true');
    if (filters?.search) params.append('q', filters.search);
    if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));

    const res = await fetchJson<{ success: boolean; data: any[]; pagination?: any }>(`/admin/products?${params.toString()}`);
    const rawList = Array.isArray(res.data) ? res.data : [];
    const products = rawList.map(normalizeProduct);
    // Client-side filter by active/inactive status after normalization
    const statusFilter = filters?.status;
    const filtered = statusFilter === 'active'
      ? products.filter(p => p.isActive)
      : statusFilter === 'inactive'
        ? products.filter(p => !p.isActive)
        : products;
    return { products: filtered, total: res.pagination?.total ?? filtered.length };
  }

  /** Fetch a single product by ID for admin edit form. */
  async getAdminProduct(id: string): Promise<Product> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/products/${id}`);
    return normalizeProduct(res.data);
  }

  /** Create a new product. */
  async createProduct(data: Record<string, any>): Promise<Product> {
    const res = await fetchJson<{ success: boolean; data: any }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return normalizeProduct(res.data);
  }

  /** Update an existing product (partial update — only provided fields change). */
  async updateProduct(id: string, data: Record<string, any>): Promise<Product> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return normalizeProduct(res.data);
  }

  /** Soft-delete (deactivate) a product. */
  async deactivateProduct(id: string): Promise<void> {
    await fetchJson<{ success: boolean }>(`/admin/products/${id}`, {
      method: 'DELETE'
      // No ?hard=true → soft delete sets isActive=false
    });
  }

  /** Reactivate a previously deactivated product. */
  async reactivateProduct(id: string): Promise<Product> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/products/${id}/reactivate`, {
      method: 'PATCH'
    });
    return normalizeProduct(res.data);
  }

  /**
   * Upload a product image.
   * Uses hunting_auth_token (consistent with api.ts fetchJson).
   * NOTE: Cloudinary integration is Phase 3; this endpoint saves to local uploads for now.
   */
  async uploadProductImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    // Use the same token key as api.ts (hunting_auth_token)
    const token = typeof window !== 'undefined' ? localStorage.getItem('hunting_auth_token') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Image upload failed');
    }

    return data.data;
  }


  // Collections / Categories Management
  async getCategories(includeInactive = true): Promise<any[]> {
    const res = await fetchJson<{ success: boolean; data: any[] }>(`/admin/categories?includeInactive=${includeInactive}`);
    return res.data;
  }

  async createCategory(data: { name: string; slug: string; subtitle?: string; description?: string }): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async updateCategory(id: string, data: Partial<{ name: string; slug: string; subtitle?: string; description?: string; isActive?: boolean }>): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await fetchJson<{ success: boolean }>(`/admin/categories/${id}`, {
      method: 'DELETE'
    });
  }
}

export const adminService = new AdminService();