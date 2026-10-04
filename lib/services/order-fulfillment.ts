import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createCommunityInviteLink } from "@/lib/services/telegram";
import type { PaystackChargeData } from "@/lib/payments/paystack";

type OrderItemRow = {
  id: string;
  variant_id: string;
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
};

type OrderRow = {
  id: string;
  reference: string;
  user_id: string | null;
  type: string;
  status: string;
  customer_email: string | null;
  customer_name: string | null;
  metadata: Record<string, unknown> | null;
  order_items?: OrderItemRow[];
};

type FulfillmentResult = {
  outcome:
    | "ignored"
    | "duplicate"
    | "already-paid"
    | "fulfilled"
    | "partial"
    | "enrolled"
    | "pending-invite"
    | "activated"
    | "no-application"
    | "consultation-paid"
    | "no-booking"
    | "unknown-type"
    | "course-missing"
    | "missing-customer-email"
    | "user-create-failed"
    | "enrollment-error";
  error?: string;
};

function db(): SupabaseClient {
  return supabaseAdmin();
}

function readMetadata(order: OrderRow, key: string): unknown {
  const camel = order.metadata?.[key];
  if (camel !== undefined && camel !== null) return camel;
  const snake = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  return order.metadata?.[snake];
}

export async function findTransactionByReference(reference: string) {
  const { data } = await db()
    .from("payment_transactions")
    .select("id")
    .eq("reference", reference)
    .maybeSingle();
  return data;
}

export async function findOrderByPaystackReference(reference: string) {
  const { data } = await db()
    .from("orders")
    .select("*, order_items(*)")
    .eq("paystack_reference", reference)
    .maybeSingle();
  return data as OrderRow | null;
}

export async function findOrderById(orderId: string) {
  const { data } = await db()
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .maybeSingle();
  return data as OrderRow | null;
}

async function createOrderFromCharge(charge: PaystackChargeData): Promise<OrderRow> {
  const metadata = charge.metadata ?? {};
  const type = (metadata.type as string) ?? "CART";
  const courseId = (metadata.courseId ?? metadata.course_id) as string | undefined;

  const reference =
    (metadata.reference as string) ??
    (metadata.platformReference as string) ??
    `legacy_${charge.reference}`;

  const { data, error } = await db()
    .from("orders")
    .insert({
      reference,
      paystack_reference: charge.reference,
      type,
      status: "PENDING",
      currency: charge.currency,
      total_minor: charge.amount,
      customer_email: charge.customer?.email ?? null,
      customer_name: [charge.customer?.first_name, charge.customer?.last_name]
        .filter(Boolean)
        .join(" ") || null,
      metadata: courseId ? { course_id: courseId, tier_id: metadata.tierId ?? metadata.tier_id ?? null } : null
    })
    .select("*, order_items(*)")
    .single();

  if (error || !data) {
    throw new Error(`Unable to persist order from charge: ${error?.message ?? "empty response"}`);
  }

  return data as OrderRow;
}

export async function handleChargeSuccess(charge: PaystackChargeData) {
  if (charge.status !== "success") {
    return { outcome: "ignored" as const };
  }

  const duplicate = await findTransactionByReference(charge.reference);
  if (duplicate) {
    return { outcome: "duplicate" as const };
  }

  let order = await findOrderByPaystackReference(charge.reference);

  if (!order) {
    const metadataOrderId = (charge.metadata?.orderId ?? charge.metadata?.order_id) as
      | string
      | undefined;
    if (metadataOrderId) {
      order = await findOrderById(metadataOrderId);
    }
  }

  if (!order) {
    order = await createOrderFromCharge(charge);
  }

  await db()
    .from("payment_transactions")
    .insert({
      reference: charge.reference,
      order_id: order.id,
      event_type: "charge.success",
      amount_minor: charge.amount,
      currency: charge.currency,
      channel: charge.channel,
      status: charge.status,
      raw: charge
    });

  if (order.status === "PAID" || order.status === "FULFILLED") {
    return { outcome: "already-paid" as const };
  }

  await db()
    .from("orders")
    .update({
      status: "PAID",
      payment_channel: charge.channel,
      paid_at: charge.paid_at,
      customer_email: order.customer_email ?? charge.customer?.email ?? null,
      customer_name:
        order.customer_name ??
        ([charge.customer?.first_name, charge.customer?.last_name].filter(Boolean).join(" ") || null)
    })
    .eq("id", order.id);

  return fulfillOrder(order, charge);
}

