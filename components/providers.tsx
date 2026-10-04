"use client";

import type { ReactNode } from "react";

/**
 * Client boundary for the app shell.
 *
 * Currency-aware components gate their output behind `useHasHydrated()` so the
 * server-rendered NGN markup matches the first client render; this provider is
 * intentionally a pass-through so it never interferes with the body flex layout.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}