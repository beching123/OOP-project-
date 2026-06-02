import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ROLE_PORTALS = {
  ROLE_ADMIN: '/admin/dashboard',
  ADMIN: '/admin/dashboard',
  ROLE_CASHIER: '/cashier/dashboard',
  CASHIER: '/cashier/dashboard',
  ROLE_ORDER_PROCESSOR: '/processor/dashboard',
  ORDER_PROCESSOR: '/processor/dashboard',
  ROLE_SUPPORT_AGENT: '/support/dashboard',
  SUPPORT_AGENT: '/support/dashboard',
  ROLE_INVENTORY_MANAGER: '/inventory/dashboard',
  INVENTORY_MANAGER: '/inventory/dashboard',
};

const STAFF_ROLES = ['ROLE_CASHIER', 'CASHIER', 'ROLE_ORDER_PROCESSOR', 'ORDER_PROCESSOR', 'ROLE_SUPPORT_AGENT', 'SUPPORT_AGENT', 'ROLE_INVENTORY_MANAGER', 'INVENTORY_MANAGER'];

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setUser: (user) => set({ user }),
    }),
    { name: 'trendora-admin-auth' }
  )
);

export const isAuthenticated = () => {
  const state = useAuthStore.getState();
  return !!state.token && !!state.user;
};

export const isAdmin = () => {
  const state = useAuthStore.getState();
  const role = state.user?.role;
  return role === 'ROLE_ADMIN' || role === 'ADMIN';
};

export const isStaff = () => {
  const state = useAuthStore.getState();
  const role = state.user?.role;
  return STAFF_ROLES.includes(role);
};

export const getRolePortal = () => {
  const state = useAuthStore.getState();
  const role = state.user?.role;
  return ROLE_PORTALS[role] || '/admin/dashboard';
};

export const getRoleLabel = () => {
  const state = useAuthStore.getState();
  const role = (state.user?.role || '').replace('ROLE_', '');
  const labels = {
    ADMIN: 'Administrator',
    CASHIER: 'Cashier',
    ORDER_PROCESSOR: 'Order Processor',
    SUPPORT_AGENT: 'Support Agent',
    INVENTORY_MANAGER: 'Inventory Manager',
  };
  return labels[role] || role;
};

export default useAuthStore;
