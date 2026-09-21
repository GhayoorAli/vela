import { shot } from "../lib/media";
import { prisma } from "../lib/prisma";

/**
 * Optional: attach Snap Camera Kit lenses to seeded products without editing
 * this file. Format: "slug=lensId,slug=lensId[@lensGroupId]".
 *
 *   TRY_ON_LENSES="milk-tee=1a2b3c,ivory-hoodie=4d5e6f@0000-group"
 */
function lensMap() {
  const out = new Map<string, { lensId: string; groupId: string | null }>();
  const raw = process.env.TRY_ON_LENSES?.trim();
  if (!raw) return out;
  for (const pair of raw.split(",")) {
    const [slug, rest] = pair.split("=").map((s) => s.trim());
    if (!slug || !rest) continue;
    const [lensId, groupId] = rest.split("@").map((s) => s.trim());
    if (lensId) out.set(slug, { lensId, groupId: groupId || null });
  }
  return out;
}

type SeedProduct = {
  slug: string;
  name: string;
  price: number;
  compareAt: number | null;
  fabric: string;
  featured: boolean;
  stock: number;
  category: "hoodies" | "tees" | "trousers" | "eyewear";
  sizes: string[];
  colors: { name: string; hex: string }[];
  image: string;
  description: string;
};

async function main() {
  const lenses = lensMap();

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const hoodies = await prisma.category.create({
    data: {
      slug: "hoodies",
      name: "Hoodies",
      description: "Six colourways. Same cut. Front-facing studio stills.",
      image: shot("ivory-hoodie.png"),
    },
  });
  const tees = await prisma.category.create({
    data: {
      slug: "tees",
      name: "T-Shirts",
      description: "Straight crew necks, photographed for try-on.",
      image: shot("rust-tee.png"),
    },
  });
  const trousers = await prisma.category.create({
    data: {
      slug: "trousers",
      name: "Trousers",
      description: "Jeans and chinos, hanging straight in studio light.",
      image: shot("indigo-jeans.png"),
    },
  });
  const eyewear = await prisma.category.create({
    data: {
      slug: "eyewear",
      name: "Eyewear",
      description: "Frames and sun, shot front-on for the fitting room.",
      image: shot("tortoise-frames.png"),
    },
  });

  const cats = {
    hoodies: hoodies.id,
    tees: tees.id,
    trousers: trousers.id,
    eyewear: eyewear.id,
  };

  const topSizes = ["S", "M", "L", "XL"];
  const teeSizes = ["XS", "S", "M", "L", "XL"];
  const trouserSizes = ["28", "30", "32", "34", "36"];

  const products: SeedProduct[] = [
    {
      slug: "ivory-hoodie",
      name: "Ivory Fleece Hoodie",
      price: 120,
      compareAt: null,
      fabric: "Brushed cotton fleece",
      featured: true,
      stock: 28,
      category: "hoodies",
      sizes: topSizes,
      colors: [{ name: "Ivory", hex: "#f4efe6" }],
      image: shot("ivory-hoodie.png"),
      description:
        "Relaxed fleece with a kangaroo pocket and a double-layer hood. Photographed straight-on for a clean try-on silhouette.",
    },
    {
      slug: "ember-hoodie",
      name: "Ember Fleece Hoodie",
      price: 124,
      compareAt: null,
      fabric: "Brushed cotton fleece",
      featured: true,
      stock: 24,
      category: "hoodies",
      sizes: topSizes,
      colors: [{ name: "Ember", hex: "#c45c32" }],
      image: shot("ember-hoodie.png"),
      description:
        "The same generous hoodie cut in a rust fleece. Front-facing still, ready for the fitting room.",
    },
    {
      slug: "navy-hoodie",
      name: "Navy Fleece Hoodie",
      price: 120,
      compareAt: null,
      fabric: "Brushed cotton fleece",
      featured: false,
      stock: 26,
      category: "hoodies",
      sizes: topSizes,
      colors: [{ name: "Navy", hex: "#1e3a5f" }],
      image: shot("navy-hoodie.png"),
      description:
        "Deep navy fleece, same pocket and hood. A darker colourway of the house hoodie.",
    },
    {
      slug: "moss-hoodie",
      name: "Moss Fleece Hoodie",
      price: 122,
      compareAt: null,
      fabric: "Brushed cotton fleece",
      featured: false,
      stock: 22,
      category: "hoodies",
      sizes: topSizes,
      colors: [{ name: "Moss", hex: "#5c6b3d" }],
      image: shot("moss-hoodie.png"),
      description:
        "Olive fleece with a quiet, everyday hang. Pair with sand or stone trousers.",
    },
    {
      slug: "ink-hoodie",
      name: "Ink Fleece Hoodie",
      price: 120,
      compareAt: null,
      fabric: "Brushed cotton fleece",
      featured: false,
      stock: 30,
      category: "hoodies",
      sizes: topSizes,
      colors: [{ name: "Ink", hex: "#1a1917" }],
      image: shot("ink-hoodie.png"),
      description:
        "Black fleece, clean face, no graphic. The darkest hoodie in the edit.",
    },
    {
      slug: "sun-hoodie",
      name: "Sun Fleece Hoodie",
      price: 126,
      compareAt: null,
      fabric: "Brushed cotton fleece",
      featured: false,
      stock: 20,
      category: "hoodies",
      sizes: topSizes,
      colors: [{ name: "Sun", hex: "#d4a017" }],
      image: shot("sun-hoodie.png"),
      description:
        "Mustard fleece for a brighter weekend. Same straight cut as the rest of the set.",
    },
    {
      slug: "milk-tee",
      name: "Milk Crew Tee",
      price: 42,
      compareAt: 56,
      fabric: "240gsm organic cotton",
      featured: true,
      stock: 40,
      category: "tees",
      sizes: teeSizes,
      colors: [{ name: "Milk", hex: "#f7f4ef" }],
      image: shot("milk-tee.png"),
      description:
        "A dropped-shoulder white crew, photographed face-on so the drape is obvious before you try it live.",
    },
    {
      slug: "ink-tee",
      name: "Ink Crew Tee",
      price: 42,
      compareAt: null,
      fabric: "Organic cotton jersey",
      featured: false,
      stock: 42,
      category: "tees",
      sizes: teeSizes,
      colors: [{ name: "Ink", hex: "#1a1917" }],
      image: shot("ink-tee.png"),
      description:
        "A clean black crew. Mid weight, set-in sleeve, no graphic.",
    },
    {
      slug: "rust-tee",
      name: "Rust Crew Tee",
      price: 44,
      compareAt: null,
      fabric: "Organic cotton jersey",
      featured: true,
      stock: 36,
      category: "tees",
      sizes: teeSizes,
      colors: [{ name: "Rust", hex: "#b85c38" }],
      image: shot("rust-tee.png"),
      description:
        "Terracotta crew with the same straight hang as the white tee.",
    },
    {
      slug: "sage-tee",
      name: "Sage Crew Tee",
      price: 44,
      compareAt: null,
      fabric: "Organic cotton jersey",
      featured: false,
      stock: 34,
      category: "tees",
      sizes: teeSizes,
      colors: [{ name: "Sage", hex: "#7d9b76" }],
      image: shot("sage-tee.png"),
      description:
        "A softer green crew. Easy under a navy hoodie or with moss trousers.",
    },
    {
      slug: "sky-tee",
      name: "Sky Crew Tee",
      price: 42,
      compareAt: null,
      fabric: "Organic cotton jersey",
      featured: false,
      stock: 38,
      category: "tees",
      sizes: teeSizes,
      colors: [{ name: "Sky", hex: "#6b9ac4" }],
      image: shot("sky-tee.png"),
      description:
        "Light blue jersey, same crew cut. A colourway for warmer days.",
    },
    {
      slug: "wine-tee",
      name: "Wine Crew Tee",
      price: 46,
      compareAt: null,
      fabric: "Organic cotton jersey",
      featured: false,
      stock: 32,
      category: "tees",
      sizes: teeSizes,
      colors: [{ name: "Wine", hex: "#6e2d3c" }],
      image: shot("wine-tee.png"),
      description:
        "Burgundy crew with a dense hand. Wear with ink trousers or sand chinos.",
    },
    {
      slug: "indigo-jeans",
      name: "Indigo Straight Jeans",
      price: 128,
      compareAt: null,
      fabric: "Organic denim, 13oz",
      featured: true,
      stock: 26,
      category: "trousers",
      sizes: trouserSizes,
      colors: [{ name: "Indigo", hex: "#2c3d56" }],
      image: shot("indigo-jeans.png"),
      description:
        "Straight-leg jean, mid rise, unwashed finish. Shot hanging so the full length is visible.",
    },
    {
      slug: "sand-chinos",
      name: "Sand Chino Trousers",
      price: 118,
      compareAt: null,
      fabric: "Cotton twill",
      featured: true,
      stock: 22,
      category: "trousers",
      sizes: trouserSizes,
      colors: [{ name: "Sand", hex: "#c4b396" }],
      image: shot("sand-chinos.png"),
      description:
        "Slim chino with a clean front. Easy with a hoodie or a tee.",
    },
    {
      slug: "ink-trousers",
      name: "Ink Straight Trousers",
      price: 122,
      compareAt: null,
      fabric: "Cotton twill",
      featured: false,
      stock: 20,
      category: "trousers",
      sizes: trouserSizes,
      colors: [{ name: "Ink", hex: "#1a1917" }],
      image: shot("ink-trousers.png"),
      description:
        "Black straight trousers. A sharper pair for a white tee or the navy hoodie.",
    },
    {
      slug: "moss-trousers",
      name: "Moss Chino Trousers",
      price: 118,
      compareAt: null,
      fabric: "Cotton twill",
      featured: false,
      stock: 18,
      category: "trousers",
      sizes: trouserSizes,
      colors: [{ name: "Moss", hex: "#5c6b3d" }],
      image: shot("moss-trousers.png"),
      description:
        "Olive chino, same taper as the sand pair. Works with rust or ivory up top.",
    },
    {
      slug: "stone-trousers",
      name: "Stone Easy Trousers",
      price: 112,
      compareAt: null,
      fabric: "Cotton twill",
      featured: false,
      stock: 24,
      category: "trousers",
      sizes: trouserSizes,
      colors: [{ name: "Stone", hex: "#8a8580" }],
      image: shot("stone-trousers.png"),
      description:
        "Grey casual trousers with a clean hang. The quiet pair in the set.",
    },
    {
      slug: "rust-chinos",
      name: "Rust Chino Trousers",
      price: 118,
      compareAt: null,
      fabric: "Cotton twill",
      featured: false,
      stock: 16,
      category: "trousers",
      sizes: trouserSizes,
      colors: [{ name: "Rust", hex: "#b5682a" }],
      image: shot("rust-chinos.png"),
      description:
        "Camel-rust chino. Pair with the ink tee or the ivory hoodie.",
    },
    {
      slug: "ink-wayfarers",
      name: "Ink Wayfarers",
      price: 92,
      compareAt: null,
      fabric: "Acetate + CR-39 lenses",
      featured: false,
      stock: 30,
      category: "eyewear",
      sizes: ["One size"],
      colors: [{ name: "Ink", hex: "#111110" }],
      image: shot("ink-wayfarers.png"),
      description:
        "Soft-square sun frames, shot front-on. UV400. A pair for a white tee.",
    },
    {
      slug: "tortoise-frames",
      name: "Tortoise Acetate Frames",
      price: 78,
      compareAt: null,
      fabric: "Hand-polished acetate",
      featured: true,
      stock: 36,
      category: "eyewear",
      sizes: ["One size"],
      colors: [{ name: "Tortoise", hex: "#6b4a32" }],
      image: shot("tortoise-frames.png"),
      description:
        "Optical frames with a keyhole bridge. Front-facing still for a true try-on preview.",
    },
    {
      slug: "halo-rounds",
      name: "Halo Round Sunglasses",
      price: 88,
      compareAt: null,
      fabric: "Gold metal + mineral lens",
      featured: true,
      stock: 24,
      category: "eyewear",
      sizes: ["One size"],
      colors: [{ name: "Gold", hex: "#c4a574" }],
      image: shot("halo-rounds.png"),
      description:
        "Slim round sun frames in a warm metal. Light on a white tee or hoodie.",
    },
    {
      slug: "clear-coast",
      name: "Clear Coast Sunglasses",
      price: 86,
      compareAt: null,
      fabric: "Crystal acetate + brown lens",
      featured: false,
      stock: 22,
      category: "eyewear",
      sizes: ["One size"],
      colors: [{ name: "Clear", hex: "#e8e4dc" }],
      image: shot("clear-coast.png"),
      description:
        "Transparent acetate with a warm lens. The lightest pair in the case.",
    },
    {
      slug: "moss-sunglasses",
      name: "Moss Sunglasses",
      price: 90,
      compareAt: null,
      fabric: "Acetate + CR-39 lenses",
      featured: false,
      stock: 20,
      category: "eyewear",
      sizes: ["One size"],
      colors: [{ name: "Moss", hex: "#3d4a2e" }],
      image: shot("moss-sunglasses.png"),
      description:
        "Olive acetate sun frames. Match to the moss hoodie or sage tee.",
    },
    {
      slug: "ember-cateye",
      name: "Ember Cat-Eye",
      price: 96,
      compareAt: null,
      fabric: "Acetate + gradient lens",
      featured: false,
      stock: 18,
      category: "eyewear",
      sizes: ["One size"],
      colors: [{ name: "Ember", hex: "#b85c38" }],
      image: shot("ember-cateye.png"),
      description:
        "A rust cat-eye, shot straight-on. Everyday sun with a sharper line.",
    },
  ];

  for (const p of products) {
    const lens = lenses.get(p.slug);
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        price: p.price,
        compareAt: p.compareAt,
        fabric: p.fabric,
        featured: p.featured,
        stock: p.stock,
        categoryId: cats[p.category],
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        images: JSON.stringify([p.image]),
        description: p.description,
        tryOnLensId: lens?.lensId ?? null,
        tryOnLensGroupId: lens?.groupId ?? null,
      },
    });
  }

  console.log(
    `Seeded ${products.length} products (${lenses.size} with try-on lenses).`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
