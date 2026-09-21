import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import type { StoreProduct } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({
  product,
  large = false,
}: {
  product: StoreProduct;
  large?: boolean;
}) {
  const image = product.images[0];
  const hover = product.images[1];
  const sale = product.compareAt && product.compareAt > product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="shine relative aspect-[3/4] overflow-hidden bg-sand">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
            className={`object-contain transition duration-[1100ms] ease-expo group-hover:scale-[1.03] ${
              hover ? "group-hover:opacity-0" : ""
            }`}
          />
        )}
        {hover && (
          <Image
            src={hover}
            alt=""
            fill
            sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
            className="object-contain opacity-0 transition duration-[1100ms] ease-expo group-hover:scale-[1.03] group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition duration-700 group-hover:opacity-100" />
        <span className="pointer-events-none absolute inset-3 border border-paper/0 transition duration-700 ease-expo group-hover:border-paper/45" />
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
        <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between px-4 pb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-paper opacity-0 transition duration-700 ease-expo group-hover:translate-y-0 group-hover:opacity-100">
          <span>View the piece</span>
          {product.tryOnLensId && <span>Live fit</span>}
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p
            className={`font-serif leading-[1.12] tracking-tight transition duration-500 ease-expo group-hover:italic ${
              large ? "text-xl sm:text-[1.65rem] md:text-3xl" : "text-lg sm:text-[1.35rem]"
            }`}
          >
            {product.name}
          </p>
          <p className="mt-1.5 font-sans text-[9px] uppercase tracking-[0.16em] text-ink/40 sm:text-[10px] sm:tracking-[0.2em]">
            {product.category.name}
            {product.fabric ? ` · ${product.fabric}` : ""}
          </p>
          {product.colors.length > 0 && (
            <div className="mt-2.5 flex gap-1.5">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-ink/10 transition duration-500 group-hover:scale-110"
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 pt-1 text-right font-sans text-xs tracking-wide sm:text-[13px]">
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
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 sm:gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
