"use server";

import { getCheckoutLines } from "@/lib/catalog/catalog-repository";
import { getCourseTierQuote } from "@/lib/academy/academy-repository";
import { initializeTransaction } from "@/lib/payments/paystack";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateReference } from "@/lib/utils";

export type CheckoutActionResult =
  | { status: "redirect"; authorizationUrl: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

const MAX_LINES = 50;
const MAX_QUANTITY = 20;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function text(formData: FormData, key: string, maxLength = 200): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

type RequestedLine = { variantId: string; quantity: number };

function parseRequestedCart(raw: string): RequestedLine[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > MAX_LINES) {
    return null;
  }

  const lines: RequestedLine[] = [];

  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) return null;

    const { variantId, quantity } = entry as { variantId?: unknown; quantity?: unknown };

    if (typeof variantId !== "string" || !/^[0-9a-f-]{36}$/i.test(variantId)) {
      return null;
    }
    if (typeof quantity !== "number" || !Number.isInteger(quantity)) {
      return null;
    }
    if (quantity < 1 || quantity > MAX_QUANTITY) {
      return null;
    }

    lines.push({ variantId, quantity });
  }

  return lines;
}

/**
 * Creates a pending order from the cart and hands the shopper off to Paystack.
 *
 * The browser only ever sends `{ variantId, quantity }`. Prices, names, skus,
 * stock and totals are all re-read from the database here, so a tampered cart
 * cannot change what is charged.
 */
export async function startCheckout(
  _prevState: CheckoutActionResult | null,
  formData: FormData
): Promise<CheckoutActionResult> {
  const fieldErrors: Record<string, string> = {};

  const email = text(formData, "email", 254);
  const fullName = text(formData, "fullName", 120);
  const phone = text(formData, "phone", 40);
  const addressLine1 = text(formData, "addressLine1", 200);
  const addressLine2 = text(formData, "addressLine2", 200);
  const city = text(formData, "city", 100);
  const state = text(formData, "state", 100);
  const country = text(formData, "country", 100);
  const postalCode = text(formData, "postalCode", 20);

  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (fullName.length < 2) fieldErrors.fullName = "Enter your full name.";
  if (addressLine1.length < 3) fieldErrors.addressLine1 = "Enter your street address.";
  if (city.length < 2) fieldErrors.city = "Enter your city.";
  if (country.length < 2) fieldErrors.country = "Enter your country.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please correct the highlighted fields.", fieldErrors };
  }

  const requested = parseRequestedCart(text(formData, "cart", 20_000));
  if (!requested) {
    return { status: "error", message: "Your bag is empty or could not be read. Refresh and try again." };
  }

  const quote = await getCheckoutLines(requested);
  if (!quote.ok) {
    return { status: "error", message: quote.message };
  }

  const { lines } = quote;
  const currency = lines[0].currency;
  const subtotalMinor = lines.reduce((sum, line) => {
    const quantity = requested.find((r) => r.variantId === line.variantId)?.quantity ?? 1;
    return sum + line.unitPriceMinor * quantity;
  }, 0);

  if (subtotalMinor <= 0) {
    return { status: "error", message: "Your bag total is zero. Please review your bag." };
  }

  const db = supabaseAdmin();
  const reference = generateReference("ord");

  const { data: order, error: orderError } = await db
    .from("orders")
    .insert({
      reference,
      // We hand our own reference to Paystack, so the charge reference that comes
      // back on the webhook is this same value. Writing it up front removes any
      // window where a webhook could arrive before the order is resolvable.
      paystack_reference: reference,
      type: "CART",
      status: "PENDING",
      currency,
      subtotal_minor: subtotalMinor,
      discount_minor: 0,
      shipping_minor: 0,
      total_minor: subtotalMinor,
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone || null,
      shipping_address: {
        line1: addressLine1,
        line2: addressLine2 || null,
        city,
        state: state || null,
        country,
        postal_code: postalCode || null
      },
      metadata: { source: "storefront" }
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("checkout: failed to create order", orderError);
    return { status: "error", message: "We could not start your order. Please try again." };
  }

  const orderItems = lines.map((line) => {
    const quantity = requested.find((r) => r.variantId === line.variantId)?.quantity ?? 1;
    return {
      order_id: order.id as string,
      product_id: line.productId,
      variant_id: line.variantId,
      product_name: line.productName,
      sku: line.sku,
      size: line.size,
      color: line.color,
      unit_price_minor: line.unitPriceMinor,
      quantity,
      line_total_minor: line.unitPriceMinor * quantity
    };
  });

  const { error: itemsError } = await db.from("order_items").insert(orderItems);

  if (itemsError) {
    console.error("checkout: failed to persist order items", { orderId: order.id, itemsError });
    await db.from("orders").update({ status: "FAILED" }).eq("id", order.id);
    return { status: "error", message: "We could not save your order items. Please try again." };
  }

  let authorizationUrl: string;
  try {
    const initialized = await initializeTransaction({
      email,
      amountMinor: subtotalMinor,
      reference,
      currency,
      callbackUrl: `${siteUrl()}/checkout/success?reference=${reference}`,
      metadata: { orderId: order.id as string, type: "CART", reference }
    });
    authorizationUrl = initialized.authorizationUrl;
  } catch (error) {
    console.error("checkout: paystack initialize failed", { orderId: order.id, error });
    await db.from("orders").update({ status: "FAILED" }).eq("id", order.id);
    return {
      status: "error",
      message: "We could not reach the payment provider. Please try again in a moment."
    };
  }

  return { status: "redirect", authorizationUrl };
}

