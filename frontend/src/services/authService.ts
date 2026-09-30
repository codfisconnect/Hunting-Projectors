import { fetchJson } from './api';
import { User, AuthResponse, RegisterPayload, LoginPayload } from '../types/auth';

const TOKEN_KEY = 'hunting_auth_token';

export const authService = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await fetchJson<{ success: boolean; data: AuthResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.data.token);
    return res.data;
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await fetchJson<{ success: boolean; data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.data.token);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await fetchJson<{ success: boolean; data: User }>('/auth/me');
    return res.data;
  },

  async updateProfile(data: { fullName?: string; phoneNumber?: string; email?: string }): Promise<User> {
    const res = await fetchJson<{ success: boolean; data: User }>('/customers/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await fetchJson('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      this.removeToken();
    }
  },
};
