import type { Coupon, Customer, Order, Product } from '@/types';
import { getCookie } from '@/lib/storage';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

interface ApiResponse<T> { ok: boolean; message?: string; data: T; }

function getAdminToken() {
  return getCookie('af-admin-token');
}

function getCustomerToken() {
  return getCookie('af-customer-token');
}

async function request<T>(path: string, options: RequestInit = {}, auth: false | 'admin' | 'customer' | 'either' = false): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL não configurado.');
  }
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth) {
    const token = auth === 'admin'
      ? getAdminToken()
      : auth === 'customer'
        ? getCustomerToken()
        : (getAdminToken() || getCustomerToken());
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const json = await response.json().catch(() => null) as ApiResponse<T> | null;
  if (!response.ok || !json?.ok) {
    throw new Error(json?.message || 'Erro na API.');
  }
  return json.data;
}

export const api = {
  baseUrl: API_BASE_URL,
  async loginAdmin(username: string, password: string) {
    return request<{ token: string; user: { username: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  async registerCustomer(payload: { name: string; email: string; phone: string; cpf: string; password: string }) {
    return request<{ token: string; user: Customer }>('/api/customers/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async loginCustomer(email: string, password: string) {
    return request<{ token: string; user: Customer }>('/api/customers/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  async getCurrentCustomer() {
    return request<Customer>('/api/customers/me', {}, 'customer');
  },
  async getCustomers() {
    return request<Customer[]>('/api/customers', {}, 'admin');
  },
  async getCustomerOrders() {
    return request<Order[]>('/api/customers/orders', {}, 'customer');
  },
  async createCustomerAddress(payload: Record<string, unknown>) {
    return request<Customer>('/api/customers/addresses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, 'customer');
  },
  async getProducts() {
    return request<Product[]>('/api/products');
  },
  async createProduct(payload: Record<string, unknown>) {
    return request<Product>('/api/products', { method: 'POST', body: JSON.stringify(payload) }, 'admin');
  },
  async updateProduct(id: string, payload: Record<string, unknown>) {
    return request<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, 'admin');
  },
  async deleteProduct(id: string) {
    return request<{ success: boolean }>(`/api/products/${id}`, { method: 'DELETE' }, 'admin');
  },
  async getCoupons() {
    return request<Coupon[]>('/api/coupons', {}, 'admin');
  },
  async createCoupon(payload: Record<string, unknown>) {
    return request<{ success: boolean }>('/api/coupons', { method: 'POST', body: JSON.stringify(payload) }, 'admin');
  },
  async deleteCoupon(id: string) {
    return request<{ success: boolean }>(`/api/coupons/${id}`, { method: 'DELETE' }, 'admin');
  },
  async validateCoupon(code: string, subtotal: number) {
    return request<{ coupon: Coupon; discount: number }>(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
  },
  async getOrders() {
    return request<Order[]>('/api/orders', {}, 'either');
  },
  async createOrder(payload: Record<string, unknown>) {
    return request<{ id: string }>('/api/orders', { method: 'POST', body: JSON.stringify(payload) }, 'either');
  },
  async updateOrderStatus(id: string, status: string) {
    return request<{ success: boolean }>(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, 'admin');
  },
  async updateOrderTracking(id: string, trackingCode: string) {
    return request<{ success: boolean }>(`/api/orders/${id}/tracking`, { method: 'PATCH', body: JSON.stringify({ trackingCode }) }, 'admin');
  },
  async uploadImage(file: string, filename: string) {
    return request<{ url?: string; secure_url?: string }>('/api/upload/image', {
      method: 'POST',
      body: JSON.stringify({ file, filename }),
    }, 'admin');
  },
  async estimateShipping(state: string, city: string, subtotal: number) {
    return request<{ shipping: number; state: string; city: string }>(`/api/shipping/estimate?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&subtotal=${subtotal}`);
  },
};
