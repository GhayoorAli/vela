"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/lib/cart";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const bare = pathname.startsWith("/admin") || pathname === "/try-on";

  return (
    <CartProvider>
      {bare ? (
        children
      ) : (
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      )}
    </CartProvider>
  );
}
