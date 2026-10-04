import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutClient } from "@/components/store/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false }
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <header className="mb-12 flex flex-col gap-3">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="font-serif text-4xl sm:text-5xl">Your order</h1>
        <p className="max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
          Enter your delivery details to continue to secure payment. Every ready-to-wear order includes
          complimentary alterations for life.
        </p>
      </header>

      <Suspense fallback={<div className="h-96 animate-pulse bg-bone/[0.04]" />}>
        <CheckoutClient />
      </Suspense>
    </div>
  );
}