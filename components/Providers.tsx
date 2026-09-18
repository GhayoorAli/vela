"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/lib/cart";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { MobileTabBar } from "@/components/pwa/MobileTabBar";
import { StandaloneClass } from "@/components/pwa/StandaloneClass";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const bare = pathname.startsWith("/admin") || pathname === "/try-on";

  return (
    <CartProvider>
      <StandaloneClass />
      {bare ? (
        children
      ) : (
        <div className="flex min-h-screen flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <MobileTabBar />
          <InstallPrompt />
        </div>
      )}
    </CartProvider>
  );
}
