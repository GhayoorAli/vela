import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import type { StoreProduct } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: StoreProduct }) {
  const image = product.images[0];
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
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.tryOnLensId && (
            <span className="inline-flex items-center gap-1 bg-paper/95 px-2 py-1 font-sans text-[9px] uppercase tracking-[0.16em] text-ink">
              <Camera size={10} /> Try on
            </span>
          )}
          {sale && (
            <span className="bg-rust px-2 py-1 font-sans text-[9px] uppercase tracking-[0.16em] text-paper">
              Sale
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg leading-tight">{product.name}</p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.16em] text-ink/45">
            {product.category.name}
          </p>
        </div>
        <div className="text-right font-sans text-sm">
          <p>{formatPrice(product.price)}</p>
          {sale && (
            <p className="text-ink/40 line-through">{formatPrice(product.compareAt!)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="py-20 text-center font-sans text-sm text-ink/55">
        No products match these filters.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
