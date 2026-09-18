"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

const SIZES = ["XS", "S", "M", "L", "XL", "28", "30", "32", "34", "36", "One size"];
const COLORS = [
  "Rust",
  "Navy",
  "Ivory",
  "Moss",
  "Ink",
  "Black",
  "Indigo",
  "Camel",
  "White",
  "Stone",
];
const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function FilterSidebar({
  categories,
  resultCount,
}: {
  categories: { slug: string; name: string }[];
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => ({
      size: params.get("size") || "",
      color: params.get("color") || "",
      tryon: params.get("tryon") || "",
      sort: params.get("sort") || "featured",
      min: params.get("minPrice") || "",
      max: params.get("maxPrice") || "",
    }),
    [params],
  );

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function clear() {
    const q = params.get("q");
    router.push(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname);
  }

  const filters = (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Category</p>
        <ul className="mt-4 space-y-2.5">
          <li>
            <a
              href="/shop"
              className={`font-sans text-sm ${
                pathname === "/shop" && !params.get("q") ? "text-ink" : "text-ink/50 hover:text-ink"
              }`}
            >
              All
            </a>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <a
                href={`/shop/${c.slug}`}
                className={`font-sans text-sm ${
                  pathname.endsWith(c.slug) ? "text-ink" : "text-ink/50 hover:text-ink"
                }`}
              >
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="eyebrow">Size</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setParam("size", selected.size === s ? "" : s)}
              className={`px-2.5 py-1.5 font-sans text-[11px] transition ${
                selected.size === s
                  ? "bg-ink text-paper"
                  : "border border-ink/15 text-ink/70 hover:border-ink/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">Color</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setParam("color", selected.color === c ? "" : c)}
              className={`px-2.5 py-1.5 font-sans text-[11px] transition ${
                selected.color === c
                  ? "bg-ink text-paper"
                  : "border border-ink/15 text-ink/70 hover:border-ink/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">Price</p>
        <div className="mt-4 flex gap-4">
          <input
            type="number"
            placeholder="Min"
            defaultValue={selected.min}
            className="field"
            onBlur={(e) => setParam("minPrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={selected.max}
            className="field"
            onBlur={(e) => setParam("maxPrice", e.target.value)}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 font-sans text-sm">
        <input
          type="checkbox"
          checked={selected.tryon === "1"}
          onChange={(e) => setParam("tryon", e.target.checked ? "1" : "")}
          className="accent-ink"
        />
        Live try-on only
      </label>

      <button
        type="button"
        onClick={clear}
        className="link-line font-sans text-[11px] uppercase tracking-[0.18em] text-ink/40"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 border border-ink/15 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em]"
        >
          <SlidersHorizontal size={14} strokeWidth={1.5} /> Filters
        </button>
        <SortSelect value={selected.sort} onChange={(v) => setParam("sort", v)} />
      </div>

      <aside className="hidden w-56 shrink-0 lg:block">{filters}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-paper p-7">
            <div className="mb-8 flex items-center justify-between">
              <p className="font-serif text-3xl">Filters</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {filters}
          </div>
        </div>
      )}

      <p className="sr-only">{resultCount} results</p>
    </>
  );
}

export function SortSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-0 bg-transparent font-sans text-[11px] uppercase tracking-[0.16em] outline-none"
    >
      {SORTS.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

export function ShopToolbar({ count }: { count: number }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sort = params.get("sort") || "featured";

  return (
    <div className="mb-10 hidden items-end justify-between border-b border-ink/10 pb-4 lg:flex">
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ink/40">
        {count} pieces
      </p>
      <SortSelect
        value={sort}
        onChange={(v) => {
          const next = new URLSearchParams(params.toString());
          if (v === "featured") next.delete("sort");
          else next.set("sort", v);
          const qs = next.toString();
          router.push(qs ? `${pathname}?${qs}` : pathname);
        }}
      />
    </div>
  );
}
