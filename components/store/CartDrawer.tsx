"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, setQty, remove, subtotal } = useCart();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close bag"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-none">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-serif text-2xl">Bag</h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="pt-10 text-center font-sans text-sm text-ink/55">
              Your bag is empty.
            </p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-sand">
                    <Image src={item.image} alt="" fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.slug}`} onClick={onClose} className="font-serif text-lg leading-tight">
                      {item.name}
                    </Link>
                    <p className="mt-1 font-sans text-[11px] uppercase tracking-wider text-ink/50">
                      {item.color} · {item.size}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-ink/15">
                        <button
                          type="button"
                          className="p-1.5"
                          aria-label="Decrease"
                          onClick={() => setQty(item.productId, item.size, item.color, item.qty - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-sans text-xs">{item.qty}</span>
                        <button
                          type="button"
                          className="p-1.5"
                          aria-label="Increase"
                          onClick={() => setQty(item.productId, item.size, item.color, item.qty + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-sans text-sm">{formatPrice(item.price * item.qty)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.productId, item.size, item.color)}
                      className="mt-1 font-sans text-[10px] uppercase tracking-wider text-ink/40"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-ink/10 px-5 py-4">
          <div className="mb-3 flex justify-between font-sans text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={onClose}
            className="block bg-ink py-3 text-center font-sans text-[11px] uppercase tracking-[0.2em] text-paper"
          >
            Checkout
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="mt-2 block py-2 text-center font-sans text-[11px] uppercase tracking-[0.18em] text-ink/60"
          >
            View bag
          </Link>
        </div>
      </aside>
    </div>
  );
}
