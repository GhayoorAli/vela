import type { ReactNode } from "react";
import { Camera, Truck, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

  return (
    <main>
      <section className="relative min-h-[78vh] overflow-hidden bg-ink">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-ink/25" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 text-paper">
          <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-paper/70">
            Spring house · Live fitting room
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] md:text-7xl">
            Clothes you can try on before they arrive.
          </h1>
          <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-paper/80">
            Point your camera at yourself and the piece appears on your body
            in real time — it moves as you move, so you can judge the fit and
            the fall before you order.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop/clothing"
              className="bg-paper px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-ink"
            >
              Shop clothing
            </Link>
            <Link
              href="/try-on"
              className="inline-flex items-center gap-2 border border-paper/70 px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em]"
            >
              <Camera size={14} /> Try on live
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.id} href={`/shop/${c.slug}`} className="group relative min-h-[320px] overflow-hidden">
            <Image
              src={c.image}
              alt=""
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-ink/30" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
              <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-paper/70">Category</p>
              <h2 className="mt-1 font-serif text-4xl">{c.name}</h2>
            </div>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink/45">Featured</p>
            <h2 className="mt-1 font-serif text-4xl">This week’s edit</h2>
          </div>
          <Link href="/shop" className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink/60">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {featuredSlice.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto my-20 grid max-w-7xl overflow-hidden md:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image
            src="/products/harbor-hoodie.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center bg-sand px-8 py-16 md:px-14">
          <Camera className="text-rust" />
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">A fitting room in your camera</h2>
          <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-ink/70">
            Pieces marked “Try on” open a live view of you wearing them. The
            garment is fitted to your shoulders, chest, and arms and follows
            you as you turn — so you see the drape, the length, and the colour
            against your skin, not a mannequin&apos;s.
          </p>
          <Link
            href="/try-on"
            className="mt-8 inline-flex w-fit items-center gap-2 bg-ink px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-paper"
          >
            <Camera size={14} /> Open the fitting room
          </Link>
        </div>
      </section>

      {tryOnPieces.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-4xl">Ready to try on</h2>
            <Link href="/shop?tryon=1" className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink/60">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {tryOnPieces.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="border-y border-ink/10 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
          <Value icon={<Truck size={18} />} title="Cash on delivery" text="Pay at the door. No card processor, no extra fee." />
          <Value icon={<Camera size={18} />} title="Live try-on" text="See the piece on your own body, in real time, before you order." />
          <Value icon={<RotateCcw size={18} />} title="30-day returns" text="Send it back if the fit isn’t right after it arrives." />
        </div>
      </section>
    </main>
  );
}

function Value({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 text-rust">{icon}</div>
      <div>
        <p className="font-serif text-xl">{title}</p>
        <p className="mt-1 font-sans text-sm text-ink/60">{text}</p>
      </div>
    </div>
  );
}
