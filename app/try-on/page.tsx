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
      <Notice
        title="The fitting room isn't connected yet"
        backHref={backHref}
      >
        Add <code>CAMERA_KIT_API_TOKEN</code> and{" "}
        <code>CAMERA_KIT_LENS_GROUP_ID</code> from the Snap Camera Kit portal to{" "}
        <code>.env</code>, then restart the server. See{" "}
        <code>.env.example</code> for the steps.
      </Notice>
    );
  }

  const products = (await listTryOnProducts())
    .map((p) => toTryOnProduct(p, config.lensGroupId))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (products.length === 0) {
    return (
      <Notice title="No pieces are ready to try on yet" backHref={backHref}>
        Attach a Lens ID to a product in{" "}
        <Link href="/admin/products" className="underline">
          Admin → Products
        </Link>{" "}
        and it will appear here.
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
            className="inline-flex items-center gap-2 bg-paper px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-ink"
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
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-ink px-6 text-center text-paper">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.32em] text-paper/45">
        Live AR fitting room
      </p>
      <h1 className="mt-5 max-w-lg font-serif text-5xl leading-[1.05] tracking-tight">{title}</h1>
      <div className="mt-5 max-w-md font-sans text-sm font-light leading-relaxed text-paper/65 [&_code]:bg-paper/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px]">
        {children}
      </div>
      <Link
        href={backHref}
        className="mt-12 border border-paper/35 px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.22em] text-paper/90 transition hover:bg-paper hover:text-ink"
      >
        Back
      </Link>
    </main>
  );
}
