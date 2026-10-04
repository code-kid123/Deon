"use client";

import { useActionState, useEffect } from "react";
import { AlertCircle, Check, Loader2, Lock } from "lucide-react";
import { startCourseCheckout, type CheckoutActionResult } from "@/app/checkout/actions";
import { buttonClassName } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUiStore, formatDisplayMoney } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const initialState: CheckoutActionResult | null = null;

export function CourseCheckoutForm({
  courseSlug,
  courseTitle,
  tierId,
  tierName,
  priceMinor,
  currency,
  tierFeatures
}: {
  courseSlug: string;
  courseTitle: string;
  tierId: string;
  tierName: string;
  priceMinor: number;
  currency: string;
  tierFeatures: string[];
}) {
  const [state, formAction, pending] = useActionState(startCourseCheckout, initialState);
  const display = useUiStore((s) => s.currency);

  useEffect(() => {
    if (state?.status === "redirect") {
      window.location.href = state.authorizationUrl;
    }
  }, [state]);

  const serverError = state?.status === "error" ? state : null;
  const fieldErrors = serverError?.fieldErrors ?? {};
  const priceLabel = priceMinor === 0 ? "Free" : formatDisplayMoney(priceMinor, display, currency);

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <input type="hidden" name="courseSlug" value={courseSlug} />
      <input type="hidden" name="tierId" value={tierId} />

      <section className="flex flex-col gap-5">
        <div className="flex items-baseline gap-4 border-b border-bone/10 pb-4">
          <span className="font-serif text-lg tabular-nums text-gold">01</span>
          <h2 className="font-serif text-2xl">Your details</h2>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.fullName)}
          />
          {fieldErrors.fullName ? (
            <p className="font-sans text-xs text-destructive">{fieldErrors.fullName}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? (
            <p className="font-sans text-xs text-destructive">{fieldErrors.email}</p>
          ) : null}
        </div>

        <p className="font-sans text-xs leading-relaxed text-muted-foreground">
          Your receipt, the community invite link and course access are tied to this address.
        </p>
      </section>

      <section className="border border-bone/12 bg-card p-7">
        <h2 className="font-serif text-2xl">Order summary</h2>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-serif text-lg leading-tight text-bone">{courseTitle}</p>
            <p className="font-sans text-xs uppercase tracking-[0.16em] text-gold">{tierName} tier</p>
          </div>
          <p className="font-serif text-xl tabular-nums text-bone">{priceLabel}</p>
        </div>

        {tierFeatures.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-2.5 border-t border-bone/10 pt-5">
            {tierFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-bone/75"
              >
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex items-baseline justify-between border-t border-bone/10 pt-5">
          <span className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
            Total
          </span>
          <span className="font-serif text-2xl tabular-nums text-bone">{priceLabel}</span>
        </div>

        {display === "USD" && priceMinor > 0 ? (
          <p className="mt-2 text-right font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
            Indicative · charged in NGN at checkout
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
              {priceMinor === 0 ? "Enrol" : `Pay ${priceLabel}`}
            </>
          )}
        </button>

        <p className="mt-4 text-center font-sans text-xs leading-relaxed text-muted-foreground">
          You will be redirected to Paystack to complete payment securely. Access is granted
          immediately after payment clears.
        </p>
      </section>
    </form>
  );
}