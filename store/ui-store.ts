import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Display currency for the storefront. Prices are stored in NGN minor units
 * (authoritative, server-side); this only controls how a client component *renders*
 * them. Checkout and fulfilment always use the database currency.
 */

export const SUPPORTED_CURRENCIES = ["NGN", "USD"] as const;
export type DisplayCurrency = (typeof SUPPORTED_CURRENCIES)[number];

/** Indicative display rate. Never used for charging — only for presentation. */
const NGN_PER_USD = 1540;

type UiStore = {
  currency: DisplayCurrency;
  setCurrency: (currency: DisplayCurrency) => void;
};

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      currency: "NGN",
      setCurrency: (currency) => set({ currency })
    }),
    {
      name: "deon-ui",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currency: state.currency })
    }
  )
);

/**
 * Renders an NGN minor-unit amount in the shopper's display currency.
 * Minor units are preserved so rounding happens once, at the end.
 */
export function convertMinor(minor: number, from: DisplayCurrency, to: DisplayCurrency): number {
  if (from === to) return minor;
  if (from === "NGN" && to === "USD") return Math.round(minor / NGN_PER_USD);
  return Math.round(minor * NGN_PER_USD);
}

export function formatDisplayMoney(
  minor: number,
  display: DisplayCurrency,
  sourceCurrency = "NGN"
): string {
  const converted = convertMinor(minor, sourceCurrency as DisplayCurrency, display);
  const symbol = display === "NGN" ? "₦" : "$";
  const major = converted / 100;

  const formatted = major.toLocaleString("en-US", {
    minimumFractionDigits: major >= 1000 ? 0 : 2,
    maximumFractionDigits: major >= 1000 ? 0 : 2
  });

  return `${symbol}${formatted}`;
}