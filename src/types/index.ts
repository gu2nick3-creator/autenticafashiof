export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  productType: 'roupa' | 'sapato';
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  stock: number;
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  bestSeller: boolean;
  active: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  customer: Customer;
  address: Address;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  orders: string[];
  totalSpent: number;
  createdAt: string;
  addresses: Address[];
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minValue: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar?: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  aboutText: string;
  whatsapp: string;
  instagram: string;
  email: string;
  phone: string;
  address: string;
}
