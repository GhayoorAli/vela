import { CartPageClient } from "@/components/store/CartPageClient";

export const metadata = { title: "Bag" };

export default function CartPage() {
  return (
    <main className="mx-auto max-w-frame px-6 py-16 md:px-8">
      <p className="eyebrow">Atelier</p>
      <h1 className="mb-12 mt-2 font-serif text-6xl tracking-tight md:text-7xl">Your bag</h1>
      <CartPageClient />
    </main>
  );
}
