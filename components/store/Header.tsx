"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { CartDrawer } from "@/components/store/CartDrawer";

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

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    setSearchOpen(false);
    setOpen(false);
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  return (
    <>
      <div className="bg-ink text-center font-sans text-[10px] uppercase tracking-[0.22em] text-paper/90">
        <p className="px-4 py-2">Cash on delivery · 30-day returns · Try clothes on live with your camera</p>
      </div>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <button
            type="button"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>

          <Link href="/" className="font-serif text-[28px] leading-none tracking-tight">
            Vela
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
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
                  className={`font-sans text-[11px] uppercase tracking-[0.2em] ${
                    active ? "text-ink" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search size={18} />
            </button>
            <Link href="/admin" aria-label="Admin" className="hidden sm:block">
              <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink/50 hover:text-ink">
                Admin
              </span>
            </Link>
            <button
              type="button"
              aria-label="Open bag"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-rust px-1 font-sans text-[9px] text-paper">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form
            onSubmit={onSearch}
            className="mx-auto flex max-w-7xl items-center gap-3 border-t border-ink/10 px-4 py-3 md:px-6"
          >
            <Search size={16} className="text-ink/40" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search garments, rooms, frames…"
              className="w-full bg-transparent font-sans text-sm outline-none placeholder:text-ink/35"
            />
            <button type="submit" className="font-sans text-[11px] uppercase tracking-[0.16em]">
              Search
            </button>
          </form>
        )}
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-paper md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-serif text-2xl">Vela</span>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-6 px-6 pt-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-serif text-4xl"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setOpen(false)} className="font-sans text-sm uppercase tracking-[0.18em] text-ink/50">
              Admin
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
