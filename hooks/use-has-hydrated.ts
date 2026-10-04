"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";

/**
 * True only after client-side hydration has completed.
 *
 * Zustand's persisted stores rehydrate from localStorage, which happens before the
 * first client paint. Any component whose output depends on a persisted value
 * (cart contents, display currency) must render the server default until this
 * returns true, or React will report a hydration mismatch.
 */
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useCartStore.persist.hasHydrated() && useUiStore.persist.hasHydrated());

    const unsubCart = useCartStore.persist.onFinishHydration(() => setHydrated(true));
    const unsubUi = useUiStore.persist.onFinishHydration(() => setHydrated(true));

    return () => {
      unsubCart();
      unsubUi();
    };
  }, []);

  return hydrated;
}