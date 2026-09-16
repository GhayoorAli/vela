"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
} from "lucide-react";
import { logoutAdmin } from "@/lib/actions";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen bg-[#efeae2]">
      <aside className="hidden w-56 shrink-0 border-r border-ink/10 bg-paper md:flex md:flex-col">
        <Link href="/admin" className="border-b border-ink/10 px-5 py-5 font-serif text-2xl">
          Vela Admin
        </Link>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {LINKS.map((l) => {
            const Icon = l.icon;
            const active =
              l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2 px-3 py-2 font-sans text-sm ${
                  active ? "bg-ink text-paper" : "text-ink/70 hover:bg-sand"
                }`}
              >
                <Icon size={16} />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-ink/10 p-3">
          <Link href="/" className="block px-3 py-2 font-sans text-xs uppercase tracking-wider text-ink/50">
            View store
          </Link>
          <form action={logoutAdmin}>
            <button type="submit" className="flex w-full items-center gap-2 px-3 py-2 font-sans text-sm text-ink/70">
              <LogOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-ink/10 bg-paper px-4 py-3 md:hidden">
          <span className="font-serif text-xl">Admin</span>
          <Link href="/" className="font-sans text-[11px] uppercase tracking-wider">
            Store
          </Link>
        </div>
        <nav className="flex gap-2 overflow-x-auto border-b border-ink/10 bg-paper px-3 py-2 md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap px-2 py-1 font-sans text-xs uppercase tracking-wider">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
