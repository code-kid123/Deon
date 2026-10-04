import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { AiStylist } from "@/components/ai/ai-stylist";
import { BRAND } from "@/lib/brand";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

const serif = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "DEON — High Fashion & Contemporary Mastery",
    template: "%s · DEON"
  },
  description:
    "DEON is a luxury ready-to-wear house and fashion academy. Crafted collections, bespoke styling consultations, and accredited fashion education with instant community access.",
  keywords: [
    "DEON",
    "luxury fashion",
    "ready-to-wear",
    "fashion academy",
    "styling consultation",
    "fashion mentorship"
  ],
  openGraph: {
    title: "DEON — High Fashion & Contemporary Mastery",
    description:
      "Crafted ready-to-wear collections, bespoke styling consultations, and accredited fashion education.",
    url: "/",
    siteName: "DEON",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DEON — High Fashion & Contemporary Mastery",
    description: "A ready-to-wear house and fashion academy."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-noir font-sans text-bone antialiased">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-sm focus:bg-gold focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-widest focus:text-noir"
          >
            Skip to content
          </a>

          <SiteHeader />

          <main id="main" className="flex-1">
            {children}
          </main>

          <SiteFooter />
          <AiStylist />
        </Providers>
      </body>
    </html>
  );
}

export const viewport = {
  themeColor: BRAND.name === "DEON" ? "#0B0B0C" : "#0B0B0C"
};