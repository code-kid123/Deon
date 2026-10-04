"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

/**
 * Newsletter sign-up with inline feedback states.
 *
 * No backend exists yet, so submission is simulated and clearly marked in code:
 * wire this to a list provider (or a `newsletter_subscribers` table) when ready.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    // Simulated round-trip; replace with the real subscribe call.
    window.setTimeout(() => setStatus("done"), 850);
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="flex items-center gap-3 border border-gold/30 bg-gold/[0.06] px-4 py-3.5"
      >
        <Check className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden />
        <p className="font-sans text-sm text-bone">
          You are on the list. Look out for the private-sale notice.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Email address"
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "newsletter-error" : undefined}
          className="h-12 flex-1 border border-bone/20 bg-transparent px-4 font-sans text-sm text-bone outline-none transition-colors placeholder:text-bone/35 focus:border-gold"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-gold px-7 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-noir transition-colors hover:bg-gold-soft disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </>
          )}
        </button>
      </div>

      {status === "error" ? (
        <p id="newsletter-error" role="alert" className="font-sans text-xs text-destructive">
          Please enter a valid email address.
        </p>
      ) : (
        <p className="font-sans text-xs text-bone/45">
          Private-sale access and academy announcements. No noise.
        </p>
      )}
    </form>
  );
}