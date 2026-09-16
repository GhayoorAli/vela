import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p className="font-serif text-3xl">Vela</p>
          <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-paper/65">
            A modern house for clothing, frames, and rooms — try the clothes on
            live with your camera before they arrive.
          </p>
        </div>
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-paper/50">Shop</p>
          <ul className="mt-4 space-y-2 font-sans text-sm text-paper/80">
            <li><Link href="/shop">All products</Link></li>
            <li><Link href="/shop/clothing">Clothing</Link></li>
            <li><Link href="/shop/eyewear">Eyewear</Link></li>
            <li><Link href="/shop/furniture">Living</Link></li>
            <li><Link href="/try-on">Live try-on</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-paper/50">Help</p>
          <ul className="mt-4 space-y-2 font-sans text-sm text-paper/80">
            <li>Cash on delivery</li>
            <li>Bank transfer</li>
            <li>30-day returns</li>
            <li><Link href="/admin">Store admin</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-paper/50">Visit</p>
          <p className="mt-4 font-sans text-sm leading-relaxed text-paper/80">
            Open daily 10–18
            <br />
            Fitting room in your camera
          </p>
        </div>
      </div>
      <div className="border-t border-paper/10 px-6 py-4 text-center font-sans text-[10px] uppercase tracking-[0.18em] text-paper/40">
        Vela store · Local catalog · No paid SaaS
      </div>
    </footer>
  );
}
