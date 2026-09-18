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
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2 className="mt-1 font-serif text-3xl tracking-tight">Bag</h2>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="pt-16 text-center">
              <p className="font-serif text-3xl tracking-tight">Your bag is empty</p>
              <p className="mt-2 font-sans text-sm text-ink/50">
                The edit is waiting.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-solid mt-8"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-sand">
                    <Image src={item.image} alt="" fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="font-serif text-xl leading-tight tracking-tight"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-ink/40">
                      {item.color} · {item.size}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
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
                      className="mt-2 font-sans text-[10px] uppercase tracking-[0.18em] text-ink/35 hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5">
            <div className="mb-1 flex justify-between font-sans text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-5 font-sans text-[11px] text-ink/40">
              Shipping calculated at delivery.
            </p>
            <Link href="/checkout" onClick={onClose} className="btn-solid w-full">
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="mt-3 block py-2 text-center font-sans text-[11px] uppercase tracking-[0.2em] text-ink/50"
            >
              View bag
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
