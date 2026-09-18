import type { ReactNode } from "react";
import { ArrowUpRight, Camera, RotateCcw, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/store/Marquee";
import { ProductCard } from "@/components/store/ProductCard";
import { listCategories, listProducts, listTryOnProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured, tryOn] = await Promise.all([
    listCategories(),
    listProducts({ sort: "featured" }),
    listTryOnProducts(),
  ]);
  const featuredSlice = featured.filter((p) => p.featured).slice(0, 8);
  const tryOnPieces = tryOn.slice(0, 4);
  const lead = categories[0];
  const rest = categories.slice(1);

  return (
    <main>
      <section className="relative -mt-[4.5rem] min-h-[100svh] overflow-hidden bg-ink md:-mt-20">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2200&q=80"
          alt=""
          fill
          priority
          className="object-cover object-[center_20%] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/20" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-frame flex-col justify-end px-6 pb-16 pt-36 text-paper md:px-8 md:pb-20">
          <p className="eyebrow text-paper/55 animate-fade-up">01 — Spring house</p>
          <h1 className="mt-5 max-w-4xl font-serif text-[3.4rem] leading-[0.92] tracking-tight animate-fade-up md:text-[7.5rem]">
            Clothes you can try on
            <span className="italic text-paper/80"> before they arrive.</span>
          </h1>
          <div className="mt-8 flex max-w-2xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md font-sans text-sm font-light leading-relaxed text-paper/75">
              Point the camera at yourself. The piece appears on your body in
              real time — it moves as you move, so you judge the fall, the
              length, and the colour against your skin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop/clothing" className="btn-light">
                Shop clothing
              </Link>
              <Link href="/try-on" className="btn border border-paper text-paper hover:bg-paper hover:text-ink">
                <Camera size={14} strokeWidth={1.75} /> Try on live
              </Link>
            </div>
          </div>
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

      <section className="px-3 py-3 md:px-5">
        <div className="grid gap-3 md:grid-cols-12">
          {lead && (
            <CategoryTile
              href={`/shop/${lead.slug}`}
              image={lead.image}
              name={lead.name}
              index="01"
              className="min-h-[420px] md:col-span-7 md:row-span-2 md:min-h-[720px]"
            />
          )}
          {rest.map((c, i) => (
            <CategoryTile
              key={c.id}
              href={`/shop/${c.slug}`}
              image={c.image}
              name={c.name}
              index={String(i + 2).padStart(2, "0")}
              className="min-h-[280px] md:col-span-5 md:min-h-[354px]"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-frame px-6 py-24 md:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow">The edit</p>
            <h2 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
              This week’s
              <span className="italic"> pieces.</span>
            </h2>
          </div>
          <Link href="/shop" className="link-line eyebrow text-ink">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
          {featuredSlice.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-frame overflow-hidden md:grid-cols-12">
        <div className="relative min-h-[520px] md:col-span-7">
          <Image
            src="https://images.unsplash.com/photo-1523381294919-8f6d54cd904c?auto=format&fit=crop&w=1600&q=80"
            alt=""
            fill
            className="object-cover"
          />
          <p className="absolute left-6 top-6 font-sans text-[10px] uppercase tracking-[0.28em] text-paper/80">
            02 — Fitting room
          </p>
        </div>
        <div className="flex flex-col justify-center bg-moss px-8 py-16 text-paper md:col-span-5 md:px-14">
          <p className="eyebrow text-paper/45">Live on your body</p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.02] tracking-tight md:text-6xl">
            A fitting room
            <span className="italic"> in your camera.</span>
          </h2>
          <p className="mt-6 max-w-md font-sans text-sm font-light leading-relaxed text-paper/70">
            Pieces marked “Try on” open a live view of you wearing them. The
            garment is fitted to your shoulders, chest, and arms and follows
            you as you turn — so you see the drape, not a mannequin.
          </p>
          <Link href="/try-on" className="btn-light mt-10 w-fit">
            <Camera size={14} strokeWidth={1.75} /> Open the fitting room
          </Link>
        </div>
      </section>

      {tryOnPieces.length > 0 && (
        <section className="mx-auto max-w-frame px-6 py-24 md:px-8">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-serif text-5xl leading-[0.95] tracking-tight md:text-6xl">
              Ready to try on
            </h2>
            <Link href="/shop?tryon=1" className="link-line eyebrow text-ink">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {tryOnPieces.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="border-y border-ink/10 bg-mist">
        <div className="mx-auto max-w-frame px-6 py-20 md:px-8 md:py-28">
          <p className="eyebrow">From the house</p>
          <blockquote className="mt-6 max-w-4xl font-serif text-3xl leading-[1.15] tracking-tight md:text-5xl">
            “We don’t sell a look. We sell the moment you see it on yourself —
            then decide.”
          </blockquote>
          <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.22em] text-ink/40">
            Vela atelier · Live try-on
          </p>
        </div>
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

function CategoryTile({
  href,
  image,
  name,
  index,
  className,
}: {
  href: string;
  image: string;
  name: string;
  index: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`group relative overflow-hidden ${className ?? ""}`}>
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition duration-700 ease-expo group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-ink/25 transition duration-500 group-hover:bg-ink/40" />
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-paper md:p-8">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-paper/70">
          {index} — Category
        </p>
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-5xl tracking-tight md:text-6xl">{name}</h2>
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-paper/40 transition group-hover:bg-paper group-hover:text-ink">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
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
    <div className="flex gap-5 border-ink/10 py-12 md:border-r md:px-8 md:py-16 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
      <div className="mt-1 text-rust">{icon}</div>
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-ink/35">{index}</p>
        <p className="mt-2 font-serif text-2xl tracking-tight">{title}</p>
        <p className="mt-2 font-sans text-sm font-light leading-relaxed text-ink/55">{text}</p>
      </div>
    </div>
  );
}
