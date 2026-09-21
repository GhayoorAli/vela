import type { ReactNode } from "react";
import { Camera, RotateCcw, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CategoryMosaic } from "@/components/store/CategoryMosaic";
import { FittingRoomStage } from "@/components/store/FittingRoomStage";
import { Lookbook } from "@/components/store/Lookbook";
import { Marquee } from "@/components/store/Marquee";
import { ProductCard } from "@/components/store/ProductCard";
import { Reveal } from "@/components/store/Reveal";
import { listCategories, listProducts, listTryOnProducts } from "@/lib/catalog";
import { CATEGORY_COLLAGE, VISUALS } from "@/lib/media";

export const dynamic = "force-dynamic";

const KICKERS: Record<string, string> = {
  hoodies: "Six colourways",
  tees: "Crew necks",
  trousers: "Jeans & chinos",
  eyewear: "Frames & sun",
};

export default async function HomePage() {
  const [categories, featured, tryOn] = await Promise.all([
    listCategories(),
    listProducts({ sort: "featured" }),
    listTryOnProducts(),
  ]);
  const featuredSlice = featured.filter((p) => p.featured).slice(0, 8);
  const [leadPiece, ...editRest] = featuredSlice;
  const tryOnPieces = tryOn.slice(0, 4);

  return (
    <main>
      <section className="relative -mt-[4.5rem] min-h-[100svh] overflow-hidden bg-ink md:-mt-20">
        <Image
          src={VISUALS.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="ken-burns object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-frame flex-col justify-end px-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-32 text-white md:justify-center md:px-8 md:pb-20 md:pt-24">
          <p className="eyebrow text-white/60 animate-fade-up">
            01 — Autumn house
          </p>
          <h1
            className="mt-5 max-w-[11ch] font-serif text-[3.5rem] leading-[0.9] tracking-tight text-white animate-fade-up md:text-[7.4rem]"
            style={{ animationDelay: "80ms" }}
          >
            The piece, on you.
            <span className="italic text-white/80"> Then you decide.</span>
          </h1>
          <span
            className="mt-5 block h-px w-16 bg-rust animate-fade-up"
            style={{ animationDelay: "140ms" }}
          />
          <div
            className="mt-8 flex max-w-3xl flex-col gap-8 animate-fade-up md:mt-10 md:flex-row md:items-end md:justify-between"
            style={{ animationDelay: "160ms" }}
          >
            <p className="max-w-md font-sans text-sm font-light leading-relaxed text-white/75 md:text-[15px]">
              Hoodies, tees, trousers, and frames — cut for everyday wear.
              Open the camera and see the piece on you before it ships.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn-light">
                Shop the edit
              </Link>
              <Link
                href="/try-on"
                className="btn border border-paper/70 text-paper hover:bg-paper hover:text-ink"
              >
                <Camera size={14} strokeWidth={1.75} /> Try on live
              </Link>
            </div>
          </div>
        </div>

        <p className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 font-sans text-[9px] uppercase tracking-[0.42em] text-paper/40 [writing-mode:vertical-rl] xl:block">
          Live try-on · Autumn 26
        </p>

        <div className="pointer-events-none absolute bottom-8 right-6 hidden w-40 overflow-hidden border border-paper/20 md:right-10 md:block lg:w-48">
          <div className="relative aspect-[3/4] bg-sand float-still">
            <Image
              src={VISUALS.heroStill}
              alt=""
              fill
              sizes="192px"
              className="object-contain"
            />
          </div>
          <p className="bg-ink/80 px-3 py-2 font-sans text-[9px] uppercase tracking-[0.22em] text-paper/70">
            Still — ivory hoodie
          </p>
        </div>

        <div className="absolute bottom-8 left-6 hidden items-center gap-3 text-paper/50 md:flex">
          <span className="scroll-pulse h-10 w-px bg-paper/50" />
          <span className="font-sans text-[9px] uppercase tracking-[0.28em]">
            Scroll
          </span>
        </div>
      </section>

      <Marquee
        items={[
          "Live AR fitting room",
          "Cash on delivery",
          "30-day returns",
          "Edited weekly",
          "Ships nationwide",
          "No card required",
        ]}
      />

      <section className="px-3 py-3 md:px-4 md:py-4">
        <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
          {categories.map((category, i) => (
            <Reveal key={category.slug} delay={i * 80}>
              <CategoryMosaic
                href={`/shop/${category.slug}`}
                name={category.name}
                kicker={KICKERS[category.slug] ?? category.description}
                index={String(i + 1).padStart(2, "0")}
                images={CATEGORY_COLLAGE[category.slug] ?? [category.image]}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <Lookbook products={featuredSlice} />

      <section className="mx-auto max-w-frame px-6 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="eyebrow">The edit</p>
              <h2 className="mt-3 font-serif text-4xl leading-[0.95] tracking-tight sm:text-5xl md:text-7xl">
                This week’s
                <span className="italic"> pieces.</span>
              </h2>
            </div>
            <Link href="/shop" className="link-line eyebrow text-ink">
              View all
            </Link>
          </div>
        </Reveal>

        {leadPiece ? (
          <div className="grid gap-10 md:grid-cols-12 md:gap-x-6 md:gap-y-14">
            <Reveal className="md:col-span-7">
              <ProductCard product={leadPiece} large />
            </Reveal>
            <div className="grid gap-10 sm:grid-cols-2 md:col-span-5 md:grid-cols-1">
              {editRest.slice(0, 2).map((p, i) => (
                <Reveal key={p.id} delay={80 * (i + 1)}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
            {editRest.slice(2, 6).map((p, i) => (
              <Reveal key={p.id} delay={40 * i} className="md:col-span-3">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </section>

      <FittingRoomStage>
        <Reveal className="mx-auto flex min-h-[80svh] max-w-frame flex-col justify-end px-5 py-14 md:min-h-[88svh] md:justify-center md:px-8 md:py-24">
          <p className="eyebrow text-paper/50">02 — Fitting room</p>
          <h2 className="mt-4 max-w-[12ch] font-serif text-4xl leading-[0.95] tracking-tight sm:text-5xl md:text-7xl">
            A fitting room
            <span className="italic"> in your camera.</span>
          </h2>
          <p className="mt-6 max-w-md font-sans text-sm font-light leading-relaxed text-paper/80">
            Pieces marked “Try on” open a live view of you wearing them. The
            garment is fitted to your shoulders, chest, and arms and follows
            you as you turn — so you see the drape, not a mannequin.
          </p>
          <Link href="/try-on" className="btn-light mt-10 w-fit">
            <Camera size={14} strokeWidth={1.75} /> Open the fitting room
          </Link>
        </Reveal>
      </FittingRoomStage>

      {tryOnPieces.length > 0 && (
        <section className="mx-auto max-w-frame px-6 py-20 md:px-8 md:py-28">
          <Reveal>
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="font-serif text-5xl leading-[0.95] tracking-tight md:text-6xl">
                Ready to try on
              </h2>
              <Link href="/shop?tryon=1" className="link-line eyebrow text-ink">
                View all
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {tryOnPieces.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-ink py-24 text-paper md:py-32">
        <Reveal className="mx-auto max-w-frame px-6 md:px-8">
          <p className="eyebrow text-paper/45">From the house</p>
          <span className="draw-rule mt-6 bg-rust" />
          <blockquote className="mt-6 max-w-4xl font-serif text-3xl leading-[1.12] tracking-tight md:text-6xl">
            “We don’t sell a look. We sell the moment you see it on yourself —
            then decide.”
          </blockquote>
          <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.22em] text-paper/45">
            Vela atelier · Live try-on
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-frame gap-0 px-6 md:grid-cols-3 md:px-8">
        <Value
          index="01"
          icon={<Truck size={18} strokeWidth={1.5} />}
          title="Cash on delivery"
          text="Pay at the door. No card processor, no extra fee."
        />
        <Value
          index="02"
          icon={<Camera size={18} strokeWidth={1.5} />}
          title="Live try-on"
          text="See the piece on your own body, in real time, before you order."
        />
        <Value
          index="03"
          icon={<RotateCcw size={18} strokeWidth={1.5} />}
          title="30-day returns"
          text="Send it back if the fit isn’t right after it arrives."
        />
      </section>
    </main>
  );
}

function Value({
  index,
  icon,
  title,
  text,
}: {
  index: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group flex gap-5 border-ink/10 py-14 transition duration-500 md:border-r md:px-8 md:py-20 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
      <div className="mt-1 text-rust transition duration-500 group-hover:-translate-y-1">{icon}</div>
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-ink/35">
          {index}
        </p>
        <p className="mt-2 font-serif text-2xl tracking-tight transition duration-500 group-hover:italic md:text-3xl">{title}</p>
        <p className="mt-2 font-sans text-sm font-light leading-relaxed text-ink/55">
          {text}
        </p>
      </div>
    </div>
  );
}
