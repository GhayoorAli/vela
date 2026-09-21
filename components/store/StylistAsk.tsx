"use client";

import { Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { RecommendedRow } from "@/components/store/RecommendedRow";

const EXAMPLES = [
  "weekend hoodie and jeans",
  "rust tee and sand chinos",
  "sunglasses for a black hoodie",
  "navy hoodie, olive trousers",
];

export function StylistAsk() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = draft.trim();
    if (!next) return;
    setQuery(next);
  }

  return (
    <div className="mt-12 border-t border-ink/10 pt-10">
      <p className="eyebrow inline-flex items-center gap-2">
        <Sparkles size={11} strokeWidth={1.75} className="text-rust" />
        Ask the stylist
      </p>
      <p className="mt-3 max-w-2xl font-serif text-3xl tracking-tight md:text-4xl">
        Describe a look.
        <span className="italic text-ink/55"> We’ll pull pieces from the house.</span>
      </p>
      <form
        onSubmit={onSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="block min-w-0 flex-1 font-sans text-sm">
          <span className="sr-only">What are you dressing for</span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. rust hoodie, weekend, sunglasses"
            className="field"
            maxLength={200}
          />
        </label>
        <button type="submit" className="btn-solid shrink-0">
          Style this
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setDraft(example);
              setQuery(example);
            }}
            className="border border-ink/15 px-2.5 py-1.5 font-sans text-[11px] text-ink/65 transition hover:border-ink/40 hover:text-ink"
          >
            {example}
          </button>
        ))}
      </div>
      {query ? (
        <RecommendedRow mode="stylist" query={query} className="mt-10" />
      ) : null}
    </div>
  );
}
