"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

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
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button, input, [tabindex="0"]');
      if (!nodes?.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [open]);

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
              aria-pressed={selected.size === s}
              onClick={() => setParam("size", selected.size === s ? "" : s)}
              className={`px-2.5 py-1.5 font-sans text-[12px] transition ${
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
              aria-pressed={selected.color === c}
              onClick={() => setParam("color", selected.color === c ? "" : c)}
              className={`px-2.5 py-1.5 font-sans text-[12px] transition ${
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
            aria-label="Minimum price"
            placeholder="Min"
            key={`min-${selected.min}`}
            defaultValue={selected.min}
            className="field"
            onBlur={(e) => setParam("minPrice", e.target.value)}
          />
          <input
            type="number"
            aria-label="Maximum price"
            placeholder="Max"
            key={`max-${selected.max}`}
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
        className="link-line font-sans text-[12px] uppercase tracking-[0.08em] text-ink/40"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <div className="catalog-filter-controls">
      <div className="relative z-20 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 border border-ink/15 px-4 py-2.5 font-sans text-[12px] uppercase tracking-[0.08em]"
        >
          <SlidersHorizontal size={16} strokeWidth={1.5} /> Filters{[selected.size, selected.color, selected.tryon, selected.min, selected.max].filter(Boolean).length > 0 && <span className="catalog-filter-count">{[selected.size, selected.color, selected.tryon, selected.min, selected.max].filter(Boolean).length}</span>}
        </button>
        <SortSelect value={selected.sort} onChange={(v) => setParam("sort", v)} />
      </div>


      {open && (
        <div className="catalog-filter-overlay fixed inset-0 z-[90]">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div role="dialog" aria-modal="true" aria-label="Product filters" ref={panelRef} className="catalog-filter-panel absolute right-0 top-0 h-full w-[min(90vw,28rem)] overflow-y-auto bg-paper p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(1.75rem+env(safe-area-inset-top))]">
            <div className="mb-8 flex items-center justify-between">
              <p className="font-serif text-3xl">Filters</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {filters}
            <button type="button" onClick={() => setOpen(false)} className="catalog-filter-done">Show {resultCount} {resultCount === 1 ? "result" : "results"}</button>
          </div>
        </div>
      )}

      <p className="sr-only">{resultCount} {resultCount === 1 ? "result" : "results"}</p>
    </div>
  );
}

export function SortSelect({
  value,
  onChange,
  align = "right",
}: {
  value: string;
  onChange: (v: string) => void;
  align?: "left" | "right";
}) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});

  const label = SORTS.find((s) => s.value === value)?.label ?? "Featured";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    function place() {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const r = trigger.getBoundingClientRect();
      const width = Math.max(r.width, 200);
      const left =
        align === "right"
          ? Math.min(Math.max(8, r.right - width), window.innerWidth - width - 8)
          : Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
      const spaceBelow = window.innerHeight - r.bottom;
      const openUp = spaceBelow < 220 && r.top > spaceBelow;
      setMenuStyle({
        position: "fixed",
        top: openUp ? undefined : r.bottom + 8,
        bottom: openUp ? window.innerHeight - r.top + 8 : undefined,
        left,
        width,
        zIndex: 80,
      });
    }

    place();
    const onReposition = () => place();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, align]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menu =
    open && mounted
      ? createPortal(
          <div
            ref={menuRef}
            id={listId}
            role="listbox"
            aria-label="Sort products"
            style={menuStyle}
            className="border border-ink/10 bg-paper py-1.5 shadow-[0_18px_50px_rgba(12,11,10,0.18)]"
          >
            {SORTS.map((s) => {
              const active = s.value === value;
              return (
                <button
                  key={s.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(s.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left font-sans text-[12px] uppercase tracking-[0.08em] transition ${
                    active ? "bg-ink text-paper" : "text-ink/70 hover:bg-sand hover:text-ink"
                  }`}
                >
                  {s.label}
                  {active ? <Check size={12} strokeWidth={1.75} /> : null}
                </button>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 font-sans text-[12px] uppercase tracking-[0.08em] text-ink outline-none"
      >
        {label}
        <ChevronDown
          size={13}
          strokeWidth={1.75}
          className={`transition duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {menu}
    </div>
  );
}

export function ShopToolbar({ count }: { count: number }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sort = params.get("sort") || "featured";

  return (
    <div className="mb-10 hidden items-end justify-between border-b border-ink/10 pb-4 lg:flex">
      <p className="font-sans text-[12px] uppercase tracking-[0.08em] text-ink/40">
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
