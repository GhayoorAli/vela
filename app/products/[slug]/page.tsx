import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductInfo } from "@/components/store/ProductInfo";
import { getProductBySlug, relatedProducts } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await relatedProducts(product);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <nav className="font-sans text-[11px] uppercase tracking-[0.16em] text-ink/45">
        <Link href="/shop">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop/${product.category.slug}`}>{product.category.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <section className="mt-20 border-t border-ink/10 pt-10">
        <h2 className="font-serif text-3xl">Details</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <dt className="font-sans text-[11px] uppercase tracking-[0.16em] text-ink/45">Fabric</dt>
            <dd className="mt-1 font-sans text-sm">{product.fabric}</dd>
          </div>
          <div>
            <dt className="font-sans text-[11px] uppercase tracking-[0.16em] text-ink/45">Fit</dt>
            <dd className="mt-1 font-sans text-sm">
              {product.tryOnLensId ? (
                <Link
                  href={`/try-on?product=${encodeURIComponent(product.slug)}`}
                  className="underline underline-offset-4"
                >
                  Try it on live with your camera
                </Link>
              ) : (
                "Size guide"
              )}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-[11px] uppercase tracking-[0.16em] text-ink/45">Delivery</dt>
            <dd className="mt-1 font-sans text-sm">Cash on delivery or bank transfer</dd>
          </div>
        </dl>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
