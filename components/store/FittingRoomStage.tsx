"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { VISUALS } from "@/lib/media";

const MOTES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${46 + ((i * 19) % 48)}%`,
  top: `${10 + ((i * 11) % 74)}%`,
  delay: `${(i * 0.45) % 7}s`,
  duration: `${8 + (i % 5)}s`,
  size: `${1 + (i % 3)}px`,
}));

export function FittingRoomStage({ children }: { children: ReactNode }) {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scene.current;
    if (!root) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -5;
      root.style.setProperty("--tilt-x", `${x}deg`);
      root.style.setProperty("--tilt-y", `${y}deg`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative min-h-[80svh] overflow-hidden bg-ink text-paper md:min-h-[88svh]">
      <div ref={scene} className="fit-scene pointer-events-none absolute inset-0">
        <Image
          src={VISUALS.tryOn}
          alt=""
          fill
          sizes="100vw"
          className="fit-plate ken-burns object-cover"
        />
        <div className="fit-rays" />
        <div className="fit-curtain fit-curtain-l" />
        <div className="fit-curtain fit-curtain-r" />
        {MOTES.map((mote) => (
          <span
            key={mote.id}
            className="fit-mote"
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
              animationDelay: mote.delay,
              animationDuration: mote.duration,
            }}
          />
        ))}
        <div className="fit-glass">
          <div className="fit-glass-ring" />
          <div className="fit-glass-well">
            <Image
              src={VISUALS.tryOnGlass}
              alt=""
              fill
              sizes="380px"
              className="fit-garment object-cover object-[center_42%]"
            />
            <div className="fit-glass-sheen" />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[min(46rem,78%)] bg-gradient-to-r from-ink/80 via-ink/40 to-transparent md:w-[min(46rem,60%)] md:from-ink/75 md:via-ink/35" />
      <div className="relative">{children}</div>
    </section>
  );
}
