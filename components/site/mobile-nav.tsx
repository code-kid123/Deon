"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { HeaderCloseButton } from "@/components/site/site-header";
import { buttonClassName } from "@/components/ui/button";
import { BRAND, NAV_LINKS, PRIMARY_CTA, SOCIAL_LINKS } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Full-screen mobile navigation drawer.
 *
 * Mirrors `NAV_LINKS` exactly, adds scroll-to-section behaviour when opened from the
 * homepage, and closes on Escape, backdrop tap, route change or link activation.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Mount-gated so the enter animation plays every time the drawer opens.
  useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function handleSectionClick(anchor: string, event: React.MouseEvent) {
    if (!isHome) return;
    const target = document.getElementById(anchor);
    if (!target) return;
    event.preventDefault();
    onClose();
    // Wait for the exit transition before moving the viewport.
    window.setTimeout(
      () => target.scrollIntoView({ behavior: "smooth", block: "start" }),
      260
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        aria-label="Close menu"
        className={cn(
          "absolute inset-0 bg-noir/70 backdrop-blur-sm transition-opacity duration-400",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label="Site menu"
        className={cn(
          "absolute inset-0 flex flex-col overflow-y-auto bg-noir transition-all duration-500 ease-luxe",
          mounted ? "animate-drawer-in opacity-100" : "translate-y-[-2%] opacity-0"
        )}
      >
        <div className="flex items-center justify-between px-5 py-6 sm:px-8">
          <span className="font-serif text-lg uppercase tracking-[0.42em] text-bone">DEON</span>
          <HeaderCloseButton onClick={onClose} />
        </div>

        <div className="rule-fade mx-5 sm:mx-8" />

        <nav aria-label="Mobile primary" className="flex flex-1 flex-col px-5 py-6 sm:px-8">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, index) => (
              <li key={link.href} className="border-b border-bone/[0.07]">
                <Link
                  href={link.href}
                  onClick={(event) => link.anchor && handleSectionClick(link.anchor, event)}
                  tabIndex={open ? 0 : -1}
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="w-6 shrink-0 font-sans text-[0.625rem] tabular-nums tracking-widest text-gold/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="block font-serif text-3xl leading-tight tracking-tight text-bone transition-colors duration-300 group-hover:text-gold sm:text-4xl">
                      {link.label}
                    </span>
                    {link.description ? (
                      <span className="mt-1 block font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                        {link.description}
                      </span>
                    ) : null}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 self-center text-bone/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                    strokeWidth={1}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={PRIMARY_CTA.href}
              tabIndex={open ? 0 : -1}
              className={buttonClassName({ size: "lg" })}
            >
              {PRIMARY_CTA.label}
            </Link>
            <Link
              href="/shop"
              tabIndex={open ? 0 : -1}
              className={buttonClassName({ size: "lg", variant: "outline" })}
            >
              Shop RTW Collection
            </Link>
          </div>
        </nav>

        <footer className="mt-auto flex flex-col gap-5 border-t border-bone/10 px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-1">
            <p className="font-sans text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
              {BRAND.atelier}
            </p>
            <a
              href={`mailto:${BRAND.email}`}
              className="link-underline w-fit font-sans text-sm text-bone/80"
            >
              {BRAND.email}
            </a>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={open ? 0 : -1}
                  className="font-sans text-[0.625rem] uppercase tracking-[0.18em] text-bone/60 transition-colors hover:text-gold"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  );
}