"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminToken, checkPassword, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) {
    redirect("/admin/login?error=1");
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function placeOrder(formData: FormData) {
  const rawItems = String(formData.get("items") || "[]");
  const items = JSON.parse(rawItems) as Array<{
    productId: string;
    name: string;
    price: number;
    qty: number;
    size: string;
    color: string;
  }>;
  if (!items.length) redirect("/cart");

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const method = String(formData.get("method") || "cod");
  const notes = String(formData.get("notes") || "").trim();

  if (!name || !email || !phone || !address || !city) {
    redirect("/checkout?error=1");
  }

  const total = items.reduce((n, i) => n + i.price * i.qty, 0);
  const number = `VL-${Date.now().toString(36).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      number,
      name,
      email,
      phone,
      address,
      city,
      method,
      notes,
      total,
      status: "pending",
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          qty: i.qty,
          size: i.size,
          color: i.color,
        })),
      },
    },
  });

  for (const i of items) {
    await prisma.product.update({
      where: { id: i.productId },
      data: { stock: { decrement: i.qty } },
    });
  }

  redirect(`/checkout/success?order=${order.number}`);
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name") || "").trim(),
    slug: String(formData.get("slug") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    price: Number(formData.get("price") || 0),
    compareAt: formData.get("compareAt")
      ? Number(formData.get("compareAt"))
      : null,
    fabric: String(formData.get("fabric") || "").trim(),
    tryOnLensId: String(formData.get("tryOnLensId") || "").trim() || null,
    tryOnLensGroupId:
      String(formData.get("tryOnLensGroupId") || "").trim() || null,
    images: JSON.stringify(
      String(formData.get("images") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
    colors: JSON.stringify(
      String(formData.get("colors") || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, hex] = line.split("|").map((s) => s.trim());
          return { name, hex: hex || "#888888" };
        }),
    ),
    sizes: JSON.stringify(
      String(formData.get("sizes") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
    featured: formData.get("featured") === "on",
    inStock: formData.get("inStock") === "on",
    stock: Number(formData.get("stock") || 0),
    categoryId: String(formData.get("categoryId") || ""),
  };

  if (id) {
    await prisma.product.update({ where: { id }, data: payload });
  } else {
    await prisma.product.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/try-on");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/try-on");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "pending");
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${id}`);
}
