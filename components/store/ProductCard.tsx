import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Scan } from "lucide-react";
import type { StoreProduct } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({
  product,
  large = false,
}: {
  product: StoreProduct;
  large?: boolean;
}) {
  const sale = product.compareAt && product.compareAt > product.price;
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`studio-product${large ? " studio-product-large" : ""}`}
    >
      <div className="studio-product-image">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={
              large
                ? "(min-width: 768px) 50vw, 100vw"
                : "(min-width: 1024px) 25vw, 50vw"
            }
            className="object-contain"
          />
        )}
        <div className="product-badges">
          {product.tryOnLensId && (
            <span>
              <Scan size={12} /> LIVE TRY-ON
            </span>
          )}
          {sale && <span className="product-sale">Sale</span>}
        </div>
        <span className="product-open">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="studio-product-info">
        <div>
          <p className="studio-product-category">{product.category.name}</p>
          <h3>{product.name}</h3>
        </div>
        <div className="studio-product-price">
          <span>{formatPrice(product.price)}</span>
          {sale && <s>{formatPrice(product.compareAt!)}</s>}
        </div>
      </div>
      <div className="studio-product-bottom">
        <span>{product.fabric || "View details"}</span>
        <div className="product-swatches">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              title={c.name}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: StoreProduct[] }) {
  if (!products.length)
    return (
      <div className="py-24 text-center">
        <p className="text-3xl font-medium tracking-tight">
          No matching products
        </p>
        <p className="mt-3 text-sm text-ink/60">
          No pieces match these filters. Try adjusting your selection.
        </p>
      </div>
    );
  return (
    <div className="catalog-product-grid grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
