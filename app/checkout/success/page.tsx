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
    <main className="mx-auto max-w-2xl px-6 py-28 text-center">
      <p className="eyebrow">Thank you</p>
      <h1 className="mt-4 font-serif text-6xl tracking-tight md:text-7xl">
        Order placed
      </h1>
      {order && (
        <p className="mt-6 font-sans text-sm text-ink/60">
          Reference <span className="text-ink">{order}</span>
        </p>
      )}
      <p className="mx-auto mt-4 max-w-md font-sans text-sm font-light leading-relaxed text-ink/55">
        We’ll confirm by email. Pay cash on delivery or wait for transfer details.
      </p>
      <Link href="/shop" className="btn-solid mt-12">
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
