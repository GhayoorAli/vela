import { Suspense } from "react";
import Image from "next/image";
import { FilterSidebar, ShopToolbar } from "@/components/store/Filters";
import { ProductGrid } from "@/components/store/ProductCard";
import {
  getCategory,
  listCategories,
  listProducts,
  type ProductFilters,
} from "@/lib/catalog";

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
        <section className="relative h-[42vh] min-h-[280px] overflow-hidden bg-ink">
          <Image
            src={category.image}
            alt=""
            fill
            priority
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
          <div className="relative mx-auto flex h-full max-w-frame flex-col justify-end px-6 pb-10 md:px-8">
            <p className="eyebrow text-paper/55">The collection</p>
            <h1 className="mt-2 font-serif text-5xl tracking-tight text-paper md:text-7xl">
              {category.name}
            </h1>
            <p className="mt-3 max-w-lg font-sans text-sm font-light text-paper/70">
              {category.description}
            </p>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-frame px-6 pb-4 pt-14 md:px-8">
          <p className="eyebrow">{q ? "Search" : "The catalog"}</p>
          <h1 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
            {q ? `Results for “${q}”` : "All products"}
          </h1>
        </section>
      )}

      <div className="mx-auto max-w-frame px-4 py-10 md:px-8">
        <div className="flex items-start gap-14">
          <Suspense fallback={null}>
            <FilterSidebar
              categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
              resultCount={products.length}
            />
          </Suspense>
          <div className="min-w-0 flex-1">
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
