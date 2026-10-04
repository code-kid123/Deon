"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

/**
 * The bag only lives in the browser, so it is emptied once the shopper lands back
 * on the success page. Guarded on the reference so a re-render (or a refresh after
 * the order has already been confirmed) cannot clear a fresh bag.
 */
export function ClearCartOnSuccess({ reference }: { reference: string | null }) {
  const clear = useCartStore((state) => state.clear);

  useEffect(() => {
    if (!reference) return;
    const key = `deon-cart-cleared:${reference}`;
    if (window.sessionStorage.getItem(key)) return;
    clear();
    window.sessionStorage.setItem(key, "1");
  }, [clear, reference]);

  return null;
}
