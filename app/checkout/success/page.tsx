"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useCart } from "@/lib/cart";

function SuccessBody() {
  const params = useSearchParams();
  const { clear } = useCart();
  const order = params.get("order");

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink/45">Thank you</p>
      <h1 className="mt-3 font-serif text-5xl">Order placed</h1>
      {order && (
        <p className="mt-4 font-sans text-sm text-ink/65">
          Reference <span className="text-ink">{order}</span>
        </p>
      )}
      <p className="mt-4 font-sans text-sm leading-relaxed text-ink/60">
        We’ll confirm by email. Pay cash on delivery or wait for transfer details.
      </p>
      <Link
        href="/shop"
        className="mt-10 inline-block bg-ink px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-paper"
      >
        Continue shopping
      </Link>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessBody />
    </Suspense>
  );
}
