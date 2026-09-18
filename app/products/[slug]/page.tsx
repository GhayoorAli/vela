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
    <main className="mx-auto max-w-frame px-4 py-8 md:px-8">
      <nav className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop/${product.category.slug}`} className="hover:text-ink">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />
        <div className="lg:sticky lg:top-28 lg:self-start lg:pt-4">
          <ProductInfo product={product} />
        </div>
      </div>

      <section className="mt-24 border-t border-ink/10 pt-14">
        <p className="eyebrow">The piece</p>
        <h2 className="mt-2 font-serif text-4xl tracking-tight">Details</h2>
        <dl className="mt-10 grid gap-10 sm:grid-cols-3">
          <div>
            <dt className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink/35">01 — Fabric</dt>
            <dd className="mt-3 font-sans text-sm leading-relaxed">{product.fabric}</dd>
          </div>
          <div>
            <dt className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink/35">02 — Fit</dt>
            <dd className="mt-3 font-sans text-sm leading-relaxed">
              {product.tryOnLensId ? (
                <Link
                  href={`/try-on?product=${encodeURIComponent(product.slug)}`}
                  className="link-line"
                >
                  Try it on live with your camera
                </Link>
              ) : (
                "Refer to the size guide and return within 30 days if needed."
              )}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink/35">03 — Delivery</dt>
            <dd className="mt-3 font-sans text-sm leading-relaxed">
              Cash on delivery or bank transfer. Dispatched from the atelier.
            </dd>
          </div>
        </dl>
      </section>

      {related.length > 0 && (
        <section className="mt-24">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-serif text-4xl tracking-tight md:text-5xl">
              You may also like
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
