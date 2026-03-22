import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Address, Customer, Order, OrderStatus } from '@/types';
import { api } from '@/lib/api';

interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
}

interface CheckoutCustomerInput {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface CheckoutInput {
  customer: CheckoutCustomerInput;
  address: Address;
  items: Order['items'];
  subtotal: number;
  shipping: number;
  total: number;
}

interface AuthContextType {
  currentCustomer: Customer | null;
  customers: Customer[];
  orders: Order[];
  isAdminAuthenticated: boolean;
  loginCustomer: (email: string, password: string) => { ok: boolean; message: string };
  registerCustomer: (input: RegisterInput) => { ok: boolean; message: string };
  logoutCustomer: () => void;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  getCustomerOrders: () => Order[];
  createOrder: (input: CheckoutInput) => Promise<Order>;
  updateOrderTracking: (orderId: string, trackingCode: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  customers: 'af-customers',
  auth: 'af-current-customer-id',
  orders: 'af-orders',
  admin: 'af-admin-authenticated',
  adminToken: 'af-admin-token',
};

function nowIso() {
  return new Date().toISOString();
}

function generateId(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`;
}

function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<(Customer & { password: string })[]>(() =>
    parseJSON(localStorage.getItem(STORAGE_KEYS.customers), []),
  );
  const [orders, setOrders] = useState<Order[]>(() => parseJSON(localStorage.getItem(STORAGE_KEYS.orders), []));
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(() => localStorage.getItem(STORAGE_KEYS.auth));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => localStorage.getItem(STORAGE_KEYS.admin) === 'true');

  const loadAdminOrders = async () => {
    if (!localStorage.getItem(STORAGE_KEYS.adminToken)) return;
    try {
      const data = await api.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      // mantém pedidos locais se API falhar
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentCustomerId) {
      localStorage.setItem(STORAGE_KEYS.auth, currentCustomerId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.auth);
    }
  }, [currentCustomerId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.admin, String(isAdminAuthenticated));
    if (isAdminAuthenticated) loadAdminOrders();
  }, [isAdminAuthenticated]);

  const currentCustomer = useMemo(
    () => customers.find((customer) => customer.id === currentCustomerId) || null,
    [customers, currentCustomerId],
  );

  const registerCustomer = (input: RegisterInput) => {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password) return { ok: false, message: 'Preencha e-mail e senha.' };
    if (customers.some((customer) => customer.email.toLowerCase() === email)) {
      return { ok: false, message: 'Já existe uma conta com esse e-mail.' };
    }
    const customer: Customer & { password: string } = {
      id: generateId('customer-'),
      name: input.name,
      email,
      phone: input.phone,
      cpf: input.cpf,
      password: input.password,
      orders: [],
      totalSpent: 0,
      createdAt: nowIso(),
      addresses: [],
    };
    setCustomers((prev) => [customer, ...prev]);
    setCurrentCustomerId(customer.id);
    return { ok: true, message: 'Conta criada com sucesso.' };
  };

  const loginCustomer = (email: string, password: string) => {
    const customer = customers.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!customer) return { ok: false, message: 'E-mail ou senha inválidos.' };
    setCurrentCustomerId(customer.id);
    return { ok: true, message: 'Login realizado com sucesso.' };
  };

  const logoutCustomer = () => setCurrentCustomerId(null);

  const loginAdmin = async (username: string, password: string) => {
    try {
      const auth = await api.loginAdmin(username, password);
      localStorage.setItem(STORAGE_KEYS.adminToken, auth.token);
      setIsAdminAuthenticated(true);
      await loadAdminOrders();
      return true;
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem(STORAGE_KEYS.adminToken);
    setIsAdminAuthenticated(false);
  };

  const getCustomerOrders = () => {
    if (!currentCustomer) return [];
    return orders.filter((order) => order.customer?.email?.toLowerCase() === currentCustomer.email.toLowerCase());
  };

  const createOrder = async (input: CheckoutInput) => {
    const payload = {
      customer: input.customer,
      address: input.address,
      items: input.items,
      subtotal: input.subtotal,
      shipping: input.shipping,
      total: input.total,
      discount: 0,
      paymentMethod: 'infinitepay',
      paymentTag: '$autentica_fashion',
      status: 'pending',
    };
    const response = await api.createOrder(payload);
    const order: Order = {
      id: response.id,
      items: input.items,
      status: 'pending',
      total: input.total,
      subtotal: input.subtotal,
      shipping: input.shipping,
      discount: 0,
      customer: {
        id: currentCustomer?.id || generateId('guest-'),
        name: input.customer.name,
        email: input.customer.email,
        phone: input.customer.phone,
        cpf: input.customer.cpf,
        orders: [response.id],
        totalSpent: input.total,
        createdAt: currentCustomer?.createdAt || nowIso(),
        addresses: [input.address],
      },
      address: input.address,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    setOrders((prev) => [order, ...prev]);

    if (currentCustomer) {
      setCustomers((prev) => prev.map((customer) => customer.id === currentCustomer.id ? {
        ...customer,
        totalSpent: customer.totalSpent + input.total,
        orders: [response.id, ...customer.orders],
        addresses: customer.addresses.length ? customer.addresses : [input.address],
      } : customer));
    }

    return order;
  };

  const updateOrderTracking = async (orderId: string, trackingCode: string) => {
    await api.updateOrderTracking(orderId, trackingCode);
    setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, trackingCode, updatedAt: nowIso() } : order));
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await api.updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status, updatedAt: nowIso() } : order));
  };

  const value = useMemo(
    () => ({
      currentCustomer,
      customers,
      orders,
      isAdminAuthenticated,
      loginCustomer,
      registerCustomer,
      logoutCustomer,
      loginAdmin,
      logoutAdmin,
      getCustomerOrders,
      createOrder,
      updateOrderTracking,
      updateOrderStatus,
    }),
    [currentCustomer, customers, orders, isAdminAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
