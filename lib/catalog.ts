import type { Category, Product as DbProduct } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CATEGORY_IMAGES, PRODUCT_IMAGES, sortCategories } from "@/lib/media";
import type {
  ProductColor,
  ProductFilters,
  StoreProduct,
  TryOnProduct,
} from "@/lib/types";

export type { ProductColor, ProductFilters, StoreProduct, TryOnProduct };

type ProductRow = DbProduct & { category: Category };

export function hydrateProduct(row: ProductRow): StoreProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    compareAt: row.compareAt,
    fabric: row.fabric,
    tryOnLensId: row.tryOnLensId?.trim() || null,
    tryOnLensGroupId: row.tryOnLensGroupId?.trim() || null,
    images: PRODUCT_IMAGES[row.slug] ?? (JSON.parse(row.images) as string[]),
    colors: JSON.parse(row.colors) as ProductColor[],
    sizes: JSON.parse(row.sizes) as string[],
    featured: row.featured,
    inStock: row.inStock,
    stock: row.stock,
    categoryId: row.categoryId,
    category: { slug: row.category.slug, name: row.category.name },
    createdAt: row.createdAt,
  };
}

export async function listCategories() {
  const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return sortCategories(
    rows.map((c) => ({
      ...c,
      image: CATEGORY_IMAGES[c.slug] ?? c.image,
    })),
  );
}

export async function getCategory(slug: string) {
  const row = await prisma.category.findUnique({ where: { slug } });
  if (!row) return null;
  return { ...row, image: CATEGORY_IMAGES[row.slug] ?? row.image };
}

export async function getProductBySlug(slug: string) {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  return row ? hydrateProduct(row) : null;
}

export async function getProductById(id: string) {
  const row = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  return row ? hydrateProduct(row) : null;
}

export async function listProducts(filters: ProductFilters = {}) {
  const rows = await prisma.product.findMany({
    include: { category: true },
    orderBy:
      filters.sort === "price-asc"
        ? { price: "asc" }
        : filters.sort === "price-desc"
          ? { price: "desc" }
          : filters.sort === "newest"
            ? { createdAt: "desc" }
            : { featured: "desc" },
  });

  let items = rows.map(hydrateProduct);

  if (filters.category) {
    items = items.filter((p) => p.category.slug === filters.category);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q),
    );
  }
  if (filters.size) {
    items = items.filter((p) => p.sizes.includes(filters.size!));
  }
  if (filters.color) {
    const c = filters.color.toLowerCase();
    items = items.filter((p) =>
      p.colors.some((x) => x.name.toLowerCase() === c),
    );
  }
  if (filters.tryon === "1") {
    items = items.filter((p) => Boolean(p.tryOnLensId));
  }
  if (filters.minPrice != null) {
    items = items.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    items = items.filter((p) => p.price <= filters.maxPrice!);
  }

  if (!filters.sort || filters.sort === "featured") {
    items.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  }

  return items;
}

export async function relatedProducts(product: StoreProduct, take = 4) {
  const rows = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: { category: true },
    take,
  });
  return rows.map(hydrateProduct);
}

export function toRecommendPick(
  product: StoreProduct,
  reason: string,
): import("@/lib/types").RecommendPick {
  return {
    slug: product.slug,
    name: product.name,
    price: product.price,
    compareAt: product.compareAt,
    image: product.images[0] ?? "",
    category: product.category.name,
    tryOn: Boolean(product.tryOnLensId),
    reason,
  };
}

/** Every product that has a try-on lens attached, featured first. */
export async function listTryOnProducts() {
  const rows = await prisma.product.findMany({
    where: { tryOnLensId: { not: null } },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
  return rows.map(hydrateProduct).filter((p) => Boolean(p.tryOnLensId));
}
