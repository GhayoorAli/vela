import { Suspense } from "react";
import Image from "next/image";
import { FilterSidebar, ShopToolbar } from "@/components/store/Filters";
import { ProductGrid } from "@/components/store/ProductCard";
import { StylistAsk } from "@/components/store/StylistAsk";
import {
  getCategory,
  listCategories,
  listProducts,
  type ProductFilters,
} from "@/lib/catalog";
import { CATEGORY_COLLAGE } from "@/lib/media";

function parseFilters(
  sp: Record<string, string | string[] | undefined>,
  category?: string,
): ProductFilters {
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  return {
    q: one("q"),
    category,
    size: one("size"),
    color: one("color"),
    tryon: one("tryon"),
    sort: one("sort"),
    minPrice: one("minPrice") ? Number(one("minPrice")) : undefined,
    maxPrice: one("maxPrice") ? Number(one("maxPrice")) : undefined,
  };
}

export async function CatalogView({
  searchParams,
  categorySlug,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  categorySlug?: string;
}) {
  const category = categorySlug ? await getCategory(categorySlug) : null;
  const filters = parseFilters(searchParams, categorySlug);
  const [products, categories] = await Promise.all([
    listProducts(filters),
    listCategories(),
  ]);
  const q = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;

  return (
    <main>
      {category ? (
        <section className="relative min-h-[44svh] overflow-hidden bg-sand md:min-h-[58svh]">
          <div className="absolute inset-0 grid grid-cols-3">
            {(CATEGORY_COLLAGE[category.slug] ?? [category.image]).map((src) => (
              <div key={src} className="relative">
                <Image
                  src={src}
                  alt=""
                  fill
                  priority
                  sizes="33vw"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
          <div className="relative mx-auto flex min-h-[44svh] max-w-frame flex-col justify-end px-5 pb-10 md:min-h-[58svh] md:px-8 md:pb-16">
            <p className="eyebrow text-paper/55">The collection</p>
            <h1 className="mt-2 font-serif text-[2.75rem] leading-[0.95] tracking-tight text-paper sm:text-6xl md:text-8xl">
              {category.name}
            </h1>
            <p className="mt-3 max-w-lg font-sans text-sm font-light leading-relaxed text-paper/70 md:mt-4">
              {category.description}
            </p>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-frame px-5 pb-4 pt-12 md:px-8 md:pt-20">
          <p className="eyebrow">{q ? "Search" : "The catalog"}</p>
          <h1 className="mt-3 max-w-[14ch] font-serif text-[2.75rem] leading-[0.92] tracking-tight sm:text-5xl md:text-8xl">
            {q ? `Results for “${q}”` : "All products"}
          </h1>
          {!q && <StylistAsk />}
        </section>
      )}

      <div className="mx-auto max-w-frame px-4 py-10 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-14">
          <Suspense fallback={null}>
            <FilterSidebar
              categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
              resultCount={products.length}
            />
          </Suspense>
          <div className="min-w-0 w-full flex-1">
            <Suspense fallback={null}>
              <ShopToolbar count={products.length} />
            </Suspense>
            <p className="mb-8 font-sans text-[11px] uppercase tracking-[0.2em] text-ink/40 lg:hidden">
              {products.length} pieces
            </p>
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </main>
  );
}
