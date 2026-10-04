/**
 * DEON brand constants and the single source of truth for site navigation.
 *
 * Every header, mobile drawer, footer and in-page CTA resolves its targets from
 * `NAV_LINKS` / `FOOTER_LINKS`, so a route can never drift out of sync with the
 * navigation that points at it.
 */

export const BRAND = {
  name: "DEON",
  wordmark: "DEON",
  tagline: "High Fashion & Contemporary Mastery",
  legalName: "DEON Atelier Ltd.",
  founded: 2019,
  atelier: "Lagos, Nigeria",
  email: "care@deon.house",
  phone: "+234 800 000 0000",
  address: ["DEON Atelier", "14B Bourdillon Road", "Ikoyi, Lagos"]
} as const;

export const SOCIAL_LINKS = [
  { href: "https://instagram.com/deon.house", label: "Instagram" },
  { href: "https://tiktok.com/@deon.house", label: "TikTok" },
  { href: "https://pinterest.com/deon.house", label: "Pinterest" },
  { href: "https://t.me/deon_academy", label: "Telegram" }
] as const;

export type NavLink = {
  href: string;
  label: string;
  /** Present when the item targets a homepage section that should scroll smoothly. */
  anchor?: string;
  description?: string;
  /** Renders the nav item in champagne to mark the primary conversion. */
  featured?: boolean;
};

/**
 * Desktop / mobile primary navigation.
 *
 * `href` is a real route (or `/#section` when the target lives on the homepage),
 * so every entry is a genuine destination rather than a placeholder.
 */
export const NAV_LINKS: readonly NavLink[] = [
  { href: "/academy", anchor: "academy", label: "Academy", description: "Fashion courses" },
  {
    href: "/consultations",
    anchor: "consultations",
    label: "Consultations",
    description: "1-on-1 styling"
  },
  { href: "/mentorship", label: "Mentorship", description: "For designers" },
  { href: "/shop", anchor: "collection", label: "RTW Collection", description: "Ready-to-wear" },
  { href: "/about", label: "About", description: "The house" },
  {
    href: "/#ai-stylist",
    anchor: "ai-stylist",
    label: "AI Stylist",
    description: "Ask DEON AI"
  }
] as const;

export const PRIMARY_CTA = {
  href: "/consultations#book",
  label: "Book Session"
} as const;

export type FooterColumn = {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
};

export const FOOTER_LINKS: readonly FooterColumn[] = [
  {
    title: "The House",
    links: [
      { href: "/about", label: "About DEON" },
      { href: "/shop", label: "RTW Collection" },
      { href: "/shop?inStock=1", label: "In stock now" },
      { href: "/#collection", label: "New arrivals" }
    ]
  },
  {
    title: "Academy",
    links: [
      { href: "/academy", label: "All courses" },
      { href: "/mentorship", label: "Mentorship programme" },
      { href: "/consultations", label: "Private consultation" },
      { href: "/#ai-stylist", label: "DEON AI Stylist" }
    ]
  },
  {
    title: "Client Care",
    links: [
      { href: "/shop/size-guide", label: "Size guide" },
      { href: "/help/shipping", label: "Shipping & delivery" },
      { href: "/help/returns", label: "Returns & alterations" },
      { href: "/help/faq", label: "FAQ" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of sale" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "mailto:care@deon.house", label: "Contact the studio" }
    ]
  }
] as const;

export const TICKER_ITEMS = [
  "Complimentary alterations on all ready-to-wear",
  "Small-batch production, Lagos atelier",
  "Instant Telegram community access on enrolment",
  "Book a session — cancellations honoured up to 24h"
] as const;

export function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href);
}