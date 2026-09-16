import { CartPageClient } from "@/components/store/CartPageClient";

export const metadata = { title: "Bag" };

export default function CartPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h1 className="mb-10 font-serif text-5xl">Your bag</h1>
      <CartPageClient />
    </main>
  );
}
