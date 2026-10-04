"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { sortSizes } from "@/lib/catalog/size-guide";
import { cn } from "@/lib/utils";

export type ShopFilterState = {
  categorySlug: string | null;
  sizes: string[];
  colors: string[];
  onlyInStock: boolean;
  sort: "newest" | "price-asc" | "price-desc";
  q: string;
};

const SORT_OPTIONS: { value: ShopFilterState["sort"]; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" }
];

function selectClassName() {
  return cn(
    "w-full appearance-none border border-bone/12 bg-noir px-4 py-2.5 pr-9 font-sans text-sm text-bone",
    "transition-colors hover:border-bone/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
  );
}

function pillClassName(active: boolean) {
  return cn(
    "border px-3 py-1.5 font-sans text-xs uppercase tracking-[0.1em] transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold",
    active
      ? "border-gold bg-gold text-noir"
      : "border-bone/12 text-bone/65 hover:border-bone/35 hover:text-bone"
  );
}

export function ShopFilters({
  state,
  categories,
  sizes,
  colors,
  resultCount
}: {
  state: ShopFilterState;
  categories: { id: string; slug: string; name: string }[];
  sizes: string[];
  colors: string[];
  resultCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const push = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      startTransition(() => {
        router.replace(next.size > 0 ? `/shop?${next.toString()}` : "/shop", { scroll: false });
      });
    },
    [router, searchParams]
  );

  const toggleListValue = (key: "size" | "color", value: string) => {
    push((next) => {
      const current = next.getAll(key);
      next.delete(key);
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updated.forEach((v) => next.append(key, v));
    });
  };

  const orderedSizes = sortSizes(sizes);
  const hasFilters =
    state.categorySlug !== null ||
    state.sizes.length > 0 ||
    state.colors.length > 0 ||
    state.onlyInStock ||
    state.q.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow inline-flex items-center gap-2">
          <SlidersHorizontal className="h-3 w-3" aria-hidden />
          Refine
        </p>
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
          {isPending ? "Updating…" : `${resultCount} ${resultCount === 1 ? "piece" : "pieces"}`}
        </p>
      </div>

      <form
        className="flex items-center border border-bone/12 focus-within:border-gold/60"
        onSubmit={(event) => {
          event.preventDefault();
          const value = new FormData(event.currentTarget).get("q");
          const q = typeof value === "string" ? value.trim() : "";
          push((next) => {
            if (q) next.set("q", q);
            else next.delete("q");
          });
        }}
      >
        <input
          name="q"
          type="search"
          defaultValue={state.q}
          placeholder="Search the collection"
          aria-label="Search products"
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 font-sans text-sm text-bone placeholder:text-bone/30 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 px-4 py-2.5 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold/10"
        >
          Search
        </button>
      </form>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="filter-category" className="eyebrow">
            Category
          </label>
          <div className="relative">
            <select
              id="filter-category"
              className={selectClassName()}
              value={state.categorySlug ?? ""}
              onChange={(event) =>
                push((next) => {
                  if (event.target.value) next.set("category", event.target.value);
                  else next.delete("category");
                })
              }
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-bone/40"
              aria-hidden
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filter-sort" className="eyebrow">
            Sort
          </label>
          <div className="relative">
            <select
              id="filter-sort"
              className={selectClassName()}
              value={state.sort}
              onChange={(event) => push((next) => next.set("sort", event.target.value))}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-bone/40"
              aria-hidden
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 font-sans text-sm text-bone/75">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={state.onlyInStock}
            onChange={(event) => {
              const checked = event.target.checked;
              push((next) => {
                if (checked) next.set("inStock", "1");
                else next.delete("inStock");
              });
            }}
          />
          <span
            aria-hidden
            className="flex h-4 w-4 items-center justify-center border border-bone/25 transition-colors peer-checked:border-gold peer-checked:bg-gold peer-focus-visible:ring-1 peer-focus-visible:ring-gold"
          >
            <svg viewBox="0 0 10 8" className="h-2 w-2.5" aria-hidden>
              <path
                d="M0 4h2l1.5-3 2 6L7 4h3"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="square"
              />
            </svg>
          </span>
          In stock only
        </label>
      </div>

      {orderedSizes.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Size</p>
          <div className="flex flex-wrap gap-2">
            {orderedSizes.map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={state.sizes.includes(size)}
                onClick={() => toggleListValue("size", size)}
                className={pillClassName(state.sizes.includes(size))}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {colors.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Colour</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                aria-pressed={state.colors.includes(color)}
                onClick={() => toggleListValue("color", color)}
                className={pillClassName(state.colors.includes(color))}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {hasFilters ? (
        <button
          type="button"
          onClick={() => router.replace("/shop", { scroll: false })}
          className="inline-flex items-center gap-2 self-start border-b border-bone/25 pb-1 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-bone/70 transition-colors hover:border-gold hover:text-gold"
        >
          <X className="h-3 w-3" aria-hidden />
          Clear all
        </button>
      ) : null}
    </div>
  );
}