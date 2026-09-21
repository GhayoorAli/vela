"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { StoreProduct } from "@/lib/types";

export function Lookbook({ products }: { products: StoreProduct[] }) {
  const router = useRouter();
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
  });
  const [grabbing, setGrabbing] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("scroll", updateEdges);
      el.removeEventListener("wheel", onWheel);
      ro.disconnect();
    };
  }, [updateEdges, products.length]);

  function cardWidth() {
    const el = scroller.current;
    const card = el?.querySelector<HTMLElement>("[data-look]");
    return (card?.offsetWidth ?? 280) + 16;
  }

  function scrollByCard(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollLeft += dir * cardWidth();
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    if ((e.target as HTMLElement).closest("button")) return;
    const el = scroller.current;
    if (!el) return;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startScroll: el.scrollLeft,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = scroller.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) < 8) return;
    if (!drag.current.moved) {
      drag.current.moved = true;
      el.setPointerCapture(e.pointerId);
      setGrabbing(true);
    }
    el.scrollLeft = drag.current.startScroll - dx;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const wasMoved = drag.current.moved;
    drag.current.active = false;
    setGrabbing(false);
    try {
      scroller.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    window.setTimeout(() => {
      if (drag.current.moved === wasMoved) drag.current.moved = false;
    }, 80);
  }

  if (products.length === 0) return null;

  return (
    <section className="pb-6 pt-4">
      <div className="mx-auto flex max-w-frame items-end justify-between px-6 md:px-8">
        <div>
          <p className="eyebrow">Lookbook</p>
          <h2 className="mt-2 font-serif text-4xl tracking-tight md:text-6xl">
            The season,
            <span className="italic"> in stills.</span>
          </h2>
        </div>
        <p className="hidden font-sans text-[10px] uppercase tracking-[0.22em] text-ink/35 md:block">
          Drag or scroll to look through
        </p>
      </div>

      <div className="relative mt-10">
        <div
          ref={scroller}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`flex cursor-grab gap-3 overflow-x-auto overscroll-x-contain pb-4 no-scrollbar md:gap-4 ${
            grabbing ? "cursor-grabbing select-none" : ""
          }`}
        >
          <div aria-hidden className="w-6 shrink-0 md:w-8" />
          {products.map((p, i) => (
            <Link
              key={p.id}
              data-look
              href={`/products/${p.slug}`}
              draggable={false}
              onClick={(e) => {
                e.preventDefault();
                if (drag.current.moved) return;
                router.push(`/products/${p.slug}`);
              }}
              className="shine group relative w-[72vw] shrink-0 overflow-hidden bg-sand sm:w-[46vw] md:w-[30vw] lg:w-[22vw]"
            >
              <div className="relative aspect-[3/4]">
                {p.images[0] && (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    draggable={false}
                    sizes="30vw"
                    className="pointer-events-none object-contain transition duration-[1.1s] ease-expo group-hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-paper md:p-5">
                  <div>
                    <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-paper/55">
                      {String(i + 1).padStart(2, "0")} — {p.category.name}
                    </p>
                    <p className="mt-1 font-serif text-2xl leading-none tracking-tight transition duration-500 group-hover:italic">
                      {p.name}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <div aria-hidden className="w-6 shrink-0 md:w-8" />
        </div>

        <button
          type="button"
          aria-label="Previous stills"
          disabled={!canPrev}
          onClick={() => scrollByCard(-1)}
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper/90 text-ink shadow-sm backdrop-blur-sm transition hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          aria-label="Next stills"
          disabled={!canNext}
          onClick={() => scrollByCard(1)}
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper/90 text-ink shadow-sm backdrop-blur-sm transition hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
