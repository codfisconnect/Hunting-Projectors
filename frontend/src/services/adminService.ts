import { fetchJson } from './api';

export interface AdminStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  activeProducts: number;
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

  async uploadProductImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('hunting_token');
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
}

export const adminService = new AdminService();
