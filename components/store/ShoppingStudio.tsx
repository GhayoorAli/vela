"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Scan, Sparkles } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { RecommendedRow } from "@/components/store/RecommendedRow";

const IDEAS = [
  {
    label: "Weekend layers",
    query: "A relaxed weekend look with a hoodie, jeans, and sunglasses",
  },
  {
    label: "Warm neutrals",
    query: "An ivory hoodie with sand chinos and tortoise frames",
  },
  {
    label: "A darker palette",
    query: "A black hoodie, dark trousers, and sunglasses",
  },
];

type Props = {
  variant?: "home" | "catalog" | "standalone";
  initialBrief?: string;
};

export function ShoppingStudio({ variant = "home", initialBrief = "" }: Props) {
  const inputId = useId();
  const [draft, setDraft] = useState(initialBrief);
  const [request, setRequest] = useState<{ query: string; id: number } | null>(
    null,
  );
  const results = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!request) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    results.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [request]);

  function styleLook(query: string) {
    const value = query.trim();
    if (!value) return;
    setDraft(value);
    setRequest((previous) => ({ query: value, id: (previous?.id ?? 0) + 1 }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    styleLook(draft);
  }

  return (
    <section
      id="shopping-studio"
      className={`shopping-studio shopping-studio-${variant}`}
      aria-labelledby="shopping-studio-title"
    >
      {variant !== "standalone" && (
        <div className="shopping-studio-heading">
          <div>
            <h2
              id="shopping-studio-title"
              className={variant === "catalog" ? "sr-only" : undefined}
            >
              Get outfit ideas.<em> Try them on.</em>
            </h2>
          </div>
          <p>
            Use the AI stylist for outfit suggestions, or open AR try-on.
          </p>
        </div>
      )}
      {variant === "standalone" && (
        <h2 id="shopping-studio-title" className="sr-only">
          AI stylist and AR fitting room
        </h2>
      )}
      <div className="shopping-tools">
        <article
          id="ai-stylist"
          className="shopping-ai"
          aria-labelledby="ai-stylist-title"
        >
          <div className="shopping-tool-top">
            <span className="shopping-tool-label">
              <Sparkles size={17} /> AI stylist
            </span>
          </div>
          <h3
            id="ai-stylist-title"
            className={variant === "standalone" ? "sr-only" : undefined}
          >
            {variant === "catalog"
              ? "Find your look with AI."
              : "What would you like to wear?"}
          </h3>
          <p>
            {variant === "home"
              ? "Tell us the occasion, colours or pieces you have in mind. We’ll suggest an outfit from the collection."
              : variant === "catalog"
                ? "Describe your look. We’ll suggest the pieces."
                : "Describe a look. Get suggested pieces from the collection, with ideas for wearing them together."}
          </p>
          <form onSubmit={submit} className="shopping-ai-form">
            <label htmlFor={inputId}>What do you have in mind?</label>
            <div className="shopping-ai-input">
              <input
                id={inputId}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="e.g. relaxed weekend layers in warm neutrals"
                maxLength={200}
                required
              />
              <button type="submit">
                Find my look <ArrowRight size={17} />
              </button>
            </div>
          </form>
          <div className="shopping-ideas">
            <span>Or try</span>
            {IDEAS.map((idea) => (
              <button
                type="button"
                key={idea.label}
                onClick={() => styleLook(idea.query)}
              >
                {idea.label} <ArrowUpRight size={12} />
              </button>
            ))}
          </div>
        </article>
        <article className="shopping-ar" aria-labelledby="ar-try-on-title">
          <div className="shopping-ar-copy">
            <span className="shopping-tool-label">
              <Scan size={17} /> AR try-on
            </span>
            <h3 id="ar-try-on-title">
              See it on
              <br />
              <em>yourself.</em>
            </h3>
            <p>
              See camera-enabled pieces on yourself in real time, before you
              decide.
            </p>
            <Link href="/try-on">
              Try it on with AR <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="shopping-ar-preview">
            <Image
              src="/editorial/ivory-v3.webp"
              alt="Editorial preview of an ivory hoodie for the AR fitting room"
              fill
              sizes="(min-width: 900px) 180px, 30vw"
              className="object-cover"
            />
            <Scan size={27} className="shopping-ar-scan" />
            <span>EDITORIAL PREVIEW</span>
          </div>
        </article>
      </div>
      {request && (
        <div ref={results} className="shopping-studio-results">
          <div className="shopping-brief">
            <Sparkles size={16} />
            <span>Your request</span>
            <p>{request.query}</p>
            <button
              type="button"
              onClick={() => {
                setRequest(null);
                document.getElementById(inputId)?.focus();
              }}
            >
              Edit your request
            </button>
          </div>
          <RecommendedRow
            key={request.id}
            mode="stylist"
            query={request.query}
            className="shopping-recommendations"
          />
        </div>
      )}
    </section>
  );
}
