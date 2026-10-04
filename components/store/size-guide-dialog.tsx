"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { SIZE_GROUPS, type SizeRow } from "@/lib/catalog/size-guide";

export function SizeGuideDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-noir/80 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        tabIndex={-1}
        className="relative max-h-[88vh] w-full max-w-3xl animate-modal-in overflow-y-auto border border-bone/12 bg-noir p-6 outline-none sm:p-9"
      >
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Client care</p>
            <h2 id="size-guide-title" className="font-serif text-3xl">
              Size guide
            </h2>
            <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
              All measurements in centimetres, taken of the body. If you sit between sizes, take the
              larger one — every ready-to-wear piece includes complimentary alterations for life.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close size guide"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-bone/12 text-bone/70 transition-colors hover:border-gold/40 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="flex flex-col gap-10">
          {SIZE_GROUPS.map((group) => {
            const isFootwear = group.rows[0]?.bust === "—";

            return (
              <section key={group.id} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-xl">{group.label}</h3>
                  <p className="font-sans text-xs leading-relaxed text-muted-foreground">
                    {group.description}
                  </p>
                </div>

                <div className="overflow-x-auto border border-bone/10">
                  <table className="w-full min-w-[30rem] border-collapse">
                    <thead>
                      <tr className="border-b border-bone/10">
                        <th
                          scope="col"
                          className="p-3 text-left font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                        >
                          Size
                        </th>
                        <th
                          scope="col"
                          className="p-3 text-center font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                        >
                          UK
                        </th>
                        <th
                          scope="col"
                          className="p-3 text-center font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                        >
                          US
                        </th>
                        <th
                          scope="col"
                          className="p-3 text-center font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                        >
                          EU
                        </th>
                        {isFootwear ? null : (
                          <>
                            <th
                              scope="col"
                              className="p-3 text-center font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-gold"
                            >
                              Bust
                            </th>
                            <th
                              scope="col"
                              className="p-3 text-center font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-gold"
                            >
                              Waist
                            </th>
                            <th
                              scope="col"
                              className="p-3 text-center font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-gold"
                            >
                              Hip
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.map((row: SizeRow) => (
                        <tr key={row.size} className="border-b border-bone/[0.06] last:border-b-0">
                          <th
                            scope="row"
                            className="p-3 text-left font-serif text-base font-normal text-bone"
                          >
                            {row.size}
                          </th>
                          <td className="p-3 text-center font-sans text-sm tabular-nums text-bone/70">
                            {row.uk}
                          </td>
                          <td className="p-3 text-center font-sans text-sm tabular-nums text-bone/70">
                            {row.us}
                          </td>
                          <td className="p-3 text-center font-sans text-sm tabular-nums text-bone/70">
                            {row.eu}
                          </td>
                          {isFootwear ? null : (
                            <>
                              <td className="p-3 text-center font-sans text-sm tabular-nums text-bone/75">
                                {row.bust}
                              </td>
                              <td className="p-3 text-center font-sans text-sm tabular-nums text-bone/75">
                                {row.waist}
                              </td>
                              <td className="p-3 text-center font-sans text-sm tabular-nums text-bone/75">
                                {row.hip}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-bone/10 pt-6">
          <p className="font-sans text-xs text-muted-foreground">Want to be measured properly?</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop/size-guide"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-gold"
            >
              Full guide <ArrowUpRight className="h-3 w-3" aria-hidden />
            </Link>
            <Link
              href="/consultations#book"
              onClick={onClose}
              className="link-underline font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-bone/70 hover:text-bone"
            >
              Book a fitting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}