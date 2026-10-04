"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { BrandMark } from "@/components/site/brand-mark";
import { CartButton } from "@/components/cart/cart-button";
import { CurrencySwitcher } from "@/components/site/currency-switcher";
import { SearchDialog } from "@/components/site/search-dialog";
import { MobileNav } from "@/components/site/mobile-nav";
import { buttonClassName } from "@/components/ui/button";
import { NAV_LINKS, PRIMARY_CTA } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Sticky, glassy DEON navigation.
 *
 * Links resolve from `NAV_LINKS`. Items that also exist as a homepage section
 * (`href` + `anchor`) scroll smoothly when you are already home and navigate to
 * the dedicated page from anywhere else — so no nav item is ever inert or dead.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route changes must always dismiss the drawer and dialog.
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Route changes and fresh loads carrying a hash must land on the target section.
  useEffect(() => {
    if (!isHome) return;
    const target = window.location.hash.replace("#", "");
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, isHome]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      setSearchOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string, anchor?: string) => {
    const base = href.replace(/#.*$/, "");
    if (base === "/" ) return false;
    if (base !== pathname) return false;
    // On a shared route the section anchor determines the highlight.
    if (!anchor) return true;
    return !isHome;
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe",
          scrolled
            ? "glass-nav border-b border-bone/10 py-2 shadow-lift"
            : "border-b border-transparent py-4"
        )}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center gap-6 px-5 sm:px-8 lg:px-12">
          <BrandMark />

          <nav
            aria-label="Primary"
            className="hidden flex-1 items-center justify-center gap-8 lg:flex"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, link.anchor);
              return (
                <NavItem key={link.href} {...link} active={active} isHome={isHome} />
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0 lg:gap-2">
            <CurrencySwitcher />
            <SearchTrigger onClick={() => setSearchOpen(true)} />

            <div className="hidden sm:block">
              <CartButton />
            </div>

            <Link
              href={PRIMARY_CTA.href}
              className={buttonClassName({ variant: "default", size: "sm" }) + " ml-1 hidden md:inline-flex"}
            >
              {PRIMARY_CTA.label}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="ml-1 flex h-10 w-10 items-center justify-center text-bone transition-colors hover:text-gold lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </header>

      {/* Clears the floating header on every page. */}
      <div aria-hidden className="h-20 lg:h-24" />

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function NavItem({
  href,
  label,
  anchor,
  active,
  isHome
}: {
  href: string;
  label: string;
  anchor?: string;
  active: boolean;
  isHome: boolean;
}) {
  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!anchor || !isHome) return;
    // Already on the homepage: intercept and scroll instead of re-navigating.
    const target = document.getElementById(anchor);
    if (!target) return;
    event.preventDefault();
    history.replaceState(null, "", `#${anchor}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "link-underline py-1 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
        active ? "text-gold" : "text-bone/70 hover:text-bone"
      )}
    >
      {label}
    </Link>
  );
}

function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search the collection"
      className="flex h-10 items-center gap-2 px-2.5 text-bone/80 transition-colors hover:text-gold"
    >
      <Search className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.35} />
      <span className="hidden text-[0.6875rem] uppercase tracking-[0.18em] xl:inline">Search</span>
    </button>
  );
}

export function HeaderCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close menu"
      className="flex h-10 w-10 items-center justify-center text-bone/80 transition-colors hover:text-gold"
    >
      <X className="h-5 w-5" strokeWidth={1.25} />
    </button>
  );
}