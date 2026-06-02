import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SHIPPING_RATES, REGION_SHIPPING_RATES, getShippingCost as getApiShippingCost } from '../utils/constants';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variant = null) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.id === product.id && item.variant === variant
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.salePrice || product.price,
                originalPrice: product.price,
                image: product.image || product.images?.[0],
                quantity,
                variant,
                stock: product.stock,
              },
            ],
          };
        });
      },

      removeItem: (productId, variant = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === productId && item.variant === variant)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variant = null) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId && item.variant === variant
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock || 99)) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0);
      },

      getDiscountedSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getSavings: () => {
        return get().items.reduce((sum, item) => {
          const originalPrice = item.originalPrice || item.price;
          const savedPerItem = Math.max(0, originalPrice - item.price);
          return sum + savedPerItem * item.quantity;
        }, 0);
      },

      getShippingCost: (region) => {
        const subtotal = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return getApiShippingCost(region === 'buea' ? 'South-West' : region, region === 'buea' ? 'Buea' : '', subtotal);
      },

      getTotal: (region) => {
        const discountedSubtotal = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingCost = useCartStore.getState().getShippingCost(region);
        return discountedSubtotal + shippingCost;
      },
    }),
    {
      name: 'trendora-cart',
    }
  )
);

export default useCartStore;
