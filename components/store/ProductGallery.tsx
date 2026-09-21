"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden bg-sand">
        <div className="relative aspect-[4/5] w-full lg:max-h-[72vh]">
          {current && (
            <Image
              src={current}
              alt={name}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[center_30%]"
            />
          )}
        </div>
        {images.length > 1 && (
          <span className="absolute bottom-4 right-4 bg-ink/50 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.22em] text-paper backdrop-blur-sm">
            {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 overflow-hidden bg-sand ${
                i === active ? "ring-1 ring-ink" : "opacity-45 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill className="object-contain" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
