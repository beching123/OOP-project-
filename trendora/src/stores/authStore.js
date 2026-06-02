import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: (user, token) => set({ user, token }),

      logout: () => {
        set({ user: null, token: null });
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'trendora-auth',
    }
  )
);

// Helper functions outside the store
export const isAuthenticated = () => {
  const state = useAuthStore.getState();
  return !!state.token && !!state.user;
};

export const isAdmin = () => {
  const state = useAuthStore.getState();
  return state.user?.role === 'ROLE_ADMIN';
};

export const isStaff = () => {
  const state = useAuthStore.getState();
  const role = state.user?.role;
  return role === 'ROLE_STAFF' || role === 'ROLE_ADMIN';
};

export default useAuthStore;
