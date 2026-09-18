import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import type { StoreProduct } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: StoreProduct }) {
  const image = product.images[0];
  const hover = product.images[1];
  const sale = product.compareAt && product.compareAt > product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={`object-cover transition duration-700 ease-expo group-hover:scale-[1.04] ${
              hover ? "group-hover:opacity-0" : ""
            }`}
          />
        )}
        {hover && (
          <Image
            src={hover}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover opacity-0 transition duration-700 ease-expo group-hover:scale-[1.04] group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.tryOnLensId && (
            <span className="inline-flex items-center gap-1 bg-paper/95 px-2 py-1 font-sans text-[9px] uppercase tracking-[0.18em] text-ink">
              <Camera size={10} strokeWidth={1.75} /> Try on
            </span>
          )}
          {sale && (
            <span className="bg-rust px-2 py-1 font-sans text-[9px] uppercase tracking-[0.18em] text-paper">
              Sale
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between px-4 pb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-paper opacity-0 transition duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100">
          <span>View</span>
          {product.tryOnLensId && <span>Live fit</span>}
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-[1.35rem] leading-[1.15] tracking-tight">
            {product.name}
          </p>
          <p className="mt-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40">
            {product.category.name}
          </p>
        </div>
        <div className="pt-1 text-right font-sans text-[13px] tracking-wide">
          <p>{formatPrice(product.price)}</p>
          {sale && (
            <p className="text-ink/35 line-through">
              {formatPrice(product.compareAt!)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-3xl">Nothing in this edit</p>
        <p className="mt-3 font-sans text-sm text-ink/50">
          No products match these filters.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
