import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-serif text-5xl">Not found</h1>
      <p className="mt-4 font-sans text-sm text-ink/60">That page isn’t in the catalog.</p>
      <Link href="/shop" className="mt-8 inline-block bg-ink px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-paper">
        Shop
      </Link>
    </main>
  );
}
