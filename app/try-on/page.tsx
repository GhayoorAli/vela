import { Camera } from "lucide-react";
import Link from "next/link";
import { TryOnRoom } from "@/components/tryon/TryOnRoom";
import { listTryOnProducts } from "@/lib/catalog";
import { getTryOnConfig, toTryOnProduct } from "@/lib/tryon";

export const dynamic = "force-dynamic";
export const metadata = { title: "Live try-on" };

export default async function TryOnPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const slug = Array.isArray(sp.product) ? sp.product[0] : sp.product;
  const backHref = slug ? `/products/${slug}` : "/shop";

  const config = getTryOnConfig();
  if (!config) {
    return (
      <Notice title="AR try-on is currently unavailable." backHref={backHref}>
        You can still browse and shop the collection.
      </Notice>
    );
  }

  const products = (await listTryOnProducts())
    .map((p) => toTryOnProduct(p, config.lensGroupId))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (products.length === 0) {
    return (
      <Notice title="No pieces are ready to try on yet" backHref={backHref}>
        No products currently support camera try-on. Browse the collection below.
      </Notice>
    );
  }

  if (slug && !products.some((p) => p.slug === slug)) {
    return (
      <Notice title="This piece has no try-on lens yet" backHref={backHref}>
        You can still try on the other pieces in the fitting room.
        <div className="mt-6">
          <Link
            href="/try-on"
            className="inline-flex items-center gap-2 bg-paper px-6 py-3 font-sans text-[12px] uppercase tracking-[0.08em] text-ink"
          >
            <Camera size={14} /> Open the fitting room
          </Link>
        </div>
      </Notice>
    );
  }

  return (
    <TryOnRoom
      apiToken={config.apiToken}
      products={products}
      initialSlug={slug}
      backHref={backHref}
    />
  );
}

function Notice({
  title,
  backHref,
  children,
}: {
  title: string;
  backHref: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mirror-notice flex min-h-[100dvh] flex-col items-center justify-center bg-petrol px-6 text-center text-paper">
      <span className="mb-10 text-6xl text-citron" aria-hidden>
        ✳
      </span>
      <p className="studio-label text-citron">AR TRY-ON</p>
      <h1 className="mt-5 max-w-xl text-4xl font-medium leading-[1.1] tracking-[-0.05em] md:text-6xl">
        {title}
      </h1>
      <div className="mt-5 max-w-md font-sans text-sm font-normal leading-relaxed text-paper/65 [&_code]:bg-paper/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px]">
        {children}
      </div>
      <Link
        href={backHref}
        className="studio-button studio-button-citron mt-10"
      >
        Back to the collection
      </Link>
    </main>
  );
}
