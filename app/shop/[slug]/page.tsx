import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProductBySlug, listProducts } from "@/lib/catalog/catalog-repository";
import { ProductGallery } from "@/components/store/product-gallery";
import { VariantPicker } from "@/components/store/variant-picker";
import { ProductCard } from "@/components/store/product-card";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Piece not found" };

  return {
    title: product.name,
    description: product.description ?? `${product.name} from the DEON ready-to-wear atelier.`
  };
}

function toStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const highlights = toStrings(product.highlights);
  const care = toStrings(product.care);

  const related = product.categoryId
    ? await listProducts({ categoryId: product.categoryId })
    : { products: [], categories: [] };
  const category = related.categories.find((c) => c.id === product.categoryId);
  const relatedProducts = related.products.filter((p) => p.id !== product.id).slice(0, 3);
  const soldOut = product.stockTotal <= 0;
  const lowStock = !soldOut && product.stockTotal <= 3;
  const onArchive = (product.compareAtMinor ?? 0) > (product.priceMinor ?? 0);
  const badge = soldOut ? "Sold out" : onArchive ? "Archive price" : lowStock ? "Last few" : null;

  return (
    <>
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 py-6 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-gold">
            Home
          </Link>
          <span aria-hidden className="text-bone/20">
            /
          </span>
          <Link href="/shop" className="transition-colors hover:text-gold">
            Collection
          </Link>
          {category ? (
            <>
              <span aria-hidden className="text-bone/20">
                /
              </span>
              <Link href={`/shop?category=${category.slug}`} className="transition-colors hover:text-gold">
                {category.name}
              </Link>
            </>
          ) : null}
          <span aria-hidden className="text-bone/20">
            /
          </span>
          <span className="truncate text-bone">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:px-12 xl:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery
            images={product.images.map((i) => ({ url: i.url, alt: i.alt }))}
            name={product.name}
            badge={badge}
          />
        </div>

        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            {category ? <p className="eyebrow">{category.name}</p> : null}
            <h1 className="font-serif text-4xl leading-[1.05] sm:text-5xl">{product.name}</h1>
            {soldOut ? (
              <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-gold">
                Archived run · made to order only
              </p>
            ) : null}
          </header>

          <VariantPicker
            productId={product.id}
            slug={product.slug}
            productName={product.name}
            currency={product.currency}
            galleryImageUrl={product.images[0]?.url ?? null}
            variants={product.variants.map((v) => ({
              id: v.id,
              sku: v.sku,
              size: v.size,
              color: v.color,
              priceMinor: v.priceMinor ?? 0,
              compareAtMinor: v.compareAtMinor,
              stock: v.stock
            }))}
          />

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-bone/10 py-4">
            <Link
              href="/shop/size-guide"
              className="link-underline font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-bone/70 transition-colors hover:text-gold"
            >
              Size guide
            </Link>
            <span aria-hidden className="h-3 w-px bg-bone/15" />
            <p className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-bone/70">
              Complimentary alterations for life
            </p>
          </div>

          {product.description ? (
            <section className="flex flex-col gap-3">
              <h2 className="eyebrow">The piece</h2>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </section>
          ) : null}

          {highlights.length > 0 ? (
            <section className="flex flex-col gap-3 border-t border-bone/10 pt-8">
              <h2 className="eyebrow">Highlights</h2>
              <ul className="grid gap-2.5">
                {highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 font-sans text-sm leading-relaxed text-bone/80"
                  >
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {care.length > 0 ? (
            <section className="flex flex-col gap-3 border-t border-bone/10 pt-8">
              <h2 className="eyebrow">Care</h2>
              <ul className="grid gap-2.5">
                {care.map((instruction) => (
                  <li
                    key={instruction}
                    className="flex items-start gap-3 font-sans text-sm leading-relaxed text-bone/80"
                  >
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {instruction}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="flex flex-col gap-4 border-t border-bone/10 pt-8">
            <h2 className="eyebrow">Client care</h2>
            <div className="grid gap-px bg-bone/[0.07] sm:grid-cols-3">
              {[
                { href: "/help/shipping", label: "Shipping", note: "Dispatched in 24h" },
                { href: "/help/returns", label: "Returns", note: "14 days, unworn" },
                { href: "/consultations#book", label: "Styling", note: "Book a session" }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col gap-1 bg-noir p-5 transition-colors hover:bg-bone/[0.03]"
                >
                  <span className="font-serif text-base text-bone transition-colors group-hover:text-gold">
                    {item.label}
                  </span>
                  <span className="font-sans text-xs text-muted-foreground">{item.note}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="border-t border-bone/10 bg-bone/[0.015]">
          <div className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-3">
                <p className="eyebrow">Complete the look</p>
                <h2 className="font-serif text-3xl sm:text-4xl">Worn together</h2>
              </div>
              <Link
                href="/shop"
                className="link-underline font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-gold"
              >
                View all pieces →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}