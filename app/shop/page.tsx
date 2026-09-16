import type { Metadata } from "next";
import { CatalogView } from "@/components/store/CatalogView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <CatalogView searchParams={sp} />;
}
