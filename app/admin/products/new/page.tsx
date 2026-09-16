import { ProductForm } from "@/components/admin/ProductForm";
import { listCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "New product" };

export default async function NewProductPage() {
  const categories = await listCategories();
  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">New product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
