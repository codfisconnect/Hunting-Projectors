import { fetchJson, API_BASE_URL } from './api';
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

  async updateOrderPaymentStatus(orderId: string, payload: { paymentStatus: string; transactionReference?: string; notes?: string }) {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/orders/${orderId}/payment`, {
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

  /** Permanently delete a product (only allowed if not referenced by historical orders). */
  async deleteProduct(id: string): Promise<void> {
    await fetchJson<{ success: boolean; message?: string }>(`/admin/products/${id}?hard=true`, {
      method: 'DELETE'
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
   * Uses hunting_auth_token and API_BASE_URL (consistent with api.ts).
   * Safely parses response without uncaught JSON exceptions.
   */
  async uploadProductImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('hunting_auth_token') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/admin/upload`;
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });
    } catch (networkErr: any) {
      throw new Error(`Unable to connect to upload server at ${url}: ${networkErr.message || 'Network error'}`);
    }

    const responseText = await response.text();
    let data: any = null;
    if (responseText && responseText.trim().length > 0) {
      try {
        data = JSON.parse(responseText);
      } catch {
        // Response was not JSON (e.g. HTML 404/502/500 proxy error)
        throw new Error(`Server returned non-JSON response (${response.status} ${response.statusText}): ${responseText.slice(0, 150)}`);
      }
    } else {
      throw new Error(`Server returned an empty response (Status: ${response.status} ${response.statusText})`);
    }

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || data?.error || `Image upload failed (HTTP ${response.status})`);
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

  async getReviews(): Promise<any[]> {
    const res = await fetchJson<{ success: boolean; data: any[] }>('/admin/reviews');
    return res.data;
  }

  async moderateReview(id: string, action: 'approve' | 'reject' | 'hide' | 'restore'): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/reviews/${id}/moderate`, {
      method: 'PATCH',
      body: JSON.stringify({ action })
    });
    return res.data;
  }

  async getOrderInvoice(orderId: string): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/orders/${orderId}/invoice`);
    return res.data;
  }

  async getAuditLogs(limit = 50): Promise<any[]> {
    const res = await fetchJson<{ success: boolean; data: any[] }>(`/admin/audit-logs?limit=${limit}`);
    return res.data;
  }

  async getCmsContent(): Promise<Record<string, any>> {
    const res = await fetchJson<{ success: boolean; data: Record<string, any> }>('/admin/cms');
    return res.data;
  }

  async updateCmsContent(key: string, value: any): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>('/admin/cms', {
      method: 'POST',
      body: JSON.stringify({ key, value })
    });
    return res.data;
  }

  async bulkImportProducts(products: any[]): Promise<{ createdCount: number; errors: any[] }> {
    const res = await fetchJson<{ success: boolean; data: { createdCount: number; errors: any[] } }>('/admin/products/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ products })
    });
    return res.data;
  }

  async getAnalytics(range = 'all'): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/analytics?range=${range}`);
    return res.data;
  }

  async getWarranties(params?: { q?: string; status?: string }): Promise<any[]> {
    const qp = new URLSearchParams();
    if (params?.q) qp.append('q', params.q);
    if (params?.status && params.status !== 'all') qp.append('status', params.status);
    const query = qp.toString() ? `?${qp.toString()}` : '';
    const res = await fetchJson<{ success: boolean; data: any[] }>(`/admin/warranties${query}`);
    return res.data;
  }

  async createWarranty(data: any): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>('/admin/warranties', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async getServiceTickets(params?: { q?: string; status?: string }): Promise<any[]> {
    const qp = new URLSearchParams();
    if (params?.q) qp.append('q', params.q);
    if (params?.status && params.status !== 'all') qp.append('status', params.status);
    const query = qp.toString() ? `?${qp.toString()}` : '';
    const res = await fetchJson<{ success: boolean; data: any[] }>(`/admin/service-tickets${query}`);
    return res.data;
  }

  async createServiceTicket(data: any): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>('/admin/service-tickets', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async updateServiceTicketStatus(id: string, status: string, serviceNotes?: string): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/service-tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, serviceNotes })
    });
    return res.data;
  }

  async getQuotations(): Promise<any[]> {
    const res = await fetchJson<{ success: boolean; data: any[] }>('/admin/quotations');
    return res.data;
  }

  async createQuotation(data: any): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>('/admin/quotations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async updateQuotationStatus(id: string, status: string): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/quotations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return res.data;
  }

  async convertQuotationToOrder(id: string): Promise<any> {
    const res = await fetchJson<{ success: boolean; data: any }>(`/admin/quotations/${id}/convert-to-order`, {
      method: 'POST'
    });
    return res.data;
  }
}

export const adminService = new AdminService();