import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_SHIPPING_RATES = [
  { region: 'South-West (Buea)', fee: 1000 },
  { region: 'South-West (Other)', fee: 2000 },
  { region: 'Littoral', fee: 2000 },
  { region: 'West', fee: 2500 },
  { region: 'North-West', fee: 2500 },
  { region: 'Centre', fee: 3000 },
  { region: 'South', fee: 3000 },
  { region: 'East', fee: 3500 },
  { region: 'Adamawa', fee: 3500 },
  { region: 'North', fee: 4000 },
  { region: 'Far North', fee: 4000 },
];

const useSettingsStore = create(
  persist(
    (set, get) => ({
      shippingRates: DEFAULT_SHIPPING_RATES,
      freeShippingThreshold: 50000,
      _apiSynced: false,

      getRate: (region) => {
        const rates = get().shippingRates;
        const match = rates.find(r => r.region === region);
        return match ? match.fee : 2000;
      },

      updateRates: (rates) => set({ shippingRates: rates }),
      updateThreshold: (threshold) => set({ freeShippingThreshold: threshold }),

      syncFromApi: async () => {
        try {
          const { settingsService } = await import('../services/adminService');
          const res = await settingsService.getSettings();
          const data = res.data || {};
          const updates = {};
          if (data.shipping_rates) {
            try { updates.shippingRates = JSON.parse(data.shipping_rates); } catch {}
          }
          if (data.free_shipping_threshold) {
            updates.freeShippingThreshold = parseInt(data.free_shipping_threshold) || 50000;
          }
          if (Object.keys(updates).length > 0) {
            set({ ...updates, _apiSynced: true });
          }
        } catch {
          // API not available, use localStorage
        }
      },

      saveToApi: async () => {
        try {
          const { settingsService } = await import('../services/adminService');
          const state = get();
          await settingsService.saveSettings({
            shipping_rates: JSON.stringify(state.shippingRates),
            free_shipping_threshold: String(state.freeShippingThreshold),
          });
          set({ _apiSynced: true });
        } catch {
          // API not available, saved locally
        }
      },

      resetToDefaults: () => set({
        shippingRates: DEFAULT_SHIPPING_RATES,
        freeShippingThreshold: 50000,
        _apiSynced: false,
      }),
    }),
    {
      name: 'trendora-settings',
    }
  )
);

export default useSettingsStore;
export { DEFAULT_SHIPPING_RATES };
