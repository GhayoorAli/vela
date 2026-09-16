import { Suspense } from "react";
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
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink/45">
        {category ? category.name : q ? `Search` : "Shop"}
      </p>
      <h1 className="mt-2 font-serif text-4xl md:text-6xl">
        {category ? category.name : q ? `Results for “${q}”` : "All products"}
      </h1>
      {category && (
        <p className="mt-3 max-w-xl font-sans text-sm text-ink/60">{category.description}</p>
      )}

      <div className="mt-10 flex items-start gap-12">
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
          <p className="mb-6 font-sans text-sm text-ink/50 lg:hidden">{products.length} pieces</p>
          <ProductGrid products={products} />
        </div>
      </div>
    </main>
  );
}