async function fulfillOrder(order: OrderRow, charge: PaystackChargeData): Promise<FulfillmentResult> {
  switch (order.type) {
    case "CART":
      return fulfillCartOrder(order);
    case "COURSE":
      return enrollStudent(order, charge);
    case "MENTORSHIP":
      return activateMentorship(order);
    case "CONSULTATION":
      return markConsultationPaid(order);
    default:
      return { outcome: "unknown-type" };
  }
}

async function fetchOrderItems(orderId: string): Promise<OrderItemRow[]> {
  const { data } = await db().from("order_items").select("*").eq("order_id", orderId);
  return (data ?? []) as OrderItemRow[];
}

async function fulfillCartOrder(order: OrderRow): Promise<FulfillmentResult> {
  const items = order.order_items?.length ? order.order_items : await fetchOrderItems(order.id);

  let backordered = false;

  for (const item of items) {
    const { data: variant } = await db()
      .from("product_variants")
      .select("stock")
      .eq("id", item.variant_id)
      .maybeSingle();

    if (!variant) {
      backordered = true;
      continue;
    }

    // Guard the decrement inside the UPDATE so concurrent webhooks cannot oversell:
    // the row is only written when enough stock still remains at commit time.
    const { data: decremented, error: decrementError } = await db()
      .from("product_variants")
      .update({ stock: (variant.stock as number) - item.quantity })
      .eq("id", item.variant_id)
      .gte("stock", item.quantity)
      .select("stock")
      .maybeSingle();

    if (decrementError || !decremented) {
      backordered = true;
    }
  }

  await db()
    .from("orders")
    .update({ status: backordered ? "PARTIALLY_FULFILLED" : "FULFILLED" })
    .eq("id", order.id);

  return { outcome: backordered ? "partial" : "fulfilled" };
}

async function enrollStudent(order: OrderRow, charge: PaystackChargeData): Promise<FulfillmentResult> {
  const courseId = readMetadata(order, "courseId") as string | undefined;
  if (!courseId) {
    return { outcome: "course-missing" };
  }
  const tierId = (readMetadata(order, "tierId") as string | undefined) ?? null;

  let userId = order.user_id;

  if (!userId) {
    const email = charge.customer?.email ?? order.customer_email;
    if (!email) {
      return { outcome: "missing-customer-email" };
    }

    const { data: existing } = await db()
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      userId = existing.id as string;
    } else {
      const { data: created, error: createError } = await db()
        .from("users")
        .insert({
          email,
          name: order.customer_name ?? charge.customer?.first_name ?? null,
          phone: charge.customer?.phone ?? null
        })
        .select("id")
        .single();

      if (createError || !created) {
        return { outcome: "user-create-failed", error: createError?.message };
      }
      userId = created.id as string;
    }

    await db().from("orders").update({ user_id: userId }).eq("id", order.id);
  }

  let invite:
    | { inviteUrl: string; expiresAt: string; memberLimit: number }
    | undefined;

  try {
    invite = await createCommunityInviteLink();
  } catch (error) {
    console.error("telegram invite generation failed; enrollment queued PENDING", {
      orderId: order.id,
      error
    });
  }

  const { error: enrollmentError } = await db()
    .from("enrollments")
    .upsert(
      {
        user_id: userId,
        course_id: courseId,
        course_tier_id: tierId,
        source_order_id: order.id,
        status: invite ? "ACTIVE" : "PENDING",
        telegram_invite_url: invite?.inviteUrl ?? null,
        telegram_invite_expires_at: invite?.expiresAt ?? null
      },
      { onConflict: "user_id,course_id", ignoreDuplicates: true }
    );

  if (enrollmentError) {
    return { outcome: "enrollment-error", error: enrollmentError.message };
  }

  return { outcome: invite ? "enrolled" : "pending-invite" };
}

async function activateMentorship(order: OrderRow): Promise<FulfillmentResult> {
  const applicationId = readMetadata(order, "appId") as string | undefined;

  if (!applicationId) {
    return { outcome: "no-application" };
  }

  await db()
    .from("mentorship_applications")
    .update({ status: "PAID" })
    .eq("id", applicationId);

  return { outcome: "activated" };
}

async function markConsultationPaid(order: OrderRow): Promise<FulfillmentResult> {
  const bookingId = readMetadata(order, "bookingId") as string | undefined;

  if (!bookingId) {
    return { outcome: "no-booking" };
  }

  await db()
    .from("consultation_bookings")
    .update({ payment_reference: order.reference })
    .eq("id", bookingId);

  return { outcome: "consultation-paid" };
}