import { notFound } from "next/navigation";
import { CatalogView } from "@/components/store/CatalogView";
import { getCategory } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = await getCategory(category);
  return { title: cat?.name ?? "Shop" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category } = await params;
  const sp = await searchParams;
  const cat = await getCategory(category);
  if (!cat) notFound();
  return <CatalogView searchParams={sp} categorySlug={category} />;
}