/**
 * Starts enrolment checkout for a single course tier.
 *
 * Only `{ courseSlug, tierId, email }` come from the browser; the tier price is read
 * back from `course_tiers` before the order is written, so a tampered tier id or
 * stale form value cannot change what is charged. Fulfillment reads `courseId` and
 * `tierId` out of `orders.metadata` to provision the enrollment.
 */
export async function startCourseCheckout(
  _prevState: CheckoutActionResult | null,
  formData: FormData
): Promise<CheckoutActionResult> {
  const fieldErrors: Record<string, string> = {};

  const email = text(formData, "email", 254);
  const fullName = text(formData, "fullName", 120);
  const courseSlug = text(formData, "courseSlug", 160);
  const tierId = text(formData, "tierId", 64);

  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (fullName.length < 2) fieldErrors.fullName = "Enter your full name.";

  if (!/^[0-9a-f-]{36}$/i.test(tierId)) {
    fieldErrors.tier = "Choose a valid tier.";
  }
  if (!/^[a-z0-9-]+$/i.test(courseSlug)) {
    fieldErrors.course = "Choose a valid course.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please correct the highlighted fields.", fieldErrors };
  }

  const quote = await getCourseTierQuote(courseSlug, tierId);
  if (!quote.ok) {
    return { status: "error", message: quote.message };
  }

  const { course, tier } = quote;
  const totalMinor = tier.priceMinor;
  const reference = generateReference("crs");
  const db = supabaseAdmin();

  const { data: order, error: orderError } = await db
    .from("orders")
    .insert({
      reference,
      paystack_reference: reference,
      type: "COURSE",
      status: "PENDING",
      currency: course.currency,
      subtotal_minor: totalMinor,
      discount_minor: 0,
      shipping_minor: 0,
      total_minor: totalMinor,
      customer_name: fullName,
      customer_email: email,
      // Fulfillment resolves the enrollment from these keys, in camel or snake case.
      metadata: {
        source: "academy",
        courseId: course.id,
        tierId: tier.id,
        courseSlug: course.slug,
        courseTitle: course.title
      }
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("academy.checkout: failed to create order", orderError);
    return { status: "error", message: "We could not start your enrolment. Please try again." };
  }

  let authorizationUrl: string;
  try {
    const initialized = await initializeTransaction({
      email,
      amountMinor: totalMinor,
      reference,
      currency: course.currency,
      callbackUrl: `${siteUrl()}/checkout/success?reference=${reference}`,
      metadata: { orderId: order.id as string, type: "COURSE", reference }
    });
    authorizationUrl = initialized.authorizationUrl;
  } catch (error) {
    console.error("academy.checkout: paystack initialize failed", { orderId: order.id, error });
    await db.from("orders").update({ status: "FAILED" }).eq("id", order.id);
    return {
      status: "error",
      message: "We could not reach the payment provider. Please try again in a moment."
    };
  }

  return { status: "redirect", authorizationUrl };
}
