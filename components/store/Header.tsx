"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Menu,
  Search,
  ShoppingBag,
  Scan,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { CartDrawer } from "@/components/store/CartDrawer";

const NAV = [
  { href: "/shop", label: "Collection" },
  { href: "/shop/hoodies", label: "Hoodies" },
  { href: "/shop/tees", label: "T-shirts" },
  { href: "/shop/trousers", label: "Trousers" },
  { href: "/shop/eyewear", label: "Eyewear" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuDialog = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuDialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes =
          menuDialog.current?.querySelectorAll<HTMLElement>("a, button");
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setSearchOpen(false);
    const query = q.trim();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  return (
    <>
      <a href="#store-content" className="skip-link">
        Skip to content
      </a>
      <header
        className={`studio-header app-header ${pathname === "/" ? `header-over-campaign ${scrolled ? "header-scrolled" : ""}` : ""}`}
      >
        <div className="studio-nav">
          <Link href="/" className="studio-wordmark" aria-label="Vela home">
            VELA<span>STUDIO</span>
          </Link>
          <nav className="studio-desktop-nav" aria-label="Main navigation">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="studio-nav-actions">
            <Link
              href="/stylist"
              className="nav-feature-link nav-ai"
              aria-current={pathname === "/stylist" ? "page" : undefined}
            >
              <Sparkles size={16} /> AI stylist
            </Link>
            <Link href="/try-on" className="nav-feature-link nav-ar">
              <Scan size={16} /> AR try-on
            </Link>
            <button
              type="button"
              className="nav-icon"
              aria-label="Search products"
              aria-expanded={searchOpen}
              aria-controls="store-search"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </button>
            <button
              type="button"
              className="nav-icon nav-bag"
              aria-label={`Open bag, ${count} items`}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={19} />
              <span>{count}</span>
            </button>
            <button
              ref={menuButton}
              type="button"
              className="nav-icon mobile-menu-button"
              aria-label="Open navigation"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
        <nav className="mobile-feature-nav" aria-label="Shopping features">
          <Link
            href="/stylist"
            aria-current={pathname === "/stylist" ? "page" : undefined}
          >
            <Sparkles size={16} />
            <span>AI stylist</span>
            <ArrowUpRight size={14} />
          </Link>
          <Link href="/try-on">
            <Scan size={16} />
            <span>AR try-on</span>
            <ArrowUpRight size={14} />
          </Link>
        </nav>
        {searchOpen && (
          <form
            id="store-search"
            onSubmit={onSearch}
            className="studio-search"
            role="search"
          >
            <Search size={20} />
            <input
              ref={searchInput}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
              }}
              placeholder="Search products…"
              aria-label="Search products"
            />
            <button type="submit">
              Search <ArrowUpRight size={16} />
            </button>
          </form>
        )}
      </header>
      {open && (
        <div
          ref={menuDialog}
          className="studio-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="mobile-menu-top">
            <Link
              href="/"
              className="studio-wordmark"
              onClick={() => setOpen(false)}
            >
              VELA<span>STUDIO</span>
            </Link>
            <button
              className="nav-icon"
              type="button"
              aria-label="Close navigation"
              onClick={() => {
                setOpen(false);
                menuButton.current?.focus();
              }}
            >
              <X size={24} />
            </button>
          </div>
          <p className="studio-label">SHOP</p>
          <nav>
            {[
              ...NAV,
              { href: "/stylist", label: "AI personal stylist" },
              { href: "/try-on", label: "AR fitting room" },
            ].map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
                <small>{String(i + 1).padStart(2, "0")}</small>
              </Link>
            ))}
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
