"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Marquee } from "@/components/store/Marquee";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop/clothing", label: "Clothing" },
  { href: "/shop/eyewear", label: "Eyewear" },
  { href: "/shop/furniture", label: "Living" },
  { href: "/try-on", label: "Try on" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !searchOpen && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    setSearchOpen(false);
    setOpen(false);
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  return (
    <>
      <div className="hide-standalone">
        <Marquee
          inverted
          items={[
            "Cash on delivery",
            "30-day returns",
            "Live camera try-on",
            "Complimentary alterations advice",
            "Ships nationwide",
          ]}
        />
      </div>
      <header
        className={`app-header sticky top-0 z-40 transition-all duration-500 ease-expo ${
          transparent
            ? "border-b border-transparent bg-transparent text-paper"
            : "border-b border-ink/10 bg-paper/90 text-ink backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto grid h-[4.5rem] max-w-frame grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:h-20 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
            <nav className="hidden items-center gap-7 lg:flex">
              {NAV.map((item) => {
                const active =
                  item.href === "/shop"
                    ? pathname === "/shop"
                    : pathname.startsWith(item.href.split("?")[0]) &&
                      item.href !== "/shop";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`link-line font-sans text-[10px] font-medium uppercase tracking-[0.22em] ${
                      active ? "opacity-100" : "opacity-55 hover:opacity-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Link
            href="/"
            className="font-serif text-[34px] leading-none tracking-tight md:text-[40px]"
          >
            Vela
          </Link>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link
              href="/admin"
              aria-label="Admin"
              className="hidden font-sans text-[10px] uppercase tracking-[0.22em] opacity-50 hover:opacity-100 sm:block"
            >
              Account
            </Link>
            <button
              type="button"
              aria-label="Open bag"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span
                  className={`absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center px-1 font-sans text-[9px] ${
                    transparent ? "bg-paper text-ink" : "bg-ink text-paper"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form
            onSubmit={onSearch}
            className="mx-auto flex max-w-frame items-center gap-3 border-t border-ink/10 px-4 py-4 md:px-8"
          >
            <Search size={16} className="opacity-40" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search garments, rooms, frames…"
              className="w-full bg-transparent font-sans text-sm outline-none placeholder:opacity-40"
            />
            <button
              type="submit"
              className="font-sans text-[10px] uppercase tracking-[0.22em]"
            >
              Search
            </button>
          </form>
        )}
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink text-paper lg:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <span className="font-serif text-3xl">Vela</span>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-6 pt-10">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-serif text-5xl leading-[1.05]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-10 font-sans text-[11px] uppercase tracking-[0.22em] text-paper/50"
            >
              Account
            </Link>
          </nav>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export function MiniPrice({ value }: { value: number }) {
  return <span>{formatPrice(value)}</span>;
}
