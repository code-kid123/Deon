import type { Metadata } from "next";
import { PageBody, PageHero } from "@/components/site/page-hero";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms of sale",
  description: "The terms on which DEON Atelier sells ready-to-wear, courses and consultations."
};

const SECTIONS = [
  {
    heading: "Orders and pricing",
    body: [
      "All prices are shown in Nigerian Naira unless a USD view is selected. The USD figure is indicative and is calculated at an approximate rate — you are always charged in NGN at the rate shown when you check out.",
      "An order is a request, not a contract. A contract forms when we confirm dispatch. If a piece sells out between your order and dispatch we will tell you and refund in full.",
      "We may decline an order where a price has been listed in obvious error."
    ]
  },
  {
    heading: "Payment",
    body: [
      "Payments are processed by Paystack on our behalf. We never see or store your card details.",
      "Ready-to-wear and courses are paid in full up front. A failure to authorise payment results in the order being cancelled automatically.",
      "Mentorship tiers are invoiced after application review; the programme begins once payment clears."
    ]
  },
  {
    heading: "Delivery, returns and alterations",
    body: [
      "Risk in the goods passes to you on delivery. Title passes on receipt of full payment.",
      "Ready-to-wear may be returned unworn within 14 days. Made-to-measure is final sale once the first fitting is approved.",
      "Complimentary alterations on ready-to-wear are provided for the life of the garment and do not cover reconstruction."
    ]
  },
  {
    heading: "Courses and community access",
    body: [
      "Course purchases are non-refundable once any lesson has been watched. Before that, we will refund in full.",
      "Community access is personal and non-transferable. Each enrolment receives one single-use Telegram invite admitting one person.",
      "Mentorship places are limited and confirmed in writing. We reserve the right to end a programme early and refund the unused portion if we cannot deliver what was promised."
    ]
  },
  {
    heading: "Consultations",
    body: [
      "Sessions are confirmed by Calendly at the time of booking. Cancellations are honoured up to 24 hours before the appointment.",
      "Advice given during a consultation is personal to you and does not constitute a guarantee of any particular result.",
      "Travel to an atelier visit is the client's responsibility."
    ]
  },
  {
    heading: "Intellectual property and conduct",
    body: [
      "All patterns, teaching material and imagery are the property of DEON Atelier. Courses grant a personal, non-transferable licence to use the material for your own learning.",
      "Recording, redistributing or reselling course material is prohibited.",
      "We may end your access to any course or community if your conduct harms other students or the studio."
    ]
  },
  {
    heading: "Liability",
    body: [
      "Nothing in these terms limits our liability for death, personal injury or fraud.",
      "Otherwise our total liability is limited to the amount you paid us for the relevant order.",
      "These terms are governed by the laws of the Federal Republic of Nigeria, and disputes are subject to the exclusive jurisdiction of the Nigerian courts."
    ]
  }
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of sale"
        standfirst="Plain-language terms for the collection, the academy and consultations. Written to be read, not to be survived."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/terms", label: "Terms" }]}
      />

      <PageBody>
        <div className="mx-auto max-w-3xl">
          <p className="mb-12 font-sans text-sm leading-relaxed text-muted-foreground">
            These terms apply to every order placed with {BRAND.legalName}. They are versioned from
            time to time; the version that applies is the one published when your order was placed.
          </p>

          <div className="flex flex-col gap-12">
            {SECTIONS.map((section, index) => (
              <section key={section.heading} className="flex flex-col gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-lg tabular-nums text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-2xl leading-tight">{section.heading}</h2>
                </div>
                <div className="flex flex-col gap-3 pl-0 sm:pl-10">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="font-sans text-sm leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-16 border-t border-bone/10 pt-8 font-sans text-xs leading-relaxed text-bone/40">
            This is a demonstration front-end. Replace this page with terms reviewed by your counsel
            before taking real orders.
          </p>
        </div>
      </PageBody>
    </>
  );
}