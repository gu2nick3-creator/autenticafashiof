import type { Coupon, Order, Product } from '@/types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

interface ApiResponse<T> { ok: boolean; message?: string; data: T; }

function getAuthToken() {
  return localStorage.getItem('af-admin-token') || '';
}

async function request<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL não configurado.');
  }
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth) {
    const token = getAuthToken();
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
  async getProducts() {
    return request<Product[]>('/api/products');
  },
  async createProduct(payload: Record<string, unknown>) {
    return request<Product>('/api/products', { method: 'POST', body: JSON.stringify(payload) }, true);
  },
  async updateProduct(id: string, payload: Record<string, unknown>) {
    return request<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, true);
  },
  async deleteProduct(id: string) {
    return request<{ success: boolean }>(`/api/products/${id}`, { method: 'DELETE' }, true);
  },
  async getCoupons() {
    return request<Coupon[]>('/api/coupons', {}, true);
  },
  async createCoupon(payload: Record<string, unknown>) {
    return request<{ success: boolean }>('/api/coupons', { method: 'POST', body: JSON.stringify(payload) }, true);
  },
  async deleteCoupon(id: string) {
    return request<{ success: boolean }>(`/api/coupons/${id}`, { method: 'DELETE' }, true);
  },
  async validateCoupon(code: string, subtotal: number) {
    return request<{ coupon: Coupon; discount: number }>(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
  },
  async getOrders() {
    return request<Order[]>('/api/orders', {}, true);
  },
  async createOrder(payload: Record<string, unknown>) {
    return request<{ id: string }>('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
  },
  async updateOrderStatus(id: string, status: string) {
    return request<{ success: boolean }>(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, true);
  },
  async updateOrderTracking(id: string, trackingCode: string) {
    return request<{ success: boolean }>(`/api/orders/${id}/tracking`, { method: 'PATCH', body: JSON.stringify({ trackingCode }) }, true);
  },
  async uploadImage(file: string, filename: string) {
    return request<{ url?: string; secure_url?: string }>('/api/upload/image', {
      method: 'POST',
      body: JSON.stringify({ file, filename }),
    }, true);
  },
  async estimateShipping(state: string, city: string, subtotal: number) {
    return request<{ shipping: number; state: string; city: string }>(`/api/shipping/estimate?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&subtotal=${subtotal}`);
  },
};
