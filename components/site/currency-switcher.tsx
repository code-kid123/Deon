"use client";

import { useUiStore, SUPPORTED_CURRENCIES, type DisplayCurrency } from "@/store/ui-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { cn } from "@/lib/utils";

/**
 * Currency selector in the header utility rail.
 *
 * Presentation only — checkout, order totals and fulfilment always use the
 * database currency. Renders the server default until hydration so markup matches.
 */
export function CurrencySwitcher() {
  const currency = useUiStore((state) => state.currency);
  const setCurrency = useUiStore((state) => state.setCurrency);
  const hydrated = useHasHydrated();

  return (
    <div
      role="group"
      aria-label="Display currency"
      className="hidden items-center rounded-full border border-bone/15 px-1 py-0.5 sm:flex"
    >
      {SUPPORTED_CURRENCIES.map((code) => {
        const active = hydrated ? currency === code : code === "NGN";
        return (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code as DisplayCurrency)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-2.5 py-1 font-sans text-[0.625rem] font-semibold tracking-[0.12em] transition-all duration-300",
              active ? "bg-gold text-noir" : "text-bone/60 hover:text-bone"
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}