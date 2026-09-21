import { NextResponse } from "next/server";
import { recommend, type RecommendInput } from "@/lib/recommend";

export const dynamic = "force-dynamic";

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export async function POST(request: Request) {
  let body: Partial<RecommendInput> = {};
  try {
    body = (await request.json()) as Partial<RecommendInput>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const mode = body.mode;
  if (mode !== "product" && mode !== "cart" && mode !== "stylist") {
    return NextResponse.json({ error: "Unknown mode" }, { status: 400 });
  }

  const result = await recommend({
    mode,
    productSlug:
      typeof body.productSlug === "string" ? body.productSlug.trim() : undefined,
    cartSlugs: asStringArray(body.cartSlugs),
    query: typeof body.query === "string" ? body.query.slice(0, 200) : undefined,
  });

  return NextResponse.json(result);
}
