import { MOCK_PRODUCTS } from "@/lib/mock/catalog";
import { MOCK_COURSES } from "@/lib/mock/academy";
import { formatMoney } from "@/lib/money";

/**
 * Rule-based knowledge base for the DEON AI Stylist demo.
 *
 * Intentionally deterministic: the front-end must answer sensibly on a fresh clone
 * with no API key. Swap `answer()` for an Anthropic call (the SDK is already a
 * dependency) and keep the same response shape.
 */

export type StylistReply = {
  text: string;
  links?: { label: string; href: string }[];
};

type Intent = {
  id: string;
  keywords: string[];
  reply: StylistReply;
};

const cheapest = MOCK_PRODUCTS.filter((p) => p.priceMinor !== null).sort(
  (a, b) => (a.priceMinor ?? 0) - (b.priceMinor ?? 0)
);

const INTENT_ORDER: Intent[] = [
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    reply: {
      text: "Welcome to DEON. I can help you find a piece for an occasion, understand our sizing, walk you through a course, or book a private session. What are you styling for?"
    }
  },
  {
    id: "occasion",
    keywords: ["wedding", "event", "occasion", "party", "gala", "aso ebi", "conference", "dinner"],
    reply: {
      text: "For black-tie and evening, the pieces that hold their line are our Bone Column Dress and the Obsidian Double-Face Trench over tailoring. Both are cut to be altered to you at no charge — book a session and we will size you properly rather than guessing.",
      links: [
        { label: "Bone Column Dress", href: "/shop/bone-column-dress" },
        { label: "Book a session", href: "/consultations" }
      ]
    }
  },
  {
    id: "size",
    keywords: ["size", "sizing", "fit", "measure", "measurement", "alteration", "alterations", "small", "medium", "large"],
    reply: {
      text: "Our ready-to-wear runs XS–XL on a DEON block. Two things matter most: the bust-to-waist difference and how you want the shoulder to sit. Every order includes complimentary alterations for life, so if a size is close, take it and let the studio take it in. The size guide is on the product pages; a 1-on-1 session will pin it down exactly.",
      links: [
        { label: "Book a fitting", href: "/consultations" },
        { label: "Mentorship programme", href: "/mentorship" }
      ]
    }
  },
  {
    id: "course",
    keywords: ["course", "academy", "learn", "study", "study", "class", "curriculum", "tier", "enrol", "enroll", "education"],
    reply: {
      text: "The DEON Academy has three flagship courses. Ready-to-Wear Design Foundations takes you from sketch to a saleable sample. Personal Styling & Client Direction is for stylists building a practice. Starting Your Own Label covers the business half — entity, capital, production, wholesale. Every tier includes instant Telegram community access, and the mentorship tier adds direct time with the creative director.",
      links: MOCK_COURSES.map((course) => ({
        label: course.title,
        href: `/academy/${course.slug}`
      }))
    }
  },
  {
    id: "telegram",
    keywords: ["telegram", "community", "invite", "access", "group"],
    reply: {
      text: "Enrolment issues a single-use Telegram invite to the private community immediately after payment — one link, one person, expiring in 24 hours. It is where critique requests, restock notice and studio drops happen first.",
      links: [{ label: "Browse the academy", href: "/academy" }]
    }
  },
  {
    id: "consultation",
    keywords: ["consult", "consultation", "stylist", "session", "appointment", "book", "booking", "1-on-1", "one-on-one"],
    reply: {
      text: "Private sessions run 60–90 minutes over video, or in person at the Lagos atelier. You get a pre-session style profile, live direction, and a written summary with outfit formulas. Calendars are real, so booking here holds a slot immediately.",
      links: [{ label: "Book a session", href: "/consultations#book" }]
    }
  },
  {
    id: "mentorship",
    keywords: ["mentorship", "mentor", "mentoring", "designer", "label", "brand", "apply", "application"],
    reply: {
      text: "Mentorship is a bounded programme for designers ready to build an actual label — not a course subscription. You apply with your experience level, portfolio and goals. We review, then you either activate a paid tier or get a clear no with notes. We would rather say no than take your money quietly.",
      links: [{ label: "See the programme", href: "/mentorship" }]
    }
  },
  {
    id: "price",
    keywords: ["price", "cost", "how much", "budget", "expensive", "cheap", "afford", "currency", "dollar", "usd"],
    reply: {
      text: `Ready-to-wear runs from ${formatMoney(
        cheapest[0]?.priceMinor ?? 0,
        "NGN"
      )} up. Our pieces are small-batch, so prices reflect real cloth and real finishing time rather than a marketing budget. Use the NGN/USD toggle in the header to view either, and remember alterations are included for life on every ready-to-wear piece.`,
      links: [{ label: "View the collection", href: "/shop" }]
    }
  },
  {
    id: "shipping",
    keywords: ["shipping", "delivery", "deliver", "ship", "when", "arrive", "return", "returns", "exchange"],
    reply: {
      text: "Lagos and Abuja ship next working day; the rest of Nigeria takes 2–4 working days; international is quoted at checkout. Ready-to-wear is returnable unworn within 14 days. Made-to-measure pieces are final sale once the first fitting is approved.",
      links: [{ label: "Shipping & delivery", href: "/help/shipping" }]
    }
  },
  {
    id: "recommend",
    keywords: ["recommend", "suggest", "what should i", "which", "best", "help me choose", "gift"],
    reply: {
      text: "The two pieces people buy first are the Structured Leather Tote (works with everything, lasts forever) and the Merino Crew in Bone (the permanent-collection foundation). If you tell me the occasion and roughly what you want to spend, I will narrow it to one or two.",
      links: [
        { label: "Structured Leather Tote", href: "/shop/structured-leather-tote" },
        { label: "Merino Crew", href: "/shop/merino-crew-bone" }
      ]
    }
  },
  {
    id: "care",
    keywords: ["care", "wash", "clean", "dry clean", "laundry", "iron", "maintenance", "shrink"],
    reply: {
      text: "Nearly everything is dry-clean only, and that is deliberate — it is why our pieces last. Merino can go on a wool cycle, silk must not be wrung, and outerwear should be brushed along the nap after each wear. Specific care instructions are on every product page.",
      links: [{ label: "Browse the collection", href: "/shop" }]
    }
  }
];

const FALLBACK: StylistReply = {
  text: "I can help with four things: finding a piece for a specific occasion, our sizing and alterations, the academy courses and tiers, or booking a private session. Which of those is closest to what you need?",
  links: [
    { label: "The collection", href: "/shop" },
    { label: "The academy", href: "/academy" }
  ]
};

export function answer(input: string): StylistReply {
  const needle = input.toLowerCase().trim();
  if (!needle) return FALLBACK;

  const match = INTENT_ORDER.find((intent) =>
    intent.keywords.some((keyword) => needle.includes(keyword))
  );

  return match ? match.reply : FALLBACK;
}

export const GREETING = "I am DEON AI. Ask me about sizing, an occasion, a course, or booking a session.";