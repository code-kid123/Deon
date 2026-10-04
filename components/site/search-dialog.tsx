"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, CornerDownLeft, Loader2, Search, X } from "lucide-react";
import type { SearchEntry } from "@/app/api/search/route";
import { cn } from "@/lib/utils";

/**
 * Command-palette style search across products and courses.
 * Opens with `/` or Cmd/Ctrl+K, closes on Escape or navigation.
 * The index is fetched from /api/search so server-only data access
 * (Supabase service role) stays out of the browser bundle.
 */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch("/api/search", { headers: { accept: "application/json" } });
      if (!response.ok) throw new Error(`search index ${response.status}`);
      const data = (await response.json()) as { entries: SearchEntry[] };
      setEntries(data.entries);
    } catch (error) {
      console.error("search: index unavailable", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const typing =
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(event.target.tagName);

      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (typing) return;
      if (event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        if (open) inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.focus();
    void load();
  }, [open, load]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries.slice(0, 8);
    return entries
      .filter((entry) => entry.label.toLowerCase().includes(needle))
      .slice(0, 10);
  }, [entries, query]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        aria-label="Close search"
        className={cn(
          "absolute inset-0 bg-noir/85 backdrop-blur-md transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label="Search"
        className={cn(
          "relative w-full max-w-2xl border border-bone/12 bg-noir/95 shadow-lift transition-all duration-300",
          open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        )}
      >
        <div className="flex items-center gap-3 border-b border-bone/10 px-5 py-4">
          <Search className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (event.key === "Enter" && results[activeIndex]) {
                event.preventDefault();
                go(results[activeIndex].href);
              }
            }}
            placeholder="Search garments, courses, services…"
            aria-label="Search the collection and academy"
            className="w-full bg-transparent font-sans text-sm text-bone outline-none placeholder:text-bone/35"
            tabIndex={open ? 0 : -1}
          />
          <button
            type="button"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            aria-label="Close search"
            className="shrink-0 text-bone/50 transition-colors hover:text-gold"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto">
          {loading ? (
            <p className="flex items-center justify-center gap-2 px-5 py-10 text-center font-sans text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading the index…
            </p>
          ) : failed ? (
            <p className="px-5 py-10 text-center font-sans text-sm text-muted-foreground">
              Search is unavailable right now.{" "}
              <button
                type="button"
                onClick={() => void load()}
                className="link-underline text-gold"
              >
                Retry
              </button>{" "}
              or{" "}
              <Link href="/shop" onClick={onClose} className="link-underline text-gold">
                browse the collection
              </Link>
              .
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-10 text-center font-sans text-sm text-muted-foreground">
              Nothing matches “{query}”. Try “trench”, “cashmere” or “pattern”.
            </p>
          ) : (
            <ul className="divide-y divide-bone/[0.06]">
              {results.map((entry, index) => (
                <li key={entry.id}>
                  <Link
                    href={entry.href}
                    onClick={onClose}
                    tabIndex={open ? 0 : -1}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex items-center gap-4 px-5 py-3 transition-colors",
                      index === activeIndex ? "bg-bone/[0.05]" : "bg-transparent"
                    )}
                  >
                    {entry.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.imageUrl}
                        alt=""
                        className="h-12 w-9 shrink-0 object-cover"
                      />
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-base text-bone">{entry.label}</span>
                      <span className="block font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                        {entry.meta}
                      </span>
                    </span>
                    <CornerDownLeft
                      className="h-3.5 w-3.5 shrink-0 text-bone/25"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-bone/10 px-5 py-3">
          <p className="font-sans text-[0.625rem] uppercase tracking-[0.16em] text-bone/40">
            ↑ ↓ to navigate · ↵ to open · esc to close
          </p>
          <Link
            href="/shop"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className="inline-flex items-center gap-1 font-sans text-[0.625rem] uppercase tracking-[0.16em] text-gold"
          >
            Full collection
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}