"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useRef } from "react";
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
  const dialog = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const nodes = dialog.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!nodes?.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close bag"
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        className="studio-bag-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper"
      >
        <div className="bag-drawer-heading flex items-center justify-between px-6 py-7">
          <div>
            <h2
              id="bag-title"
              className="mt-2 text-3xl font-medium tracking-tight"
            >
              Your shopping bag
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="min-h-11 min-w-11"
            onClick={onClose}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="pt-16 text-center">
              <p className="font-serif text-3xl tracking-tight">
                Your bag is empty
              </p>
              <p className="mt-2 font-sans text-sm text-ink/50">
                Add items from the collection to get started.
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
                <li
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4"
                >
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-sand">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="font-serif text-xl leading-tight tracking-tight"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 font-sans text-[12px] uppercase tracking-[0.08em] text-ink/40">
                      {item.color} · {item.size}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-ink/15">
                        <button
                          type="button"
                          className="p-1.5"
                          aria-label="Decrease"
                          onClick={() =>
                            setQty(
                              item.productId,
                              item.size,
                              item.color,
                              item.qty - 1,
                            )
                          }
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-sans text-xs">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          className="p-1.5"
                          aria-label="Increase"
                          onClick={() =>
                            setQty(
                              item.productId,
                              item.size,
                              item.color,
                              item.qty + 1,
                            )
                          }
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-sans text-sm">
                        {formatPrice(item.price * item.qty)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        remove(item.productId, item.size, item.color)
                      }
                      className="mt-2 font-sans text-[12px] uppercase tracking-[0.08em] text-ink/35 hover:text-ink"
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
            <p className="mb-5 font-sans text-[12px] text-ink/40">
              Shipping calculated at delivery.
            </p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-solid w-full"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="mt-3 block py-2 text-center font-sans text-[12px] uppercase tracking-[0.08em] text-ink/50"
            >
              View bag
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
