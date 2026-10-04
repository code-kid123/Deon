import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageHero } from "@/components/site/page-hero";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Sizing, shipping, alterations, course access, Telegram invitations and mentorship applications at DEON."
};

const GROUPS = [
  {
    title: "Ready-to-wear",
    items: [
      {
        q: "How does DEON sizing run?",
        a: "Our house block runs XS–XL and is cut close through the shoulder with a little more room through the hip. Between sizes, take the larger one — every order includes free alterations."
      },
      {
        q: "Will a piece be restocked?",
        a: "No. Runs are archived once sold out. We show the remaining stock honestly rather than accepting orders we cannot fill."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, to most countries. Duties and import taxes are yours and are not included in our price. See shipping & delivery for timings and zones."
      }
    ]
  },
  {
    title: "Academy",
    items: [
      {
        q: "When do I get the Telegram invite?",
        a: "Immediately after your payment clears on Paystack. The link is single-use, admits one person and expires in 24 hours. It is also shown on your confirmation page and emailed."
      },
      {
        q: "What is the difference between tiers?",
        a: "Same curriculum in every tier. What changes is access: live Q&As, one-to-one mentorship, fitting sessions and critiques. The cheapest tier is genuinely enough for most people."
      },
      {
        q: "Can I pay in instalments?",
        a: "Not yet. Everything is paid in full up front. We would rather not hold a place you cannot use."
      }
    ]
  },
  {
    title: "Mentorship",
    items: [
      {
        q: "What is the acceptance rate?",
        a: "Six designers a year. We read every application ourselves and reply either way, usually within five working days."
      },
      {
        q: "Do I need a finished collection to apply?",
        a: "No, but you need to have started. If you are still building your first collection, the course is the better route and costs less."
      },
      {
        q: "Can mentorship be remote?",
        a: "Partly. Studio and Residency tiers include in-person time at the atelier. Studio tier is fully remote apart from the collection review."
      }
    ]
  },
  {
    title: "Consultations",
    items: [
      {
        q: "How do I reschedule?",
        a: "Use the reschedule link in your Calendly confirmation, or email us. Cancellations are honoured up to 24 hours before."
      },
      {
        q: "Do sessions include alterations credit?",
        a: "Any ready-to-wear you order after a session includes complimentary alterations for life, whether or not you book."
      }
    ]
  }
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Client care"
        title="Frequently asked"
        standfirst="The questions we get most, answered properly. If yours is not here, email the studio and we will add it."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/help/faq", label: "FAQ" }]}
      />

      <PageBody>
        <div className="grid gap-14 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <nav aria-label="FAQ sections" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Sections</p>
            <ul className="mt-4 flex flex-col gap-2">
              {GROUPS.map((group) => (
                <li key={group.title}>
                  <a
                    href={`#${group.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                    className="link-underline font-sans text-sm text-bone/70 transition-colors hover:text-gold"
                  >
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/consultations#book"
              className="mt-8 block font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-gold"
            >
              Ask a stylist →
            </Link>
          </nav>

          <div className="flex flex-col gap-16">
            {GROUPS.map((group) => (
              <section
                key={group.title}
                id={group.title.toLowerCase().replace(/[^a-z]+/g, "-")}
                className="scroll-mt-header flex flex-col gap-6"
              >
                <h2 className="font-serif text-3xl">{group.title}</h2>
                <dl className="flex flex-col gap-8">
                  {group.items.map((item) => (
                    <div key={item.q} className="flex flex-col gap-2.5">
                      <dt className="font-serif text-xl leading-snug text-bone">{item.q}</dt>
                      <dd className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>

        <p className="mt-20 border-t border-bone/10 pt-8 font-sans text-sm text-muted-foreground">
          Still stuck?{" "}
          <a href={`mailto:${BRAND.email}`} className="link-underline text-gold">
            {BRAND.email}
          </a>{" "}
          — we answer within one working day.
        </p>
      </PageBody>
    </>
  );
}