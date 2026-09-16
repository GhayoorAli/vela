import type { ReactNode } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Camera } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function AdminHome() {
  const [productCount, orderCount, tryOnCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.product.count({ where: { tryOnLensId: { not: null } } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const revenue = await prisma.order.aggregate({ _sum: { total: true } });

  return (
    <div>
      <h1 className="font-serif text-4xl">Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={String(productCount)} icon={<Package size={16} />} />
        <Stat label="Orders" value={String(orderCount)} icon={<ShoppingBag size={16} />} />
        <Stat label="Try-on ready" value={String(tryOnCount)} icon={<Camera size={16} />} />
        <Stat label="Revenue" value={formatPrice(revenue._sum.total ?? 0)} />
      </div>
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Recent orders</h2>
          <Link href="/admin/orders" className="font-sans text-[11px] uppercase tracking-wider text-ink/50">
            All orders
          </Link>
        </div>
        <div className="mt-4 divide-y divide-ink/10 border border-ink/10 bg-paper">
          {orders.length === 0 && (
            <p className="p-6 font-sans text-sm text-ink/50">No orders yet.</p>
          )}
          {orders.map((o) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between px-4 py-3 font-sans text-sm">
              <span>{o.number}</span>
              <span className="text-ink/50">{o.name}</span>
              <span className="capitalize text-ink/50">{o.status}</span>
              <span>{formatPrice(o.total)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="border border-ink/10 bg-paper p-5">
      <p className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.16em] text-ink/45">
        {icon} {label}
      </p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
