"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="product-gallery space-y-4">
      <div className="relative overflow-hidden rounded-lg bg-sand">
        <div className="relative aspect-[3/4] w-full">
          {current && (
            <Image
              src={current}
              alt={name}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-contain"
            />
          )}
        </div>
        {images.length > 1 && (
          <span className="absolute bottom-4 right-4 bg-ink/50 px-2.5 py-1 font-sans text-[12px] uppercase tracking-[0.08em] text-paper backdrop-blur-sm">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`View image ${i + 1} of ${name}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 overflow-hidden bg-sand ${
                i === active
                  ? "ring-1 ring-ink"
                  : "opacity-45 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-contain"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
