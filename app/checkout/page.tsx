import { CheckoutForm } from "@/components/store/CheckoutForm";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h1 className="mb-8 font-serif text-5xl">Checkout</h1>
      {error && (
        <p className="mb-6 font-sans text-sm text-rust">
          Please fill in every delivery field.
        </p>
      )}
      <CheckoutForm />
    </main>
  );
}
