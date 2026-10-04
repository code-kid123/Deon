import { NextResponse } from "next/server";
import { listProducts } from "@/lib/catalog/catalog-repository";
import { listCourses } from "@/lib/academy/academy-repository";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-static";

export type SearchEntry = {
  id: string;
  label: string;
  meta: string;
  href: string;
  imageUrl: string | null;
};

/**
 * Search index for the command palette. Served from the server so the
 * service-role Supabase client never reaches the browser bundle.
 */
export async function GET() {
  const [productList, courseList] = await Promise.all([listProducts({ sort: "newest" }), listCourses()]);

  const products: SearchEntry[] = productList.products.slice(0, 24).map((product) => ({
    id: product.id,
    label: product.name,
    meta:
      product.priceMinor !== null ? formatMoney(product.priceMinor, product.currency) : "Sold out",
    href: `/shop/${product.slug}`,
    imageUrl: product.images[0]?.url ?? null
  }));

  const courses: SearchEntry[] = courseList.map((course) => ({
    id: course.id,
    label: course.title,
    meta:
      course.lowestPriceMinor !== null
        ? `From ${formatMoney(course.lowestPriceMinor, course.currency)}`
        : "Enrolment closed",
    href: `/academy/${course.slug}`,
    imageUrl: course.coverImage
  }));

  return NextResponse.json(
    { entries: [...products, ...courses] },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } }
  );
}