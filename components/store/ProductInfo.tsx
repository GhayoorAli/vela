"use client";

import { Camera, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { StoreProduct } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function ProductInfo({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const sale = product.compareAt && product.compareAt > product.price;

  function add() {
    if (!color) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "",
        size,
        color: color.name,
        colorHex: color.hex,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink/45">
        {product.category.name}
        {product.tryOnLensId ? " · Live try-on" : ""}
      </p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{product.name}</h1>
      <div className="mt-3 flex items-baseline gap-3">
        <p className="font-sans text-xl">{formatPrice(product.price)}</p>
        {sale && (
          <p className="font-sans text-sm text-ink/40 line-through">
            {formatPrice(product.compareAt!)}
          </p>
        )}
      </div>
      <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-ink/70">
        {product.description}
      </p>
      <p className="mt-3 font-sans text-xs uppercase tracking-[0.16em] text-ink/45">
        {product.fabric}
        {product.inStock ? ` · ${product.stock} in stock` : " · Sold out"}
      </p>

      <div className="mt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink/50">Color</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c)}
              className={`flex items-center gap-2 border px-3 py-2 font-sans text-xs ${
                color?.name === c.name ? "border-ink" : "border-ink/15"
              }`}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: c.hex }} />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink/50">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`min-w-11 px-3 py-2 font-sans text-xs ${
                size === s ? "bg-ink text-paper" : "border border-ink/15"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <div className="flex border border-ink/15">
          <button type="button" className="px-3 py-3" onClick={() => setQty((n) => Math.max(1, n - 1))}>
            −
          </button>
          <span className="w-8 py-3 text-center font-sans text-sm">{qty}</span>
          <button type="button" className="px-3 py-3" onClick={() => setQty((n) => n + 1)}>
            +
          </button>
        </div>
        <button
          type="button"
          disabled={!product.inStock}
          onClick={add}
          className="inline-flex flex-1 items-center justify-center gap-2 bg-ink py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-paper disabled:opacity-40"
        >
          <ShoppingBag size={14} />
          {added ? "Added to bag" : "Add to bag"}
        </button>
      </div>

      {product.tryOnLensId && (
        <>
          <Link
            href={`/try-on?product=${encodeURIComponent(product.slug)}`}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-ink py-3 font-sans text-[11px] uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper"
          >
            <Camera size={14} /> Try it on live
          </Link>
          <p className="mt-2 font-sans text-[11px] leading-relaxed text-ink/45">
            Opens your camera and renders the piece on your body in real time
            — turn, move, and see how it falls before you order.
          </p>
        </>
      )}
    </div>
  );
}
