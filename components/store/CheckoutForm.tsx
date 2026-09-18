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
        <button type="button" className="link-line" onClick={() => router.push("/shop")}>
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
      className="grid gap-16 lg:grid-cols-12"
    >
      <div className="space-y-2 lg:col-span-7">
        <p className="eyebrow">01</p>
        <h2 className="font-serif text-4xl tracking-tight">Delivery</h2>
        <input name="name" required placeholder="Full name" className="field mt-6" />
        <div className="grid gap-2 sm:grid-cols-2">
          <input name="email" type="email" required placeholder="Email" className="field" />
          <input name="phone" required placeholder="Phone" className="field" />
        </div>
        <input name="address" required placeholder="Street address" className="field" />
        <input name="city" required placeholder="City" className="field" />
        <textarea name="notes" placeholder="Notes (optional)" rows={3} className="field resize-none" />

        <p className="eyebrow pt-12">02</p>
        <h2 className="font-serif text-4xl tracking-tight">Payment</h2>
        <label
          className={`mt-6 flex cursor-pointer items-start gap-4 border p-5 transition ${
            method === "cod" ? "border-ink bg-ink text-paper" : "border-ink/15"
          }`}
        >
          <input
            type="radio"
            checked={method === "cod"}
            onChange={() => setMethod("cod")}
            className="mt-1 accent-current"
          />
          <span>
            <span className="block font-sans text-sm">Cash on delivery</span>
            <span className={`font-sans text-xs ${method === "cod" ? "text-paper/60" : "text-ink/50"}`}>
              Pay when the order arrives. No card fee.
            </span>
          </span>
        </label>
        <label
          className={`mt-3 flex cursor-pointer items-start gap-4 border p-5 transition ${
            method === "transfer" ? "border-ink bg-ink text-paper" : "border-ink/15"
          }`}
        >
          <input
            type="radio"
            checked={method === "transfer"}
            onChange={() => setMethod("transfer")}
            className="mt-1 accent-current"
          />
          <span>
            <span className="block font-sans text-sm">Bank transfer</span>
            <span className={`font-sans text-xs ${method === "transfer" ? "text-paper/60" : "text-ink/50"}`}>
              We’ll email account details after you place the order.
            </span>
          </span>
        </label>
      </div>

      <aside className="lg:col-span-5">
        <div className="sticky top-28 bg-mist p-8">
          <p className="eyebrow">Your order</p>
          <h2 className="mt-2 font-serif text-3xl tracking-tight">Summary</h2>
          <ul className="mt-6 space-y-4">
            {items.map((i) => (
              <li
                key={`${i.productId}-${i.size}-${i.color}`}
                className="flex justify-between gap-3 font-sans text-sm"
              >
                <span>
                  {i.name} × {i.qty}
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-ink/40">
                    {i.color} · {i.size}
                  </span>
                </span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t border-ink/10 pt-5 font-sans text-sm">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <button type="submit" className="btn-solid mt-8 w-full">
            Place order
          </button>
        </div>
      </aside>
    </form>
  );
}
