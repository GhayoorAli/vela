import { listProducts, toRecommendPick } from "@/lib/catalog";
import type {
  RecommendMode,
  RecommendPick,
  RecommendResponse,
  StoreProduct,
} from "@/lib/types";

export type RecommendInput = {
  mode: RecommendMode;
  productSlug?: string;
  cartSlugs?: string[];
  query?: string;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { at: number; value: RecommendResponse }>();

function cacheKey(input: RecommendInput) {
  return JSON.stringify({
    v: 4,
    mode: input.mode,
    productSlug: input.productSlug ?? "",
    cartSlugs: [...(input.cartSlugs ?? [])].sort(),
    query: (input.query ?? "").trim().toLowerCase(),
  });
}

function exclude(products: StoreProduct[], slugs: Set<string>) {
  return products.filter((p) => !slugs.has(p.slug));
}

function overlapScore(a: StoreProduct, b: StoreProduct) {
  const aColors = new Set(a.colors.map((c) => c.name.toLowerCase()));
  const colorHits = b.colors.filter((c) => aColors.has(c.name.toLowerCase())).length;
  const sameCat = a.category.slug === b.category.slug ? 1 : 0;
  const apparel = new Set(["hoodies", "tees", "trousers"]);
  const complement =
    a.category.slug !== b.category.slug
      ? a.category.slug === "eyewear" || b.category.slug === "eyewear"
        ? 4
        : apparel.has(a.category.slug) && apparel.has(b.category.slug)
          ? 3
          : 2
      : 0;
  return complement * 10 + colorHits * 6 + (b.featured ? 3 : 0) - sameCat * 2;
}

function reasonFor(anchor: StoreProduct | undefined, pick: StoreProduct, query?: string) {
  if (query?.trim()) {
    return `Chosen for “${query.trim()}” — ${pick.fabric.toLowerCase()}, ${pick.colors[0]?.name ?? pick.category.name}.`;
  }
  if (!anchor) {
    return `${pick.category.name} · ${pick.fabric}`;
  }
  if (anchor.category.slug !== pick.category.slug) {
    return `Completes ${anchor.name} with ${pick.category.name.toLowerCase()} in ${pick.colors[0]?.name ?? "the house palette"}.`;
  }
  const shared = pick.colors.find((c) =>
    anchor.colors.some((x) => x.name.toLowerCase() === c.name.toLowerCase()),
  );
  if (shared) {
    return `Same ${shared.name.toLowerCase()} register as ${anchor.name}.`;
  }
  return `Another ${pick.category.name.toLowerCase()} piece if you want a second option.`;
}

function heuristic(
  catalog: StoreProduct[],
  input: RecommendInput,
): RecommendResponse {
  const banned = new Set(
    [
      input.productSlug,
      ...(input.cartSlugs ?? []),
    ].filter(Boolean) as string[],
  );
  const pool = exclude(catalog, banned);
  const anchor = catalog.find((p) => p.slug === input.productSlug);

  let ranked = pool;
  if (input.mode === "stylist" && input.query?.trim()) {
    const q = input.query.toLowerCase();
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    const occasion: Record<string, string[]> = {
      dinner: ["shirt", "chino", "jacket", "frame", "sunglasses"],
      evening: ["jacket", "shirt", "sunglasses"],
      weekend: ["hoodie", "tee", "jean", "chino"],
      work: ["tee", "chino", "frame"],
      office: ["trouser", "frame"],
      casual: ["hoodie", "tee", "jean", "pant"],
      market: ["hoodie", "tee", "sunglasses"],
    };
    ranked = pool
      .map((p) => {
        const hay = `${p.name} ${p.description} ${p.fabric} ${p.category.name} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase();
        let score = p.featured ? 2 : 0;
        for (const word of words) {
          if (hay.includes(word)) score += 8;
          if (p.colors.some((c) => c.name.toLowerCase().includes(word))) score += 10;
          for (const hint of occasion[word] ?? []) {
            if (hay.includes(hint)) score += 6;
          }
        }
        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);
  } else if (anchor) {
    ranked = [...pool].sort(
      (a, b) => overlapScore(anchor, b) - overlapScore(anchor, a),
    );
  } else if (input.cartSlugs?.length) {
    const inBag = catalog.filter((p) => input.cartSlugs!.includes(p.slug));
    const have = new Set(inBag.map((p) => p.category.slug));
    ranked = [...pool].sort((a, b) => {
      const aNew = have.has(a.category.slug) ? 0 : 5;
      const bNew = have.has(b.category.slug) ? 0 : 5;
      return bNew - aNew || Number(b.featured) - Number(a.featured);
    });
  } else {
    ranked = pool.filter((p) => p.featured);
  }

  const picks = ranked.slice(0, 4).map((p) =>
    toRecommendPick(p, reasonFor(anchor, p, input.query)),
  );

  if (input.mode === "stylist") {
    return {
      source: "atelier",
      eyebrow: "The stylist",
      headline: input.query?.trim()
        ? `Looks for “${input.query.trim()}”`
        : "Pieces from the house",
      picks,
    };
  }
  if (input.mode === "cart") {
    return {
      source: "atelier",
      eyebrow: "Complete the bag",
      headline: "Add one more piece",
      picks,
    };
  }
  return {
    source: "atelier",
    eyebrow: "The edit",
    headline: "You may also like",
    picks,
  };
}

function catalogBrief(products: StoreProduct[]) {
  return products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category.slug,
    price: p.price,
    colors: p.colors.map((c) => c.name),
    fabric: p.fabric,
    description: p.description.slice(0, 180),
  }));
}

async function fromOpenAI(
  catalog: StoreProduct[],
  input: RecommendInput,
): Promise<RecommendResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const banned = new Set(
    [input.productSlug, ...(input.cartSlugs ?? [])].filter(Boolean) as string[],
  );
  const allowed = exclude(catalog, banned);
  if (!allowed.length) return null;

  const context =
    input.mode === "product"
      ? `The customer is viewing: ${input.productSlug}. Recommend complementary pieces (complete the look) and one similar alternative.`
      : input.mode === "cart"
        ? `The customer has these in the bag: ${(input.cartSlugs ?? []).join(", ") || "nothing"}. Recommend pieces that complete the outfit.`
        : `The customer asked the stylist: "${input.query ?? ""}". Interpret the request as a look, occasion, colour, or fabric.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-6-luna";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        // gpt-6-luna / Sol: keep Chat Completions JSON stable without reasoning tokens
        reasoning_effort: "none",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are the stylist for Vela, a house for hoodies, t-shirts, trousers, and eyewear. Reply with JSON only: {\"headline\": string, \"picks\": [{\"slug\": string, \"reason\": string}]}. Pick 3 or 4 products. Use only slugs from the catalog. Reasons must be one short sentence, concrete (colour, fabric, occasion), no hype.",
          },
          {
            role: "user",
            content: `${context}\n\nCatalog:\n${JSON.stringify(catalogBrief(allowed))}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      if (process.env.NODE_ENV !== "production") {
        const detail = await res.text().catch(() => "");
        console.warn("[recommend] OpenAI", res.status, detail.slice(0, 400));
      }
      return null;
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      headline?: string;
      picks?: { slug?: string; reason?: string }[];
    };
    const bySlug = new Map(allowed.map((p) => [p.slug, p]));
    const picks: RecommendPick[] = [];
    for (const row of parsed.picks ?? []) {
      const product = row.slug ? bySlug.get(row.slug) : undefined;
      if (!product) continue;
      const reason = (row.reason || "").trim() || reasonFor(
        catalog.find((p) => p.slug === input.productSlug),
        product,
        input.query,
      );
      picks.push(toRecommendPick(product, reason));
      if (picks.length >= 4) break;
    }
    if (!picks.length) return null;

    const eyebrow =
      input.mode === "cart"
        ? "Complete the bag"
        : input.mode === "stylist"
          ? "The stylist"
          : "Styled for you";

    return {
      source: "ai",
      eyebrow,
      headline:
        parsed.headline?.trim() ||
        (input.mode === "stylist"
          ? "A look from the house"
          : "Worn with this piece"),
      picks,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function recommend(
  input: RecommendInput,
): Promise<RecommendResponse> {
  const key = cacheKey(input);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;

  const catalog = await listProducts();
  const ai = await fromOpenAI(catalog, input);
  const value = ai ?? heuristic(catalog, input);
  cache.set(key, { at: Date.now(), value });
  return value;
}
