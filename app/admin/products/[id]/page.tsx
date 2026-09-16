import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById, listCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    listCategories(),
  ]);
  if (!product) notFound();
  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">Edit product</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
