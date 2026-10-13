import { Suspense } from "react";
import Image from "next/image";
import { FilterSidebar } from "@/components/store/Filters";
import { ProductGrid } from "@/components/store/ProductCard";
import { ShoppingStudio } from "@/components/store/ShoppingStudio";
import {
  getCategory,
  listCategories,
  listProducts,
  type ProductFilters,
} from "@/lib/catalog";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Scan } from "lucide-react";

const EDITORIAL: Record<string, string> = {
  hoodies: "/editorial/portrait-v3.webp",
  tees: "/editorial/courtyard.webp",
  trousers: "/editorial/denim-v3.webp",
  eyewear: "/editorial/eyewear-v3.webp",
};
const CATEGORY_COPY: Record<string, string> = {
  hoodies:
    "Fleece hoodies in a range of colours.",
  tees: "Browse T-shirts by colour and size.",
  trousers:
    "Browse jeans and chinos.",
  eyewear:
    "Browse sunglasses and frames.",
};

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

  const heroImage = category ? (EDITORIAL[category.slug] ?? category.image) : "/editorial/look-v3.webp";
  return (
    <main className="studio-catalog catalog-redesign">
      <section className={`catalog-cover ${category ? `catalog-cover-${category.slug}` : "catalog-cover-all"}`}>
        <div className="catalog-cover-copy">
          <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            {category ? <><Link href="/shop">Collection</Link><span>/</span><span>{category.name}</span></> : <span>{q ? "Search" : "Collection"}</span>}
          </nav>
          <h1>{q ? `Results for “${q}”` : category ? category.name : <>The<br /><em>collection.</em></>}</h1>
          <p>{category ? CATEGORY_COPY[category.slug] ?? category.description : q ? "Browse the matching pieces below." : "Hoodies, T-shirts, trousers and eyewear."}</p>
          <div className="catalog-cover-actions">
            <a href="#catalog-products">Browse pieces <ArrowUpRight size={17} /></a>
            <span>{products.length} {products.length === 1 ? "piece" : "pieces"}</span>
          </div>
        </div>
        <div className="catalog-cover-photo">
          <Image src={heroImage} alt={category ? `${category.name} collection` : "Ivory hoodie and indigo jeans"} fill priority sizes="(min-width: 900px) 52vw, 100vw" />
          <div className="catalog-photo-links">
            <a href="#ai-stylist"><Sparkles size={16} /> AI stylist <ArrowUpRight size={15} /></a>
            <Link href="/try-on"><Scan size={16} /> AR try-on <ArrowUpRight size={15} /></Link>
          </div>
        </div>
      </section>
      <nav className="catalog-category-rail" aria-label="Shop categories">
        <Link href="/shop" className={!category ? "is-active" : ""} aria-current={!category ? "page" : undefined}>All pieces <ArrowUpRight size={16} /></Link>
        {categories.map(c => <Link key={c.slug} href={`/shop/${c.slug}`} className={category?.slug === c.slug ? "is-active" : ""} aria-current={category?.slug === c.slug ? "page" : undefined}>
          <span className="catalog-category-thumb"><Image src={EDITORIAL[c.slug] ?? c.image} alt="" fill sizes="52px" /></span>
          {c.name}<ArrowUpRight size={16} />
        </Link>)}
      </nav>
      <ShoppingStudio variant="catalog" />
      <section id="catalog-products" className="catalog-products" aria-label="Products">
        <div className="catalog-browse-bar">
          <div><h2>{q ? "Search results" : category ? `Shop ${category.name.toLowerCase()}` : "All pieces"}</h2><span>{products.length} {products.length === 1 ? "result" : "results"}</span></div>
          <Suspense fallback={null}><FilterSidebar categories={categories.map(c => ({slug:c.slug,name:c.name}))} resultCount={products.length} /></Suspense>
        </div>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
