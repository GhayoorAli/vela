import Image from "next/image";
import Link from "next/link";
import { shot } from "@/lib/media";

const FOOTER_STILLS = [
  shot("ember-hoodie.png"),
  shot("rust-tee.png"),
  shot("indigo-jeans.png"),
  shot("tortoise-frames.png"),
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="relative overflow-hidden">
        <div className="grid grid-cols-4">
          {FOOTER_STILLS.map((src) => (
            <div key={src} className="group/still relative aspect-[3/4] bg-sand">
              <Image
                src={src}
                alt=""
                fill
                sizes="25vw"
                className="object-cover object-top opacity-80 grayscale transition duration-700 ease-expo group-hover/still:scale-[1.04] group-hover/still:grayscale-0"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <p className="absolute bottom-6 left-6 font-sans text-[10px] uppercase tracking-[0.28em] text-paper/70 md:left-8">
          The house — photographed in studio light
        </p>
      </div>
      <div className="mx-auto grid max-w-frame gap-12 px-6 py-20 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="font-serif text-4xl tracking-tight md:text-5xl">The house</p>
          <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-paper/60">
            Hoodies, tees, trousers, and frames — edited with a slow hand.
            Try the clothes on live with your camera before they leave the
            atelier.
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="eyebrow text-paper/40">Shop</p>
          <ul className="mt-5 space-y-2.5 font-sans text-sm text-paper/75">
            <li>
              <Link href="/shop" className="link-line">
                All products
              </Link>
            </li>
            <li>
              <Link href="/shop/hoodies" className="link-line">
                Hoodies
              </Link>
            </li>
            <li>
              <Link href="/shop/tees" className="link-line">
                T-Shirts
              </Link>
            </li>
            <li>
              <Link href="/shop/trousers" className="link-line">
                Trousers
              </Link>
            </li>
            <li>
              <Link href="/shop/eyewear" className="link-line">
                Eyewear
              </Link>
            </li>
            <li>
              <Link href="/try-on" className="link-line">
                Live try-on
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="eyebrow text-paper/40">Client care</p>
          <ul className="mt-5 space-y-2.5 font-sans text-sm text-paper/75">
            <li>Cash on delivery</li>
            <li>Bank transfer</li>
            <li>30-day returns</li>
            <li>
              <Link href="/admin" className="link-line">
                Store admin
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow text-paper/40">Atelier</p>
          <p className="mt-5 font-sans text-sm leading-relaxed text-paper/75">
            Open daily 10–18
            <br />
            Fitting room in your camera
            <br />
            Worldwide dispatch
          </p>
        </div>
      </div>
      <div className="overflow-hidden border-t border-paper/10">
        <p className="select-none px-4 font-serif text-[22vw] leading-[0.8] tracking-[-0.06em] text-paper/[0.08]">
          VELA
        </p>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 border-t border-paper/10 px-6 py-4 font-sans text-[10px] uppercase tracking-[0.22em] text-paper/35 md:flex-row md:px-8">
        <span>© {new Date().getFullYear()} Vela</span>
        <span>Local catalog · Live AR fitting</span>
      </div>
    </footer>
  );
}
