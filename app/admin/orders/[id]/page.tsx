import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions";
import { formatDate, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ink/45">Order</p>
      <h1 className="mt-1 font-serif text-4xl">{order.number}</h1>
      <p className="mt-2 font-sans text-sm text-ink/55">{formatDate(order.createdAt)}</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 font-sans text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-ink/45">Customer</dt>
          <dd className="mt-1">
            {order.name}
            <br />
            {order.email}
            <br />
            {order.phone}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-ink/45">Ship to</dt>
          <dd className="mt-1">
            {order.address}
            <br />
            {order.city}
            <br />
            {order.method === "cod" ? "Cash on delivery" : "Bank transfer"}
          </dd>
        </div>
      </dl>

      <form action={updateOrderStatus} className="mt-8 flex items-center gap-3">
        <input type="hidden" name="id" value={order.id} />
        <select name="status" defaultValue={order.status} className="border border-ink/15 bg-paper px-3 py-2 font-sans text-sm">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-ink px-4 py-2 font-sans text-[11px] uppercase tracking-[0.16em] text-paper">
          Update status
        </button>
      </form>

      <ul className="mt-8 divide-y divide-ink/10 border border-ink/10 bg-paper">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between px-4 py-3 font-sans text-sm">
            <span>
              {item.name} × {item.qty}
              <span className="block text-[11px] uppercase tracking-wider text-ink/40">
                {item.color} · {item.size}
              </span>
            </span>
            <span>{formatPrice(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right font-sans text-sm">Total {formatPrice(order.total)}</p>
      {order.notes && (
        <p className="mt-4 font-sans text-sm text-ink/60">Notes: {order.notes}</p>
      )}
    </div>
  );
}
