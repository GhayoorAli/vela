import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-serif text-6xl tracking-tight md:text-7xl">Not found</h1>
      <p className="mt-4 font-sans text-sm text-ink/50">That page isn’t in the catalog.</p>
      <Link href="/shop" className="btn-solid mt-10">
        Shop the edit
      </Link>
    </main>
  );
}
