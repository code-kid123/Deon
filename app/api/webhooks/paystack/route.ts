import { NextResponse } from "next/server";
import {
  paystackSecret,
  verifyWebhookSignature,
  type PaystackChargeData
} from "@/lib/payments/paystack";
import { handleChargeSuccess } from "@/lib/services/order-fulfillment";

export const runtime = "nodejs";

type PaystackEvent = {
  event: string;
  data?: Record<string, any>;
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (process.env.PAYSTACK_WEBHOOK_HANDLER !== "disabled") {
    const valid = verifyWebhookSignature(rawBody, signature, paystackSecret());
    if (!valid) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data) {
    try {
      await handleChargeSuccess(event.data as unknown as PaystackChargeData);
    } catch (error) {
      console.error("charge.success fulfillment failed", {
        reference: event.data.reference,
        error
      });
      return NextResponse.json({ error: "fulfillment failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}