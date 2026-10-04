"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCartStore, selectItemCount } from "@/store/cart-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function CartButton() {
  const hydrated = useHasHydrated();
  const [open, setOpen] = useState(false);
  const count = useCartStore(selectItemCount);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open shopping bag${hydrated && count > 0 ? `, ${count} items` : ""}`}
        className="relative flex h-10 w-10 items-center justify-center text-bone/80 transition-colors hover:text-gold"
      >
        <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.35} />
        {hydrated && count > 0 ? (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 font-sans text-[0.5625rem] font-bold tabular-nums text-noir">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}