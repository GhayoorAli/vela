import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { hydrateProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function AdminProducts() {
  const rows = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });
  const products = rows.map(hydrateProduct);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl">Products</h1>
        <Link href="/admin/products/new" className="bg-ink px-4 py-2 font-sans text-[11px] uppercase tracking-[0.18em] text-paper">
          New product
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto border border-ink/10 bg-paper">
        <table className="w-full text-left font-sans text-sm">
          <thead className="border-b border-ink/10 text-[11px] uppercase tracking-wider text-ink/45">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Try-on</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-ink/5">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/60">{p.category.name}</td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  {p.tryOnLensId ? (
                    <span className="font-mono text-[11px] text-ink/70" title={p.tryOnLensId}>
                      {p.tryOnLensId.length > 14
                        ? `${p.tryOnLensId.slice(0, 12)}…`
                        : p.tryOnLensId}
                    </span>
                  ) : (
                    <span className="text-ink/35">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
