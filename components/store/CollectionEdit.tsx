"use client";

import { useState } from "react";
import type { StoreProduct } from "@/lib/types";
import { ProductCard } from "@/components/store/ProductCard";

const tabs = [
  { slug: "all", label: "All pieces" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "tees", label: "T-shirts" },
  { slug: "trousers", label: "Trousers" },
  { slug: "eyewear", label: "Eyewear" },
];

export function CollectionEdit({ products }: { products: StoreProduct[] }) {
  const [active, setActive] = useState("all");
  const visible = (
    active === "all"
      ? products
      : products.filter((p) => p.category.slug === active)
  ).slice(0, 4);
  return (
    <div>
      <div
        className="edit-controls"
        role="group"
        aria-label="Filter the collection"
      >
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            aria-pressed={active === tab.slug}
            onClick={() => setActive(tab.slug)}
            className={active === tab.slug ? "edit-tab is-active" : "edit-tab"}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="collection-grid" aria-live="polite">
        {visible.length ? (
          visible.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="py-8 text-sm">
            This collection is being refreshed. Explore another category.
          </p>
        )}
      </div>
    </div>
  );
}
