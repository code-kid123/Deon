"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import { Button, buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BookingEvent = {
  event: "calendly.event_scheduled" | "calendly.event_canceled";
  payload?: {
    event?: { uri?: string; start_time?: string; name?: string };
    invitee?: { name?: string; email?: string };
  };
};

type Phase = "idle" | "loading" | "confirmed" | "canceled";

const CALENDLY_ORIGIN = "https://calendly.com";

export function CalendlyEmbed({
  url,
  bookingType
}: {
  url: string | null;
  bookingType: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  const openWidget = useCallback(() => {
    setPhase("loading");
    iframeRef.current?.focus();
    iframeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== CALENDLY_ORIGIN && !event.origin.endsWith("calendly.com")) return;

      const data = event.data as BookingEvent | undefined;
      if (!data || typeof data !== "object" || !("event" in data)) return;

      if (data.event === "calendly.event_scheduled") {
        setPhase("confirmed");
      } else if (data.event === "calendly.event_canceled") {
        setPhase("canceled");
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!url) {
    return (
      <div className="border border-dashed border-gold/30 bg-gold/[0.03] p-12 text-center">
        <CalendarCheck className="mx-auto h-8 w-8 text-gold" strokeWidth={1.25} aria-hidden />
        <h3 className="mt-5 font-serif text-2xl">Booking opens shortly</h3>
        <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
          Add <code className="font-mono text-xs text-gold">NEXT_PUBLIC_CALENDLY_URL</code> to the
          environment to enable live scheduling. Until then the studio is taking sessions by hand.
        </p>
        <a href="mailto:care@deon.house" className={cn(buttonClassName({ variant: "outline" }), "mt-8")}>
          Email the studio
        </a>
      </div>
    );
  }

  if (phase === "confirmed") {
    return (
      <div className="border border-gold/30 bg-gold/[0.04] p-12 text-center">
        <CalendarCheck className="mx-auto h-8 w-8 text-gold" strokeWidth={1.25} aria-hidden />
        <h3 className="mt-5 font-serif text-2xl">Your session is booked</h3>
        <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
          A confirmation and calendar invite are on their way to the email you entered on Calendly. We
          have also logged the {bookingType.toLowerCase().replace(/_/g, " ")} against your booking
          record — bring your measurements and any reference images.
        </p>
        <Button variant="outline" className="mt-8" onClick={() => setPhase("idle")}>
          Book another session
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {phase === "canceled" ? (
        <div className="border border-bone/12 p-4">
          <p className="font-sans text-sm text-bone/80">
            That booking was cancelled. Pick a new time below whenever you are ready.
          </p>
        </div>
      ) : null}

      <div className="overflow-hidden border border-bone/12 bg-white">
        <iframe
          ref={iframeRef}
          title="Schedule a consultation with DEON"
          src={`${url}${url.includes("?") ? "&" : "?"}hide_gdpr_banner=1&background_color=ffffff&text_color=111111&primary_color=C5A880`}
          width="100%"
          height="700"
          frameBorder={0}
          loading="lazy"
        />
      </div>

      <p className="font-sans text-xs text-muted-foreground">
        Cannot see the calendar?{" "}
        <button
          type="button"
          onClick={openWidget}
          className="link-underline font-medium text-gold"
        >
          Jump to the scheduler
        </button>
        .
      </p>
    </div>
  );
}
