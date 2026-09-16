"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { placeOrder } from "@/lib/actions";
import { useState } from "react";

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState("cod");

  if (items.length === 0) {
    return (
      <p className="font-sans text-sm text-ink/60">
        Your bag is empty.{" "}
        <button type="button" className="underline" onClick={() => router.push("/shop")}>
          Continue shopping
        </button>
      </p>
    );
  }

  return (
    <form
      action={async (formData) => {
        formData.set("items", JSON.stringify(items));
        formData.set("method", method);
        await placeOrder(formData);
      }}
      className="grid gap-10 lg:grid-cols-5"
    >
      <div className="space-y-4 lg:col-span-3">
        <h2 className="font-serif text-2xl">Delivery</h2>
        <input name="name" required placeholder="Full name" className="w-full border border-ink/15 bg-transparent px-3 py-3 font-sans text-sm" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="email" type="email" required placeholder="Email" className="border border-ink/15 bg-transparent px-3 py-3 font-sans text-sm" />
          <input name="phone" required placeholder="Phone" className="border border-ink/15 bg-transparent px-3 py-3 font-sans text-sm" />
        </div>
        <input name="address" required placeholder="Street address" className="w-full border border-ink/15 bg-transparent px-3 py-3 font-sans text-sm" />
        <input name="city" required placeholder="City" className="w-full border border-ink/15 bg-transparent px-3 py-3 font-sans text-sm" />
        <textarea name="notes" placeholder="Notes (optional)" rows={3} className="w-full border border-ink/15 bg-transparent px-3 py-3 font-sans text-sm" />

        <h2 className="pt-4 font-serif text-2xl">Payment</h2>
        <label className="flex items-start gap-3 border border-ink/15 p-4">
          <input type="radio" checked={method === "cod"} onChange={() => setMethod("cod")} />
          <span>
            <span className="block font-sans text-sm">Cash on delivery</span>
            <span className="font-sans text-xs text-ink/50">Pay when the order arrives. No card fee.</span>
          </span>
        </label>
        <label className="flex items-start gap-3 border border-ink/15 p-4">
          <input type="radio" checked={method === "transfer"} onChange={() => setMethod("transfer")} />
          <span>
            <span className="block font-sans text-sm">Bank transfer</span>
            <span className="font-sans text-xs text-ink/50">We’ll email account details after you place the order.</span>
          </span>
        </label>
      </div>

      <aside className="lg:col-span-2">
        <div className="border border-ink/10 p-5">
          <h2 className="font-serif text-2xl">Order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between gap-3 font-sans text-sm">
                <span>
                  {i.name} × {i.qty}
                  <span className="block text-[11px] uppercase tracking-wider text-ink/40">
                    {i.color} · {i.size}
                  </span>
                </span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-sans text-sm">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <button
            type="submit"
            className="mt-5 w-full bg-ink py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-paper"
          >
            Place order
          </button>
        </div>
      </aside>
    </form>
  );
}
