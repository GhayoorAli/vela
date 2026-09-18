"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Home, LayoutGrid, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: (path: string) => path === "/" },
  {
    href: "/shop",
    label: "Shop",
    icon: LayoutGrid,
    match: (path: string) =>
      path.startsWith("/shop") || path.startsWith("/products"),
  },
  {
    href: "/try-on",
    label: "Try on",
    icon: Camera,
    match: (path: string) => path === "/try-on",
  },
  {
    href: "/cart",
    label: "Bag",
    icon: ShoppingBag,
    match: (path: string) => path === "/cart" || path.startsWith("/checkout"),
  },
];

export function MobileTabBar() {
  const pathname = usePathname() || "";
  const { count } = useCart();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid h-16 grid-cols-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`relative flex h-full flex-col items-center justify-center gap-1 ${
                  active ? "text-ink" : "text-ink/40"
                }`}
              >
                <span className="relative">
                  <Icon size={20} strokeWidth={active ? 1.9 : 1.5} />
                  {tab.href === "/cart" && count > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center bg-ink px-1 font-sans text-[8px] text-paper">
                      {count}
                    </span>
                  )}
                </span>
                <span className="font-sans text-[9px] font-medium uppercase tracking-[0.16em]">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
