import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment not completed",
  robots: { index: false, follow: false }
};

export default function CheckoutErrorPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 lg:py-28">
      <div className="mb-8 flex items-center gap-4">
        <XCircle className="h-7 w-7 shrink-0 text-destructive" aria-hidden />
        <h1 className="font-serif text-4xl leading-[1.05] sm:text-5xl">Payment not completed</h1>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-sans text-sm leading-relaxed text-bone/80">
          Your payment could not be completed, so nothing has been charged. Your bag has been kept
          exactly as it was.
        </p>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          If you were charged but see this page, check your bank statement and contact us with the
          reference from your receipt — we will confirm or reverse it for you.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/checkout?cancelled=1" className={buttonClassName({ size: "lg" })}>
          Return to checkout
        </Link>
        <Link href="/shop" className={buttonClassName({ size: "lg", variant: "outline" })}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}