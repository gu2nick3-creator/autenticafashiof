import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { CartItem, Coupon, Product } from '@/types';
import { api } from '@/lib/api';

interface ProductInput {
  name: string;
  slug?: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  productType: 'roupa' | 'sapato';
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  bestSeller?: boolean;
  active?: boolean;
}

interface StoreContextType {
  products: Product[];
  coupons: Coupon[];
  cart: CartItem[];
  favorites: string[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addProduct: (input: ProductInput) => void;
  updateProduct: (productId: string, input: ProductInput) => void;
  deleteProduct: (productId: string) => void;
  createCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  deleteCoupon: (couponId: string) => void;
  calculateShippingForCart: (address?: { city?: string; state?: string }) => { amount: number; region: string; label: string };
  refreshProducts: () => Promise<void>;
  refreshCoupons: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  cart: 'af-cart',
  favorites: 'af-favorites',
};

function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeProduct(input: ProductInput, current?: Product): Product {
  const slug = input.slug?.trim() || makeSlug(input.name);
  const createdAt = current?.createdAt || new Date().toISOString();

  return {
    id: current?.id || `product-${Date.now()}`,
    name: input.name,
    slug,
    sku: input.sku,
    shortDescription: input.shortDescription,
    description: input.description,
    price: Number(input.price) || 0,
    salePrice: input.salePrice ? Number(input.salePrice) : undefined,
    category: input.category,
    productType: input.productType,
    sizes: input.sizes.filter(Boolean),
    colors: input.colors.filter(color => color.name && color.hex),
    images: input.images.filter(Boolean),
    stock: Number(input.stock) || 0,
    featured: Boolean(input.featured),
    isNew: Boolean(input.isNew),
    onSale: Boolean(input.onSale),
    bestSeller: Boolean(input.bestSeller),
    active: input.active ?? true,
    rating: current?.rating || 5,
    reviewCount: current?.reviewCount || 0,
    createdAt,
  };
}

function mapShippingLabel(amount: number, state?: string, city?: string) {
  if (amount <= 0) return 'Frete grátis';
  const location = [city, state].filter(Boolean).join('/');
  return location ? `Entrega estimada para ${location}` : 'Frete estimado';
}

async function persistProduct(action: 'create' | 'update', productId: string | null, input: ProductInput) {
  const uploadedImages: string[] = [];
  for (const image of input.images) {
    if (image.startsWith('data:')) {
      const uploaded = await api.uploadImage(image, `${input.sku || input.name}-${Date.now()}.jpg`);
      uploadedImages.push(uploaded.secure_url || uploaded.url || image);
    } else {
      uploadedImages.push(image);
    }
  }

  const payload = {
    ...input,
    slug: input.slug?.trim() || makeSlug(input.name),
    images: uploadedImages,
  };

  if (action === 'create') return api.createProduct(payload);
  return api.updateProduct(productId || '', payload);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => parseJSON(localStorage.getItem(STORAGE_KEYS.cart), []));
  const [favorites, setFavorites] = useState<string[]>(() => parseJSON(localStorage.getItem(STORAGE_KEYS.favorites), []));

  const refreshProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    }
  };

  const refreshCoupons = async () => {
    try {
      const data = await api.getCoupons();
      setCoupons(Array.isArray(data) ? data : []);
    } catch {
      setCoupons([]);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size && i.color === color);
      if (existing) {
        return prev.map(i => i.product.id === product.id && i.size === size && i.color === color ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, size, color, quantity }];
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(i => !(i.product.id === productId && i.size === size && i.color === color)));
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev => prev.map(i => i.product.id === productId && i.size === size && i.color === color ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((acc, item) => acc + (item.product.salePrice || item.product.price) * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const addProduct = async (input: ProductInput) => {
    const created = await persistProduct('create', null, input);
    setProducts(prev => [normalizeProduct(created as unknown as ProductInput), ...prev]);
    await refreshProducts();
  };

  const updateProductAction = async (productId: string, input: ProductInput) => {
    await persistProduct('update', productId, input);
    await refreshProducts();
  };

  const deleteProductAction = async (productId: string) => {
    await api.deleteProduct(productId);
    setProducts(prev => prev.filter(product => product.id !== productId));
    setFavorites(prev => prev.filter(id => id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const createCoupon = async (coupon: Omit<Coupon, 'id' | 'usedCount'>) => {
    await api.createCoupon(coupon as unknown as Record<string, unknown>);
    await refreshCoupons();
  };

  const deleteCoupon = async (couponId: string) => {
    await api.deleteCoupon(couponId);
    setCoupons(prev => prev.filter(coupon => coupon.id !== couponId));
  };

  const calculateShippingForCart = (address?: { city?: string; state?: string }) => {
    const fallbackAmount = cartTotal >= 399 ? 0 : 24.9;
    return {
      amount: fallbackAmount,
      region: address?.state || 'BR',
      label: mapShippingLabel(fallbackAmount, address?.state, address?.city),
    };
  };

  const value = useMemo(() => ({
    products,
    coupons,
    cart,
    favorites,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    toggleFavorite,
    isFavorite,
    addProduct,
    updateProduct: updateProductAction,
    deleteProduct: deleteProductAction,
    createCoupon,
    deleteCoupon,
    calculateShippingForCart,
    refreshProducts,
    refreshCoupons,
  }), [products, coupons, cart, favorites, cartTotal, cartCount]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
