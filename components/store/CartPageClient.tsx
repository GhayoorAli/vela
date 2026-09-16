"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function CartPageClient() {
  const { items, setQty, remove, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-3xl">Your bag is empty</p>
        <Link href="/shop" className="mt-6 inline-block border border-ink px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em]">
          Shop the edit
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-3">
      <ul className="space-y-6 lg:col-span-2">
        {items.map((item) => (
          <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 border-b border-ink/10 pb-6">
            <Link href={`/products/${item.slug}`} className="relative h-32 w-24 shrink-0 overflow-hidden bg-sand">
              <Image src={item.image} alt="" fill className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <Link href={`/products/${item.slug}`} className="font-serif text-xl">
                  {item.name}
                </Link>
                <p className="font-sans text-sm">{formatPrice(item.price * item.qty)}</p>
              </div>
              <p className="mt-1 font-sans text-[11px] uppercase tracking-wider text-ink/45">
                {item.color} · {item.size}
              </p>
              <div className="mt-auto flex items-center gap-4 pt-4">
                <div className="flex items-center border border-ink/15">
                  <button type="button" className="p-2" onClick={() => setQty(item.productId, item.size, item.color, item.qty - 1)}>
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center font-sans text-sm">{item.qty}</span>
                  <button type="button" className="p-2" onClick={() => setQty(item.productId, item.size, item.color, item.qty + 1)}>
                    <Plus size={12} />
                  </button>
                </div>
                <button type="button" onClick={() => remove(item.productId, item.size, item.color)} aria-label="Remove">
                  <Trash2 size={16} className="text-ink/40" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit border border-ink/10 p-6">
        <div className="flex justify-between font-sans text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-2 font-sans text-xs text-ink/50">Shipping calculated at delivery. Cash on delivery available.</p>
        <Link href="/checkout" className="mt-6 block bg-ink py-3 text-center font-sans text-[11px] uppercase tracking-[0.2em] text-paper">
          Checkout
        </Link>
      </aside>
    </div>
  );
}
