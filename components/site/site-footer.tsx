import Link from "next/link";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { Button } from "@/components/ui/button";
import { BRAND, FOOTER_LINKS, SOCIAL_LINKS, isExternalHref } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-bone/10 bg-noir">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)]">
          {/* Newsletter */}
          <section aria-labelledby="footer-newsletter" className="flex max-w-md flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">The private list</p>
              <h2 id="footer-newsletter" className="font-serif text-3xl leading-[1.1] tracking-tight">
                First access to every drop.
              </h2>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                Small runs mean small lists. Join for private-sale notice, restock alerts and
                academy intake dates before they go public.
              </p>
            </div>
            <NewsletterForm />
          </section>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {FOOTER_LINKS.map((column) => (
              <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
                <h3 className="font-sans text-[0.625rem] font-semibold uppercase tracking-widest text-gold">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      {isExternalHref(link.href) ? (
                        <a
                          href={link.href}
                          className="link-underline w-fit font-sans text-sm text-bone/70 transition-colors hover:text-bone"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="link-underline w-fit font-sans text-sm text-bone/70 transition-colors hover:text-bone"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Contact + socials */}
        <div className="mt-16 flex flex-col gap-8 border-t border-bone/10 pt-10 lg:flex-row lg:items-end lg:justify-between">
          <address className="flex flex-col gap-1 not-italic">
            <p className="font-sans text-[0.625rem] uppercase tracking-widest text-bone/45">
              Atelier
            </p>
            {BRAND.address.map((line) => (
              <p key={line} className="font-sans text-sm text-bone/75">
                {line}
              </p>
            ))}
            <a
              href={`mailto:${BRAND.email}`}
              className="link-underline mt-2 w-fit font-sans text-sm text-gold"
            >
              {BRAND.email}
            </a>
          </address>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[0.625rem] uppercase tracking-[0.18em] text-bone/60 transition-colors hover:text-gold"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Oversized brand mark watermark */}
        <div
          aria-hidden
          className="pointer-events-none mt-14 select-none overflow-hidden"
        >
          <p className="bg-gradient-to-b from-bone/12 to-transparent bg-clip-text text-center font-serif text-[clamp(4rem,20vw,17rem)] font-medium uppercase leading-[0.8] tracking-[0.06em] text-transparent">
            DEON
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-bone/10 pt-6 sm:flex-row">
          <p className="font-sans text-xs text-bone/40">
            © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
          </p>
          <p className="font-sans text-[0.625rem] uppercase tracking-[0.18em] text-bone/30">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col">{children}</div>;
}