import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductInfo } from "@/components/store/ProductInfo";
import { RecommendedRow } from "@/components/store/RecommendedRow";
import { getProductBySlug } from "@/lib/catalog";

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

  return (
    <main>
      <div className="mx-auto max-w-frame px-5 pb-6 pt-6 md:px-8 md:pt-10">
        <nav className="overflow-hidden font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40">
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

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-x-14 xl:gap-x-20">
          <div className="lg:col-span-5 xl:col-span-5">
            <ProductGallery images={product.images} name={product.name} />
          </div>
          <div className="lg:sticky lg:top-28 lg:col-span-7 lg:max-w-xl lg:pt-2 xl:col-span-6">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-frame border-t border-ink/10 px-5 py-16 md:px-8 md:py-20">
        <p className="eyebrow">The piece</p>
        <h2 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">Details</h2>
        <dl className="mt-10 grid gap-10 sm:grid-cols-3">
          <div>
            <dt className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink/35">
              01 — Fabric
            </dt>
            <dd className="mt-3 font-sans text-sm leading-relaxed">{product.fabric}</dd>
          </div>
          <div>
            <dt className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink/35">
              02 — Fit
            </dt>
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
            <dt className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink/35">
              03 — Delivery
            </dt>
            <dd className="mt-3 font-sans text-sm leading-relaxed">
              Cash on delivery or bank transfer. Dispatched from the atelier.
            </dd>
          </div>
        </dl>
      </section>

      <div className="mx-auto max-w-frame px-5 pb-8 md:px-8">
        <RecommendedRow mode="product" productSlug={product.slug} />
      </div>
    </main>
  );
}
