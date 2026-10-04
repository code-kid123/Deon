"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  url: string;
  alt: string | null;
};

export function ProductGallery({
  images,
  name,
  badge
}: {
  images: GalleryImage[];
  name: string;
  badge?: string | null;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center border border-bone/10 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
        No image
      </div>
    );
  }

  const index = Math.min(active, images.length - 1);
  const current = images[index];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden bg-bone/[0.04]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={current.alt ?? name}
          className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
          // The active index is intentionally not a data dependency for the browser cache.
          data-active-image={active}
        />
        {badge ? (
          <span className="absolute left-4 top-4 bg-noir/80 px-3 py-1.5 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur-sm">
            {badge}
          </span>
        ) : null}
        {images.length > 1 ? (
          <span className="absolute bottom-4 right-4 bg-noir/70 px-2.5 py-1 font-sans text-[0.5625rem] uppercase tracking-[0.16em] text-bone/80 tabular-nums backdrop-blur-sm">
            {index + 1} / {images.length}
          </span>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 5)}, minmax(0, 1fr))` }}
          role="tablist"
          aria-label={`${name} images`}
        >
          {images.map((image, i) => (
            <button
              key={`${image.url}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`View image ${i + 1} of ${images.length}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative overflow-hidden border transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold",
                i === active
                  ? "border-gold/70 opacity-100"
                  : "border-bone/10 opacity-55 hover:opacity-90"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt ?? `${name} thumbnail ${i + 1}`}
                className="aspect-[3/4] w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}