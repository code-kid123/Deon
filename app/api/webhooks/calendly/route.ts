import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-calendly-webhook-signature");
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

  if (process.env.CALENDLY_WEBHOOK_HANDLER !== "disabled" && signingKey) {
    const computed = createHmac("sha256", signingKey).update(rawBody).digest("hex");
    const valid =
      !!signature &&
      computed.length === signature.length &&
      timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(signature, "hex"));
    if (!valid) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  let body: {
    event?: string;
    payload?: {
      event?: {
        uuid?: string;
        name?: string;
        start_time?: string;
        location?: Record<string, unknown>;
      };
      invitee?: {
        name?: string;
        email?: string;
      };
      questions_and_answers?: { question: string; answer: string }[];
    };
  };

  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const eventName = body.event;
  const event = body.payload?.event;

  if (!event?.uuid) {
    return NextResponse.json({ received: true });
  }

  try {
    await supabaseAdmin()
      .from("consultation_bookings")
      .upsert(
        {
          calendly_event_uuid: event.uuid,
          name: body.payload?.invitee?.name ?? null,
          email: body.payload?.invitee?.email ?? null,
          calendar_event_type: event.name ?? null,
          calendly_scheduled_at: event.start_time ?? null,
          status: eventName === "invitee.canceled" ? "CANCELLED" : "CONFIRMED",
          raw_payload: body.payload ?? null
        },
        { onConflict: "calendly_event_uuid" }
      );
  } catch (error) {
    console.error("calendly booking capture failed", { event, error });
    return NextResponse.json({ error: "capture failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}