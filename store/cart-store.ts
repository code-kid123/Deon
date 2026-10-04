import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types/cart";

type CartStore = {
  items: CartItem[];
  lastUpdatedAt: number | null;
  addItem: (item: CartItem, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      lastUpdatedAt: null,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);

          if (existing) {
            const merged = Math.min(existing.maxStock, existing.quantity + quantity);
            return {
              lastUpdatedAt: Date.now(),
              items: state.items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: merged } : i
              )
            };
          }

          const qty = Math.min(item.maxStock, quantity);
          return {
            lastUpdatedAt: Date.now(),
            items: [...state.items, { ...item, quantity: qty }]
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          lastUpdatedAt: Date.now(),
          items: state.items.filter((i) => i.variantId !== variantId)
        })),

      setQuantity: (variantId, quantity) =>
        set((state) => ({
          lastUpdatedAt: Date.now(),
          items: state.items
            .map((i) =>
              i.variantId === variantId
                ? { ...i, quantity: Math.max(1, Math.min(i.maxStock, quantity)) }
                : i
            )
            .filter((i) => i.quantity > 0)
        })),

      clear: () => set({ items: [], lastUpdatedAt: Date.now() })
    }),
    {
      name: "deon-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, lastUpdatedAt: state.lastUpdatedAt }),
      migrate: (persisted, version) => {
        if (version === 0) {
          return { items: [], lastUpdatedAt: null } as unknown as CartStore;
        }
        return persisted as CartStore;
      }
    }
  )
);

export const selectItemCount = (state: CartStore) =>
  state.items.reduce((count, item) => count + item.quantity, 0);

export const selectSubtotalMinor = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.unitPriceMinor * item.quantity, 0);

export const selectHasItem = (variantId: string) => (state: CartStore) =>
  state.items.some((i) => i.variantId === variantId);