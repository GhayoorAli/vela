import { CheckoutForm } from "@/components/store/CheckoutForm";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto max-w-frame px-6 py-16 md:px-8">
      <p className="eyebrow">Secure checkout</p>
      <h1 className="mb-12 mt-2 font-serif text-6xl tracking-tight md:text-7xl">Checkout</h1>
      {error && (
        <p className="mb-8 font-sans text-sm text-rust">
          Please fill in every delivery field.
        </p>
      )}
      <CheckoutForm />
    </main>
  );
}
