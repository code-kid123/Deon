"use client";

import { useActionState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { startCheckout, type CheckoutActionResult } from "@/app/checkout/actions";
import { buttonClassName } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/cart-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { useUiStore, formatDisplayMoney } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import type { CartViewItem } from "@/lib/types/cart";

const initialState: CheckoutActionResult | null = null;

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  required,
  error,
  defaultValue,
  span,
  optional
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  span?: boolean;
  optional?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-2", span && "sm:col-span-2")}>
      <Label htmlFor={id}>
        {label}
        {optional ? <span className="ml-1 normal-case text-bone/30">optional</span> : null}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className="font-sans text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckoutClient() {
  const items = useCartStore((state) => state.items);
  const hydrated = useHasHydrated();
  const display = useUiStore((state) => state.currency);

  const [state, formAction, pending] = useActionState(startCheckout, initialState);

  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "1";

  const lines: CartViewItem[] = useMemo(
    () => items.map((item) => ({ ...item, lineTotalMinor: item.unitPriceMinor * item.quantity })),
    [items]
  );

  const subtotalMinor = useMemo(
    () => lines.reduce((sum, line) => sum + line.lineTotalMinor, 0),
    [lines]
  );

  const currency = lines[0]?.currency ?? "NGN";

  useEffect(() => {
    if (state?.status === "redirect") {
      window.location.href = state.authorizationUrl;
    }
  }, [state]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-24 font-sans text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
        Loading your bag…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="border border-dashed border-bone/15 px-8 py-24 text-center">
        <p className="eyebrow">Nothing here yet</p>
        <h2 className="mt-3 font-serif text-3xl">Your bag is empty</h2>
        <p className="mx-auto mt-3 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
          Add a piece from the collection to start an order. Every run is small, so once a size is gone
          it is archived.
        </p>
        <Link href="/shop" className={cn(buttonClassName({ size: "lg" }), "mt-8")}>
          Browse the collection
        </Link>
      </div>
    );
  }

  const serverError = state?.status === "error" ? state : null;
  const fieldErrors = serverError?.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16">
      <input
        type="hidden"
        name="cart"
        value={JSON.stringify(
          lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity }))
        )}
      />

      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-6">
          <div className="flex items-baseline gap-4 border-b border-bone/10 pb-4">
            <span className="font-serif text-lg text-gold tabular-nums">01</span>
            <h2 className="font-serif text-2xl">Contact</h2>
          </div>
          <Field
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            error={fieldErrors.email}
            span
          />
          <p className="-mt-2 font-sans text-xs text-muted-foreground">
            Your order confirmation and any Telegram invite are sent here.
          </p>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-baseline gap-4 border-b border-bone/10 pb-4">
            <span className="font-serif text-lg text-gold tabular-nums">02</span>
            <h2 className="font-serif text-2xl">Delivery</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="fullName"
              name="fullName"
              label="Full name"
              autoComplete="name"
              required
              error={fieldErrors.fullName}
            />
            <Field id="phone" name="phone" label="Phone" type="tel" autoComplete="tel" optional />
            <Field
              id="addressLine1"
              name="addressLine1"
              label="Address"
              autoComplete="address-line1"
              required
              error={fieldErrors.addressLine1}
              span
            />
            <Field
              id="addressLine2"
              name="addressLine2"
              label="Apartment, suite"
              autoComplete="address-line2"
              optional
              span
            />
            <Field
              id="city"
              name="city"
              label="City"
              autoComplete="address-level2"
              required
              error={fieldErrors.city}
            />
            <Field id="state" name="state" label="State / region" autoComplete="address-level1" optional />
            <Field
              id="country"
              name="country"
              label="Country"
              autoComplete="country-name"
              required
              defaultValue="Nigeria"
              error={fieldErrors.country}
            />
            <Field id="postalCode" name="postalCode" label="Postal code" autoComplete="postal-code" optional />
          </div>
        </section>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
        <div className="border border-bone/12 bg-card p-7">
          <h2 className="font-serif text-2xl">Order summary</h2>

          <ul className="mt-6 flex flex-col gap-5">
            {lines.map((line) => (
              <li key={line.variantId} className="flex gap-4">
                <div className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden bg-bone/[0.04]">
                  {line.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={line.imageUrl} alt={line.name} className="h-full w-full object-cover" />
                  ) : null}
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 font-sans text-[0.5625rem] font-bold tabular-nums text-noir">
                    {line.quantity}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                  <div className="flex flex-col gap-1">
                    <p className="font-serif text-base leading-tight text-bone">{line.name}</p>
                    <p className="font-sans text-xs text-muted-foreground">
                      {[line.size, line.color].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <p className="font-sans text-sm tabular-nums text-bone/85">
                    {formatDisplayMoney(line.lineTotalMinor, display, line.currency)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex items-baseline justify-between border-t border-bone/10 pt-5">
            <span className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
              Subtotal
            </span>
            <span className="font-serif text-2xl tabular-nums text-bone">
              {formatDisplayMoney(subtotalMinor, display, currency)}
            </span>
          </div>

          <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground">
            Delivery is confirmed by our studio after payment. Free alterations on every ready-to-wear
            piece, for life.
          </p>

          {cancelled ? (
            <p className="mt-5 border-l-2 border-gold/50 pl-3 font-sans text-sm text-gold">
              Your previous payment was cancelled. You can retry below.
            </p>
          ) : null}

          {serverError ? (
            <p
              role="alert"
              className="mt-5 flex gap-2 border border-destructive/40 bg-destructive/10 p-3 font-sans text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {serverError.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className={cn(buttonClassName({ size: "lg" }), "mt-6 w-full justify-center gap-2.5")}
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Redirecting…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" aria-hidden />
                Pay {formatDisplayMoney(subtotalMinor, display, currency)}
              </>
            )}
          </button>

          <p className="mt-4 text-center font-sans text-xs leading-relaxed text-muted-foreground">
            You will be redirected to Paystack to complete payment securely.
          </p>
        </div>
      </aside>
    </form>
  );
}