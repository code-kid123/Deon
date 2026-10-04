import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, GraduationCap, PackageCheck, Send, Truck } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { buttonClassName } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/money";
import { ClearCartOnSuccess } from "@/components/store/clear-cart-on-success";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false, follow: false }
};

type OrderRow = {
  id: string;
  reference: string;
  status: string;
  type: string;
  currency: string;
  total_minor: number;
  customer_email: string | null;
  metadata: Record<string, unknown> | null;
};

type OrderItemRow = {
  id: string;
  product_name: string;
  sku: string;
  size: string | null;
  color: string | null;
  quantity: number;
  line_total_minor: number;
};

type EnrollmentRow = {
  id: string;
  status: string;
  telegram_invite_url: string | null;
  telegram_invite_expires_at: string | null;
};

const STATUS_COPY: Record<string, { label: string; description: string }> = {
  PENDING: {
    label: "Confirming payment",
    description:
      "We are waiting for Paystack to confirm your payment. This usually takes a few seconds — you can safely close this page and we will email you when it clears."
  },
  PAID: {
    label: "Payment confirmed",
    description: "Your payment cleared. We are preparing your order now."
  },
  FULFILLED: {
    label: "Order fulfilled",
    description: "Everything is packed and on its way."
  },
  PARTIALLY_FULFILLED: {
    label: "Partially fulfilled",
    description:
      "Some pieces are on the way. Our team will contact you about any items still being prepared."
  },
  FAILED: {
    label: "Payment not completed",
    description: "We could not confirm this payment. You have not been charged."
  },
  CANCELLED: {
    label: "Order cancelled",
    description: "This order was cancelled and nothing was charged."
  }
};

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  if (!reference) {
    return (
      <Shell eyebrow="Checkout" title="Missing order reference">
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          We could not tell which order this was. If you were charged, contact us with your receipt.
        </p>
      </Shell>
    );
  }

  const db = supabaseAdmin();

  const { data, error } = await db
    .from("orders")
    .select(
      "id, reference, status, type, currency, total_minor, customer_email, metadata, order_items(id, product_name, sku, size, color, quantity, line_total_minor)"
    )
    .eq("paystack_reference", reference)
    .maybeSingle();

  if (error) {
    console.error("checkout.success: order lookup failed", { reference, error });
  }

  if (!data) {
    return (
      <Shell eyebrow="Checkout" title="Order not found">
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          We could not find an order matching <span className="font-mono text-bone">{reference}</span>.
          If your payment went through, your confirmation email will arrive shortly.
        </p>
      </Shell>
    );
  }

  const order = data as unknown as OrderRow & { order_items: OrderItemRow[] };
  const copy = STATUS_COPY[order.status] ?? {
    label: "Order received",
    description: "We are processing your order."
  };
  const settled = order.status !== "PENDING" && order.status !== "FAILED";
  const isCourse = order.type === "COURSE";

  let enrollment: EnrollmentRow | null = null;
  if (isCourse) {
    const { data: enrollmentData, error: enrollmentError } = await db
      .from("enrollments")
      .select("id, status, telegram_invite_url, telegram_invite_expires_at")
      .eq("source_order_id", order.id)
      .maybeSingle();

    if (enrollmentError) {
      console.error("checkout.success: enrollment lookup failed", {
        orderId: order.id,
        error: enrollmentError
      });
    } else {
      enrollment = (enrollmentData as unknown as EnrollmentRow | null) ?? null;
    }
  }

  const courseTitle =
    order.metadata && typeof order.metadata.courseTitle === "string"
      ? order.metadata.courseTitle
      : null;

  return (
    <Shell eyebrow={isCourse ? "Academy" : "Checkout"} title={isCourse ? (courseTitle ?? "Enrolment confirmed") : copy.label}>
      {isCourse ? null : <ClearCartOnSuccess reference={order.reference} />}

      <div className="flex flex-col gap-10">
        <div
          className={cn(
            "flex gap-3.5 border p-5",
            order.status === "FAILED"
              ? "border-destructive/40 bg-destructive/[0.08]"
              : "border-bone/12 bg-card"
          )}
        >
          {order.status === "PENDING" ? (
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
          ) : order.status === "FULFILLED" || order.status === "PARTIALLY_FULFILLED" ? (
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
          ) : (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
          )}
          <p className="font-sans text-sm leading-relaxed text-bone/85">{copy.description}</p>
        </div>

        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <dt className="eyebrow">Reference</dt>
            <dd className="font-mono text-sm text-bone">{order.reference}</dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="eyebrow">Status</dt>
            <dd>
              <Badge variant={settled ? "success" : "secondary"}>{order.status}</Badge>
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="eyebrow">Confirmation sent to</dt>
            <dd className="break-all font-sans text-sm text-bone/85">{order.customer_email ?? "your email"}</dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="eyebrow">{isCourse ? "Amount paid" : "Total paid"}</dt>
            <dd className="font-serif text-xl tabular-nums text-bone">
              {formatMoney(order.total_minor, order.currency)}
            </dd>
          </div>
        </dl>

        {isCourse ? (
          <section className="flex flex-col gap-6 border-t border-bone/10 pt-8">
            <h2 className="flex items-center gap-3 font-serif text-2xl">
              <GraduationCap className="h-5 w-5 text-gold" aria-hidden />
              Your enrolment
            </h2>

            {!enrollment ? (
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                {order.status === "PENDING"
                  ? "Your enrolment is created as soon as Paystack confirms the payment. Refresh this page in a few seconds."
                  : "We could not find an enrolment for this order. Contact us with your reference and we will set it up manually."}
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="eyebrow">Access status</span>
                  <span className="font-sans text-sm text-bone/85">
                    {enrollment.status === "ACTIVE"
                      ? "Active — your community invite is ready"
                      : "Pending — your invite link is being generated"}
                  </span>
                </div>

                {enrollment.telegram_invite_url ? (
                  <div className="flex flex-col gap-4 border border-gold/25 bg-gold/[0.04] p-7">
                    <h3 className="font-serif text-xl">Your private community invite</h3>
                    <p className="font-sans text-sm leading-relaxed text-bone/80">
                      This single-use link lets you join the DEON community. It expires in 24 hours and
                      admits one person, so please do not share it.
                    </p>
                    <a
                      href={enrollment.telegram_invite_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonClassName({ size: "lg" }), "w-fit")}
                    >
                      <Send className="h-4 w-4" aria-hidden />
                      Join on Telegram
                    </a>
                    {enrollment.telegram_invite_expires_at ? (
                      <p className="font-sans text-xs text-muted-foreground">
                        Expires{" "}
                        {new Date(enrollment.telegram_invite_expires_at).toLocaleString("en-NG", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                    Your invite link is being generated and will be emailed to{" "}
                    {order.customer_email ?? "you"} within a few minutes. If it does not arrive, reply to
                    your receipt with your reference.
                  </p>
                )}
              </>
            )}
          </section>
        ) : (
          <section className="flex flex-col gap-5 border-t border-bone/10 pt-8">
            <h2 className="flex items-center gap-3 font-serif text-2xl">
              <PackageCheck className="h-5 w-5 text-gold" aria-hidden />
              Items
            </h2>
            {order.order_items.length === 0 ? (
              <p className="font-sans text-sm text-muted-foreground">No line items on this order.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {order.order_items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-bone/[0.06] pb-4 last:border-b-0"
                  >
                    <span className="flex flex-col gap-1">
                      <span className="font-serif text-base text-bone">{item.product_name}</span>
                      <span className="font-sans text-xs text-muted-foreground">
                        {[item.size, item.color].filter(Boolean).join(" · ")} · Qty {item.quantity}
                      </span>
                    </span>
                    <span className="font-sans text-sm tabular-nums text-bone/85">
                      {formatMoney(item.line_total_minor, order.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <div className="flex flex-wrap gap-3 border-t border-bone/10 pt-8">
          {isCourse ? (
            <>
              <Link href="/academy" className={buttonClassName({ size: "lg" })}>
                Go to the academy
              </Link>
              <Link href="/shop" className={buttonClassName({ size: "lg", variant: "outline" })}>
                Browse the collection
              </Link>
            </>
          ) : (
            <Link href="/shop" className={buttonClassName({ size: "lg", variant: "outline" })}>
              Continue shopping
            </Link>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mb-10 mt-3 font-serif text-4xl leading-[1.05] sm:text-5xl">{title}</h1>
      {children}
    </div>
  );
}