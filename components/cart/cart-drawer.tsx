"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  selectItemCount,
  selectSubtotalMinor,
  useCartStore
} from "@/store/cart-store";
import { useUiStore, formatDisplayMoney } from "@/store/ui-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { cn } from "@/lib/utils";

/**
 * Slide-over shopping bag. Totals respect the display currency after hydration;
 * checkout always re-prices in NGN server-side.
 */
export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const items = useCartStore((state) => state.items);
  const subtotalMinor = useCartStore(selectSubtotalMinor);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const currency = useUiStore((state) => state.currency);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const sourceCurrency = items[0]?.currency ?? "NGN";
  const display = hydrated ? currency : "NGN";
  const itemCount = hydrated ? items.reduce((n, i) => n + i.quantity, 0) : 0;

  function goToCheckout() {
    onClose();
    router.push("/checkout");
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[65] transition-opacity duration-400",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        className="absolute inset-0 h-full w-full bg-noir/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close bag"
      />

      <aside
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label="Shopping bag"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-[26rem] flex-col border-l border-bone/10 bg-noir transition-transform duration-500 ease-luxe",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex items-center justify-between border-b border-bone/10 px-6 py-5">
          <h2 className="flex items-baseline gap-3">
            <span className="font-serif text-xl">Shopping Bag</span>
            <span className="font-sans text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {hydrated ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : ""}
            </span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="text-bone/60 transition-colors hover:text-gold"
          >
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </header>

        {!hydrated ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Loading your bag…
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <ShoppingBag className="h-9 w-9 text-bone/25" strokeWidth={1} aria-hidden />
            <p className="font-serif text-lg text-bone/80">Your bag is empty.</p>
            <p className="max-w-[26ch] font-sans text-sm text-muted-foreground">
              Collection IV is small-batch. When it goes, it is archived.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="link-underline font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-bone/[0.07] overflow-y-auto px-6">
            {items.map((item) => (
              <li key={item.variantId} className="flex gap-4 py-5">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt="" className="h-24 w-18 shrink-0 object-cover" />
                ) : (
                  <div className="h-24 w-18 shrink-0 bg-bone/[0.05]" />
                )}

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-serif text-sm leading-snug">{item.name}</p>
                    <span className="shrink-0 font-sans text-sm tabular-nums">
                      {formatDisplayMoney(item.unitPriceMinor * item.quantity, display, item.currency)}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {[item.size, item.color].filter(Boolean).join(" · ") || item.sku}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-bone/15">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="p-2 text-bone/70 transition-colors hover:text-gold"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-sans text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="p-2 text-bone/70 transition-colors hover:text-gold"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      aria-label={`Remove ${item.name} from bag`}
                      className="p-2 text-bone/40 transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <footer className="border-t border-bone/10 px-6 py-5">
          <div className="mb-5 flex items-baseline justify-between">
            <span className="font-sans text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Subtotal
            </span>
            <span className="font-serif text-2xl tabular-nums">
              {hydrated && items.length > 0
                ? formatDisplayMoney(subtotalMinor, display, sourceCurrency)
                : "—"}
            </span>
          </div>

          <button
            type="button"
            onClick={goToCheckout}
            disabled={!hydrated || items.length === 0}
            className="w-full bg-gold px-5 py-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-noir transition-colors hover:bg-gold-soft disabled:opacity-40"
          >
            Proceed to checkout
          </button>

          <p className="mt-3 text-center font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
            Complimentary alterations on all ready-to-wear. Duties calculated at checkout.
          </p>
        </footer>
      </aside>
    </div>
  );
}