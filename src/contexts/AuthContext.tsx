import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Address, Customer, Order, OrderStatus } from '@/types';
import { api } from '@/lib/api';
import { getCookie, removeCookie, setCookie } from '@/lib/storage';

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

interface ActionResult {
  ok: boolean;
  message: string;
}

interface AuthContextType {
  currentCustomer: Customer | null;
  customers: Customer[];
  orders: Order[];
  isAdminAuthenticated: boolean;
  loginCustomer: (email: string, password: string) => Promise<ActionResult>;
  registerCustomer: (input: RegisterInput) => Promise<ActionResult>;
  logoutCustomer: () => void;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  getCustomerOrders: () => Order[];
  createOrder: (input: CheckoutInput) => Promise<Order>;
  addCustomerAddress: (input: Address) => Promise<ActionResult>;
  updateOrderTracking: (orderId: string, trackingCode: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  adminToken: 'af-admin-token',
  customerToken: 'af-customer-token',
};

function nowIso() {
  return new Date().toISOString();
}

function generateId(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => Boolean(getCookie(STORAGE_KEYS.adminToken)));

  const loadAdminData = async () => {
    if (!getCookie(STORAGE_KEYS.adminToken)) return;
    try {
      const [ordersData, customersData] = await Promise.all([api.getOrders(), api.getCustomers()]);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch {
      setOrders([]);
      setCustomers([]);
    }
  };

  const loadCustomerData = async () => {
    if (!getCookie(STORAGE_KEYS.customerToken)) {
      setCurrentCustomer(null);
      return;
    }
    try {
      const [customerData, ordersData] = await Promise.all([api.getCurrentCustomer(), api.getCustomerOrders()]);
      setCurrentCustomer(customerData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch {
      removeCookie(STORAGE_KEYS.customerToken);
      setCurrentCustomer(null);
      setOrders([]);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) loadAdminData();
  }, [isAdminAuthenticated]);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const registerCustomer = async (input: RegisterInput): Promise<ActionResult> => {
    try {
      const auth = await api.registerCustomer(input);
      setCookie(STORAGE_KEYS.customerToken, auth.token);
      setCurrentCustomer(auth.user);
      const ordersData = await api.getCustomerOrders().catch(() => []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      return { ok: true, message: 'Conta criada com sucesso.' };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Não foi possível criar a conta.' };
    }
  };

  const loginCustomer = async (email: string, password: string): Promise<ActionResult> => {
    try {
      const auth = await api.loginCustomer(email, password);
      setCookie(STORAGE_KEYS.customerToken, auth.token);
      setCurrentCustomer(auth.user);
      const ordersData = await api.getCustomerOrders().catch(() => []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      return { ok: true, message: 'Login realizado com sucesso.' };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'E-mail ou senha inválidos.' };
    }
  };

  const logoutCustomer = () => {
    removeCookie(STORAGE_KEYS.customerToken);
    setCurrentCustomer(null);
    setOrders(isAdminAuthenticated ? orders : []);
  };

  const loginAdmin = async (username: string, password: string) => {
    try {
      const auth = await api.loginAdmin(username, password);
      setCookie(STORAGE_KEYS.adminToken, auth.token);
      setIsAdminAuthenticated(true);
      await loadAdminData();
      return true;
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    removeCookie(STORAGE_KEYS.adminToken);
    setIsAdminAuthenticated(false);
    setCustomers([]);
    if (!getCookie(STORAGE_KEYS.customerToken)) {
      setOrders([]);
    }
  };

  const getCustomerOrders = () => {
    if (!currentCustomer) return [];
    return orders.filter((order) => order.customer?.email?.toLowerCase() === currentCustomer.email.toLowerCase());
  };

  const addCustomerAddress = async (input: Address): Promise<ActionResult> => {
    if (!currentCustomer) {
      return { ok: false, message: 'Faça login para adicionar um endereço.' };
    }

    try {
      const customer = await api.createCustomerAddress(input as unknown as Record<string, unknown>);
      setCurrentCustomer(customer);
      setCustomers((prev) => prev.map((item) => item.id === customer.id ? customer : item));
      return { ok: true, message: 'Endereço salvo com sucesso.' };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Não foi possível salvar o endereço.' };
    }
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
        orders: currentCustomer?.orders || [response.id],
        totalSpent: currentCustomer?.totalSpent || input.total,
        createdAt: currentCustomer?.createdAt || nowIso(),
        addresses: currentCustomer?.addresses?.length ? currentCustomer.addresses : [input.address],
      },
      address: input.address,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    if (currentCustomer) {
      await loadCustomerData();
    } else {
      setOrders((prev) => [order, ...prev]);
    }

    if (isAdminAuthenticated) {
      await loadAdminData();
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
      addCustomerAddress,
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
