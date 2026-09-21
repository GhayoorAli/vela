import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CategoryMosaic({
  href,
  name,
  kicker,
  index,
  images,
  className,
}: {
  href: string;
  name: string;
  kicker: string;
  index: string;
  images: string[];
  className?: string;
}) {
  const shots = images.slice(0, 3);

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden bg-sand ${className ?? ""}`}
    >
      <div className="grid h-full min-h-[280px] grid-cols-3 sm:min-h-[340px] md:min-h-[480px]">
        {shots.map((src) => (
          <div key={src} className="mosaic-shot relative overflow-hidden">
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 768px) 18vw, 33vw"
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-5 text-paper md:p-8">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-paper/70 transition duration-500 group-hover:tracking-[0.4em]">
          {index} — {kicker}
        </p>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl tracking-tight transition duration-500 group-hover:italic sm:text-4xl md:text-6xl">{name}</h2>
          <span className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/40 transition duration-500 group-hover:-rotate-45 group-hover:bg-paper group-hover:text-ink">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
