"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { RecommendedRow } from "@/components/store/RecommendedRow";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function CartPageClient() {
  const { items, setQty, remove, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="eyebrow">Bag</p>
        <p className="mt-3 font-serif text-5xl tracking-tight">Your bag is empty</p>
        <Link href="/shop" className="btn-ghost mt-10">
          Shop the edit
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid items-start gap-16 lg:grid-cols-12">
        <ul className="space-y-8 lg:col-span-8">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-5 border-b border-ink/10 pb-8"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative h-40 w-28 shrink-0 overflow-hidden bg-sand"
              >
                <Image src={item.image} alt="" fill className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <Link href={`/products/${item.slug}`} className="font-serif text-2xl tracking-tight">
                    {item.name}
                  </Link>
                  <p className="font-sans text-sm">{formatPrice(item.price * item.qty)}</p>
                </div>
                <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-ink/40">
                  {item.color} · {item.size}
                </p>
                <div className="mt-auto flex items-center gap-4 pt-4">
                  <div className="flex items-center border border-ink/15">
                    <button
                      type="button"
                      className="p-2.5"
                      onClick={() => setQty(item.productId, item.size, item.color, item.qty - 1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center font-sans text-sm">{item.qty}</span>
                    <button
                      type="button"
                      className="p-2.5"
                      onClick={() => setQty(item.productId, item.size, item.color, item.qty + 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.productId, item.size, item.color)}
                    aria-label="Remove"
                  >
                    <Trash2 size={16} className="text-ink/35" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="relative z-20 isolate h-fit bg-paper lg:col-span-4 lg:sticky lg:top-28">
          <div className="bg-mist p-8">
            <p className="eyebrow">Summary</p>
            <div className="mt-6 flex justify-between font-sans text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-3 font-sans text-xs leading-relaxed text-ink/45">
              Shipping calculated at delivery. Cash on delivery available.
            </p>
            <Link href="/checkout" className="btn-solid mt-8 w-full">
              Checkout
            </Link>
          </div>
        </aside>
      </div>
      <RecommendedRow
        mode="cart"
        cartSlugs={[...new Set(items.map((item) => item.slug))]}
        className="mt-20 border-t border-ink/10 pt-16"
      />
    </div>
  );
}
