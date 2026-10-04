import type { Metadata } from "next";
import { PageBody, PageHero } from "@/components/site/page-hero";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What DEON collects, why we collect it, and what we will never do with it."
};

const SECTIONS = [
  {
    heading: "What we collect",
    body: [
      "Order data: name, email, delivery address, phone number and the pieces you bought. We keep this to deliver your order and handle alterations or returns.",
      "Account data: if you create an account, your email, password hash and course progress.",
      "Booking data: consultation bookings are created by Calendly and stored with your name, email and appointment time.",
      "Enrolment data: courses you are enrolled on, lesson progress and your community access status."
    ]
  },
  {
    heading: "Payment data",
    body: [
      "Payments are processed entirely by Paystack. We never receive or store your card number, expiry or CVV.",
      "We do store your Paystack reference and transaction status, so we can match a payment to an order and process refunds."
    ]
  },
  {
    heading: "How we use it",
    body: [
      "To take payment, deliver goods and provide the course or consultation you bought.",
      "To email you about your order. Marketing email is opt-in only, and every message has a one-click unsubscribe.",
      "To detect and prevent fraud, particularly around payment and discount abuse."
    ]
  },
  {
    heading: "Who else sees it",
    body: [
      "Our hosting and database providers (Supabase), payment processor (Paystack), booking provider (Calendly), email provider and courier partners — each only as much as is needed to do their job.",
      "We do not sell your data. We do not share it for advertising. Ever."
    ]
  },
  {
    heading: "How long we keep it",
    body: [
      "Order and fulfilment records: seven years, because tax law requires it.",
      "Course progress: for as long as your account exists.",
      "Marketing subscriptions: until you unsubscribe, then deleted within 30 days."
    ]
  },
  {
    heading: "Your rights",
    body: [
      `You can ask for a copy of your data, ask us to correct it, or ask us to delete it by emailing ${BRAND.email}. We respond within 30 days.`,
      "You can withdraw marketing consent at any time without affecting your orders.",
      "If you are unhappy with how we have handled your data you can complain to the Nigeria Data Protection Commission."
    ]
  },
  {
    heading: "Cookies",
    body: [
      "We use a small number of cookies and localStorage entries to keep your bag, remember your display currency and tell the site that you have already seen our announcement.",
      "We do not run third-party advertising cookies or cross-site trackers."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        standfirst="The short version: we collect what an order requires, we do not sell it, and you can ask for it back or have it deleted at any time."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/privacy", label: "Privacy" }]}
      />

      <PageBody>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-12">
            {SECTIONS.map((section, index) => (
              <section key={section.heading} className="flex flex-col gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-lg tabular-nums text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-2xl leading-tight">{section.heading}</h2>
                </div>
                <div className="flex flex-col gap-3 sm:pl-10">
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
            This is a demonstration front-end. Replace this page with a policy reviewed against NDPA
            obligations before going live.
          </p>
        </div>
      </PageBody>
    </>
  );
}