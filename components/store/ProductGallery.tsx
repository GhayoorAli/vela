"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className={images.length > 1 ? "grid gap-3 lg:grid-cols-[72px_1fr]" : ""}>
      {images.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto no-scrollbar lg:order-1 lg:flex-col">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden lg:h-auto lg:w-full lg:aspect-square ${
                i === active ? "ring-1 ring-ink" : "opacity-50 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative order-1 aspect-[4/5] overflow-hidden bg-sand lg:order-2">
        {current && (
          <Image
            src={current}
            alt={name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <span className="absolute bottom-4 right-4 font-sans text-[10px] uppercase tracking-[0.22em] text-paper/80">
          {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
