export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPPORT_STAFF';
  createdAt?: string;
  addresses?: any[];
  _count?: {
    orders?: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
