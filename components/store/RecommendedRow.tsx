"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { RecommendMode, RecommendResponse } from "@/lib/types";
import { formatPrice } from "@/lib/format";

type Props = {
  mode: RecommendMode;
  productSlug?: string;
  cartSlugs?: string[];
  query?: string;
  className?: string;
};

export function RecommendedRow({
  mode,
  productSlug,
  cartSlugs,
  query,
  className,
}: Props) {
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (mode === "cart" && !cartSlugs?.length) {
      setData(null);
      return;
    }
    if (mode === "stylist" && !query?.trim()) {
      setData(null);
      return;
    }

    const controller = new AbortController();
    setFailed(false);
    setData(null);

    void fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ mode, productSlug, cartSlugs, query }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("recommend failed");
        return (await res.json()) as RecommendResponse;
      })
      .then((json) => {
        if (json.picks?.length) setData(json);
        else setFailed(true);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setFailed(true);
      });

    return () => controller.abort();
  }, [mode, productSlug, query, cartSlugs?.join("|"), retry]);

  if (mode === "cart" && !cartSlugs?.length) return null;
  if (failed && !data)
    return (
      <section className="recommendation-error" role="alert">
        <Sparkles size={20} />
        <div>
          <h2>We couldn’t load your suggestions.</h2>
          <p>Try again, or describe a different look.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFailed(false);
            setRetry((value) => value + 1);
          }}
        >
          Try again
        </button>
      </section>
    );

  const picks = data?.picks ?? [];

  return (
    <section
      className={`recommended-section ${className ?? "mt-24"}`}
      aria-label="Styling suggestions"
      aria-busy={!data}
    >
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div aria-live="polite">
          <p className="eyebrow inline-flex items-center gap-2">
            {data?.source === "ai" && (
              <Sparkles size={11} strokeWidth={1.75} className="text-rust" />
            )}
            {data?.eyebrow ?? "OUTFIT SUGGESTIONS"}
          </p>
          <h2 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">
            {data?.headline ?? "Putting your look together…"}
          </h2>
        </div>
        {data && (
          <p className="font-sans text-[12px] uppercase tracking-[0.08em] text-ink/35">
            {data.source === "ai"
              ? "AI STYLED FROM THE COLLECTION"
              : "SELECTED FROM THE COLLECTION"}
          </p>
        )}
      </div>

      {!data ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-sand" />
              <div className="mt-4 h-5 w-3/4 bg-sand" />
              <div className="mt-2 h-3 w-1/2 bg-sand" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
          {picks.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group block"
            >
              <div className="shine relative aspect-[3/4] overflow-hidden bg-sand">
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-contain transition duration-700 ease-expo group-hover:scale-[1.04]"
                  />
                )}
                {p.tryOn && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 bg-paper/95 px-2 py-1 font-sans text-[12px] uppercase tracking-[0.08em] text-ink">
                    <Camera size={10} strokeWidth={1.75} /> Try on
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <p className="font-serif text-[1.35rem] leading-[1.15] tracking-tight transition duration-500 group-hover:italic">
                  {p.name}
                </p>
                <p className="pt-1 font-sans text-[13px] tracking-wide">
                  {formatPrice(p.price)}
                </p>
              </div>
              <p className="mt-2 font-sans text-sm font-normal leading-relaxed text-ink/55">
                {p.reason}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
