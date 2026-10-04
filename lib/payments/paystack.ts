import { createHmac, timingSafeEqual } from "crypto";

export const PAYSTACK_API_URL = "https://api.paystack.co";

export type PaystackChargeData = {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  amount_settled?: number;
  paid_at: string | null;
  channel: string | null;
  currency: string;
  customer: {
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
  } | null;
  metadata: Record<string, unknown> | null;
};

export type PaystackInitializeParams = {
  email: string;
  amountMinor: number;
  reference: string;
  currency?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
};

export type PaystackInitializeResult = {
  reference: string;
  authorizationUrl: string;
  accessCode: string;
};

export type PaystackVerificationResult = {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  channel: string | null;
  paid_at: string | null;
  customer: {
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
  } | null;
  metadata: Record<string, unknown> | null;
};

export function paystackSecret(): string {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }
  return secret;
}

export async function initializeTransaction(
  params: PaystackInitializeParams
): Promise<PaystackInitializeResult> {
  const response = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackSecret()}`,
      "Content-Type": "application/json"
    },
    cache: "no-store",
    body: JSON.stringify({
      email: params.email,
      amount: params.amountMinor,
      reference: params.reference,
      currency: params.currency ?? "NGN",
      callback_url: params.callbackUrl,
      metadata: params.metadata
    })
  });

  const payload = await response.json();

  if (!response.ok || payload.status === false) {
    throw new Error(`Paystack initialize failed: ${payload.message ?? response.statusText}`);
  }

  return {
    reference: payload.data.reference,
    authorizationUrl: payload.data.authorization_url,
    accessCode: payload.data.access_code
  };
}

export async function verifyTransaction(reference: string): Promise<PaystackVerificationResult> {
  const response = await fetch(
    `${PAYSTACK_API_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${paystackSecret()}` },
      cache: "no-store"
    }
  );

  const payload = await response.json();

  if (!response.ok || payload.status === false) {
    throw new Error(`Paystack verify failed: ${payload.message ?? response.statusText}`);
  }

  return payload.data as PaystackVerificationResult;
}

function safeEqualHex(expected: string, candidate: string): boolean {
  if (expected.length !== candidate.length) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(candidate, "hex"));
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;

  const direct = createHmac("sha512", secret).update(rawBody).digest("hex");
  if (safeEqualHex(direct, signature)) return true;

  let normalized = "";
  try {
    normalized = JSON.stringify(JSON.parse(rawBody));
  } catch {
    return false;
  }

  const serialized = createHmac("sha512", secret).update(normalized).digest("hex");
  return safeEqualHex(serialized, signature);
}