"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useUiStore, formatDisplayMoney } from "@/store/ui-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import type { CatalogProduct, CatalogVariant } from "@/lib/catalog/catalog-repository";
import { cn } from "@/lib/utils";

/**
 * Hover quick-add: choose a size and drop the piece straight into the bag.
 *
 * Adds the specific variant so the bag always holds a real variant id, keeping
 * server-side re-pricing at checkout authoritative.
 */
export function QuickAdd({ product }: { product: CatalogProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  // Subscribe to the stable `items` array, then derive the lookup set in a memo.
  // Building a Set inside the selector would return a fresh reference on every
  // store read, which makes useSyncExternalStore spin looking for a cached snapshot.
  const items = useCartStore((state) => state.items);
  const bagVariantIds = useMemo(
    () => new Set(items.map((item) => item.variantId)),
    [items]
  );

  // Group in-stock variants by size; the first available colour wins per size.
  const bySize = new Map<string, CatalogVariant>();
  for (const variant of product.variants) {
    if (variant.stock <= 0) continue;
    const key = variant.size ?? "One size";
    if (!bySize.has(key)) bySize.set(key, variant);
  }
  const sizes = Array.from(bySize.entries());

  if (sizes.length === 0) return null;

  function add(size: string, variant: CatalogVariant) {
    addItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      imageUrl: product.images[0]?.url ?? null,
      unitPriceMinor: variant.priceMinor ?? product.priceMinor ?? 0,
      currency: product.currency,
      maxStock: variant.stock,
      quantity: 1
    });

    setJustAdded(size);
    window.setTimeout(() => setJustAdded(null), 1200);
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 translate-y-full p-3 opacity-0",
        "transition-all duration-500 ease-luxe",
        "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
        "group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100"
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {sizes.map(([size, variant]) => {
          const added = justAdded === size;
          const inBag = bagVariantIds.has(variant.id);

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => add(size, variant)}
              className={cn(
                "inline-flex min-w-[2.5rem] items-center justify-center gap-1 px-2.5 py-2 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] backdrop-blur-md transition-all duration-300",
                added
                  ? "bg-gold text-noir"
                  : inBag
                    ? "bg-bone text-noir hover:bg-gold"
                    : "bg-noir/70 text-bone hover:bg-gold hover:text-noir"
              )}
              aria-label={`Add ${product.name}, size ${size}, to bag`}
            >
              {added ? <Check className="h-3 w-3" aria-hidden /> : null}
              {size}
            </button>
          );
        })}
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {justAdded ? `${product.name}, size ${justAdded}, added to bag` : ""}
      </span>
    </div>
  );
}

/**
 * Renders an NGN minor-unit amount in the shopper's display currency.
 * Falls back to NGN until hydration so server and client markup match.
 */
export function PriceTag({ minor, currency }: { minor: number | null; currency: string }) {
  const hydrated = useHasHydrated();
  const display = useUiStore((state) => state.currency);

  if (minor === null) {
    return (
      <span className="font-sans text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
        Unavailable
      </span>
    );
  }

  return <span className="tabular-nums">{formatDisplayMoney(minor, hydrated ? display : "NGN", currency)}</span>;
}