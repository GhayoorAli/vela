import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      <div className="mt-8 overflow-x-auto border border-ink/10 bg-paper">
        <table className="w-full text-left font-sans text-sm">
          <thead className="border-b border-ink/10 text-[11px] uppercase tracking-wider text-ink/45">
            <tr>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-ink/45">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-ink/5">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                    {o.number}
                  </Link>
                </td>
                <td className="px-4 py-3">{o.name}</td>
                <td className="px-4 py-3 text-ink/50">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
                <td className="px-4 py-3">{formatPrice(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
