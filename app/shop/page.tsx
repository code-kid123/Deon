import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { listProducts, listCategories } from "@/lib/catalog/catalog-repository";
import { ProductCard } from "@/components/store/product-card";
import { ShopFilters, type ShopFilterState } from "@/components/store/shop-filters";
import { PageHero } from "@/components/site/page-hero";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "RTW Collection",
  description:
    "Small-batch ready-to-wear from the DEON atelier. Filter by size, colour or availability."
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function many(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function parseState(params: SearchParams): ShopFilterState {
  const sort = first(params.sort);

  return {
    categorySlug: first(params.category) ?? null,
    sizes: many(params.size),
    colors: many(params.color),
    onlyInStock: first(params.inStock) === "1",
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "newest",
    q: (first(params.q) ?? "").trim()
  };
}

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const state = parseState(await searchParams);

  const categories = await listCategories();
  const activeCategory = state.categorySlug
    ? categories.find((c) => c.slug === state.categorySlug)
    : undefined;

  const result = await listProducts({
    categoryId: activeCategory?.id,
    q: state.q || undefined,
    sizes: state.sizes.length > 0 ? state.sizes : undefined,
    colors: state.colors.length > 0 ? state.colors : undefined,
    onlyInStock: state.onlyInStock,
    sort: state.sort
  });

  return (
    <>
      <PageHero
        eyebrow="Collection IV"
        title={activeCategory ? activeCategory.name : "The RTW Collection"}
        standfirst={
          activeCategory?.description ??
          "Small-batch ready-to-wear, cut and finished in our Lagos atelier. Filter by size, colour or availability — hover any piece to add your size straight to the bag."
        }
        breadcrumb={[
          { href: "/", label: "Home" },
          ...(activeCategory
            ? [
                { href: "/shop", label: "Collection" },
                { href: `/shop?category=${activeCategory.slug}`, label: activeCategory.name }
              ]
            : [{ href: "/shop", label: "Collection" }])
        ]}
      />

      <div className="mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Suspense fallback={<div className="h-96 animate-pulse bg-bone/[0.04]" />}>
              <ShopFilters
                state={state}
                categories={categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
                sizes={result.sizes}
                colors={result.colors}
                resultCount={result.total}
              />
            </Suspense>
          </aside>

          <section>
            {result.products.length === 0 ? (
              <div className="border border-dashed border-bone/15 px-8 py-24 text-center">
                <h2 className="font-serif text-2xl">Nothing matches those filters</h2>
                <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                  Try widening your size or colour selection, or clear the filters to see the full
                  collection. Runs are small — a piece may have archived while you were browsing.
                </p>
                <Link href="/shop" className={cn(buttonClassName({ variant: "outline" }), "mt-8")}>
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-3">
                {result.products.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 3} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
