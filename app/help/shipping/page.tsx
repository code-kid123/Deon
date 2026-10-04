import type { Metadata } from "next";
import { PageBody, PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Shipping & delivery",
  description:
    "How DEON ready-to-wear and made-to-measure pieces are shipped across Nigeria and internationally."
};

const ZONES = [
  {
    zone: "Lagos & Abuja",
    timeline: "Next working day",
    detail: "Same-day dispatch before 3pm, hand-delivered by our own rider within Lagos.",
    cost: "Free over ₦150,000 · ₦3,500 otherwise"
  },
  {
    zone: "Rest of Nigeria",
    timeline: "2–4 working days",
    detail: "Dispatched with a tracked courier. You get the tracking link by email and WhatsApp.",
    cost: "₦7,500 · Free over ₦400,000"
  },
  {
    zone: "West Africa",
    timeline: "3–6 working days",
    detail: "Ghana, Benin, Togo and Côte d'Ivoire, via road and air freight respectively.",
    cost: "Quoted at checkout"
  },
  {
    zone: "Rest of world",
    timeline: "5–10 working days",
    detail: "Duties and import taxes are the client's responsibility and are not included in our price.",
    cost: "Quoted at checkout"
  }
];

const NOTES = [
  "Made-to-measure pieces are produced after your first fitting and ship 10–14 days after that approval.",
  "Every ready-to-wear order includes complimentary alterations — bring it in whenever you need it adjusted.",
  "We ship to the name and address on the order. We cannot redirect a parcel once it has left the atelier.",
  "You will receive dispatch confirmation by email with a tracking reference."
];

export default function ShippingPage() {
  return (
    <>
      <PageHero
        eyebrow="Client care"
        title="Shipping & delivery"
        standfirst="We dispatch in small runs, so everything leaves the atelier by hand rather than from a third-party warehouse."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/help/shipping", label: "Shipping" }]}
      />

      <PageBody>
        <ul className="grid gap-px bg-bone/[0.07] sm:grid-cols-2">
          {ZONES.map((zone) => (
            <li key={zone.zone} className="flex flex-col gap-3 bg-noir p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-serif text-2xl">{zone.zone}</h2>
                <span className="font-sans text-[0.625rem] uppercase tracking-[0.16em] text-gold">
                  {zone.timeline}
                </span>
              </div>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">{zone.detail}</p>
              <p className="font-sans text-sm text-bone/80">{zone.cost}</p>
            </li>
          ))}
        </ul>

        <section className="mt-16 flex flex-col gap-5">
          <h2 className="eyebrow">Good to know</h2>
          <ul className="flex flex-col gap-3">
            {NOTES.map((note) => (
              <li key={note} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-bone/80">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                {note}
              </li>
            ))}
          </ul>
        </section>
      </PageBody>
    </>
  );
}