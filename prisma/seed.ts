import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * Optional: attach Snap Camera Kit lenses to seeded products without editing
 * this file. Format: "slug=lensId,slug=lensId[@lensGroupId]".
 *
 *   TRY_ON_LENSES="hearth-tee=1a2b3c,harbor-hoodie=4d5e6f@0000-group"
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

async function main() {
  const lenses = lensMap();

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const clothing = await prisma.category.create({
    data: {
      slug: "clothing",
      name: "Clothing",
      description:
        "Ready-to-wear. Pieces marked “Try on” open the live fitting room.",
      image: img("photo-1490481651871-ab68de25d43d"),
    },
  });
  const eyewear = await prisma.category.create({
    data: {
      slug: "eyewear",
      name: "Eyewear",
      description: "Acetate frames and sun lenses, cut for everyday wear.",
      image: img("photo-1511499767150-a48a237f0083"),
    },
  });
  const living = await prisma.category.create({
    data: {
      slug: "furniture",
      name: "Living",
      description: "Furniture and lighting for the room.",
      image: img("photo-1555041469-a586c61ea9bc"),
    },
  });

  const products = [
    {
      slug: "hearth-tee",
      name: "Hearth Heavyweight Tee",
      price: 48,
      compareAt: 62,
      fabric: "240gsm organic cotton",
      featured: true,
      stock: 42,
      categoryId: clothing.id,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Rust", hex: "#9a3f2b" },
        { name: "Navy", hex: "#2c3a4a" },
        { name: "Ivory", hex: "#f4efe6" },
      ],
      images: ["/products/hearth-tee.jpg", "/products/hearth-tee-alt.jpg"],
      description:
        "A dropped-shoulder crewneck with a dense hand. Garment-dyed, pre-shrunk, and finished with a ribbed collar that holds its shape.",
    },
    {
      slug: "harbor-hoodie",
      name: "Harbor Fleece Hoodie",
      price: 120,
      compareAt: null,
      fabric: "Brushed cotton fleece",
      featured: true,
      stock: 28,
      categoryId: clothing.id,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Moss", hex: "#3d4a3c" },
        { name: "Ink", hex: "#1d1b19" },
        { name: "Cocoa", hex: "#5c4a3a" },
      ],
      images: ["/products/harbor-hoodie.jpg"],
      description:
        "Relaxed fleece with a kangaroo pocket, flat drawcords, and a double-layer hood. Cut generously through the body.",
    },
    {
      slug: "slate-chore-jacket",
      name: "Slate Chore Jacket",
      price: 186,
      compareAt: null,
      fabric: "Washed cotton canvas",
      featured: true,
      stock: 16,
      categoryId: clothing.id,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Slate", hex: "#3d4f63" },
        { name: "Tan", hex: "#6b4e3d" },
        { name: "Black", hex: "#2a2a28" },
      ],
      images: ["/products/slate-jacket.jpg", img("photo-1754570136399-0692a1ac32c8")],
      description:
        "Washed canvas work jacket with three patch pockets and corozo buttons. Softens with every wear.",
    },
    {
      slug: "loom-column-dress",
      name: "Loom Column Dress",
      price: 164,
      compareAt: 198,
      fabric: "Mid-weight twill",
      featured: true,
      stock: 18,
      categoryId: clothing.id,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Wine", hex: "#5c2e3a" },
        { name: "Forest", hex: "#1d2a24" },
        { name: "Sand", hex: "#c4a574" },
      ],
      images: [img("photo-1595777457583-95e059d581b8"), img("photo-1515372039744-b8f02a3ae446")],
      description:
        "A column silhouette to the knee with a clean neckline and side seam pockets.",
    },
    {
      slug: "solstice-polo",
      name: "Solstice Knit Polo",
      price: 88,
      compareAt: null,
      fabric: "Cotton pique",
      featured: false,
      stock: 30,
      categoryId: clothing.id,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Ivory", hex: "#efe8dc" },
        { name: "Sage", hex: "#6f7d6a" },
        { name: "Navy", hex: "#243044" },
      ],
      images: ["/products/solstice-knit.jpg"],
      description:
        "Short-sleeve cotton knit with a two-button placket and a clean, unfussy collar.",
    },
    {
      slug: "nightfall-coat",
      name: "Nightfall Wool Coat",
      price: 320,
      compareAt: null,
      fabric: "Wool-cashmere blend",
      featured: true,
      stock: 9,
      categoryId: clothing.id,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Charcoal", hex: "#2e2e2c" },
        { name: "Camel", hex: "#b08968" },
      ],
      images: [img("photo-1539533018447-63fcce2678e3"), img("photo-1552374196-1ab2a1c593e8")],
      description:
        "Single-breasted overcoat with a quiet shoulder and a full lining. Falls just below the knee.",
    },
    {
      slug: "canvas-work-shirt",
      name: "Canvas Work Shirt",
      price: 110,
      compareAt: null,
      fabric: "8oz cotton canvas",
      featured: true,
      stock: 22,
      categoryId: clothing.id,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Khaki", hex: "#c4b396" },
        { name: "Indigo", hex: "#2c3a5a" },
      ],
      images: ["/products/canvas-shirt.jpg"],
      description:
        "Utility shirt with a button placket, two chest pockets, and a straight hem to wear tucked or out.",
    },
    {
      slug: "cloudweight-tank",
      name: "Cloudweight Tank",
      price: 36,
      compareAt: null,
      fabric: "Micro-rib cotton",
      featured: false,
      stock: 50,
      categoryId: clothing.id,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "White", hex: "#f7f4ef" },
        { name: "Black", hex: "#1a1917" },
        { name: "Rust", hex: "#9a3f2b" },
      ],
      images: [img("photo-1515886657613-9f3515b0c78f"), img("photo-1469334031218-e382a71b716b")],
      description: "Fine-rib tank with a square neck. Lightweight for layering.",
    },
    {
      slug: "drift-jeans",
      name: "Drift Straight Jeans",
      price: 128,
      compareAt: null,
      fabric: "Organic denim, 13oz",
      featured: false,
      stock: 26,
      categoryId: clothing.id,
      sizes: ["28", "30", "32", "34", "36"],
      colors: [
        { name: "Indigo", hex: "#2c3d56" },
        { name: "Stone", hex: "#9aa0a6" },
      ],
      images: [img("photo-1542272604-787c3835535d"), img("photo-1541099649105-f69ad21f3246")],
      description: "Straight-leg jean with a mid rise and a clean, unwashed finish.",
    },
    {
      slug: "riviera-skirt",
      name: "Riviera Slip Skirt",
      price: 96,
      compareAt: 118,
      fabric: "Washed satin",
      featured: false,
      stock: 14,
      categoryId: clothing.id,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Champagne", hex: "#d8c3a5" },
        { name: "Black", hex: "#1c1c1a" },
      ],
      images: [img("photo-1583496661160-fb5886a0aaaa"), img("photo-1509631179647-0177331693ae")],
      description: "Bias-cut slip skirt that moves with a walk. Elasticated waist.",
    },
    {
      slug: "orbit-acetate-frames",
      name: "Orbit Acetate Frames",
      price: 78,
      compareAt: null,
      fabric: "Hand-polished acetate",
      featured: true,
      stock: 40,
      categoryId: eyewear.id,
      sizes: ["One size"],
      colors: [
        { name: "Tortoise", hex: "#6b4a32" },
        { name: "Clear", hex: "#d9d4cc" },
      ],
      images: [img("photo-1511499767150-a48a237f0083"), img("photo-1473496169904-658ba7c44d8a")],
      description: "Rounded optical frames with a keyhole bridge and five-barrel hinges.",
    },
    {
      slug: "dune-sunglasses",
      name: "Dune Sunglasses",
      price: 92,
      compareAt: null,
      fabric: "Acetate + CR-39 lenses",
      featured: false,
      stock: 33,
      categoryId: eyewear.id,
      sizes: ["One size"],
      colors: [
        { name: "Amber", hex: "#b5682a" },
        { name: "Black", hex: "#111110" },
      ],
      images: [img("photo-1572635196237-14b3f281503f"), img("photo-1508296695146-257a814070b4")],
      description: "Soft-square sun frames with a warm gradient lens. UV400.",
    },
    {
      slug: "linen-lounge-chair",
      name: "Linen Lounge Chair",
      price: 540,
      compareAt: null,
      fabric: "Oak + linen",
      featured: true,
      stock: 7,
      categoryId: living.id,
      sizes: ["One size"],
      colors: [{ name: "Natural", hex: "#d7c4a8" }],
      images: [img("photo-1567538096630-e0c55bd6374c"), img("photo-1586023492125-27b2c045efd7")],
      description: "Low lounge chair with a sculpted oak frame and a removable linen cushion.",
    },
    {
      slug: "low-oak-table",
      name: "Low Oak Side Table",
      price: 210,
      compareAt: null,
      fabric: "Solid oak",
      featured: false,
      stock: 12,
      categoryId: living.id,
      sizes: ["One size"],
      colors: [{ name: "Oak", hex: "#c19a6b" }],
      images: [img("photo-1533090481720-856c6e3c1fdc"), img("photo-1493663284031-b7e3aefcae8e")],
      description: "A squat side table with eased edges. Pairs with the lounge chair.",
    },
    {
      slug: "arc-floor-lamp",
      name: "Arc Floor Lamp",
      price: 160,
      compareAt: 190,
      fabric: "Powder-coated steel",
      featured: false,
      stock: 15,
      categoryId: living.id,
      sizes: ["One size"],
      colors: [
        { name: "Black", hex: "#1a1a18" },
        { name: "Cream", hex: "#e8e0d4" },
      ],
      images: [img("photo-1507473889760-4df75bf3e08f"), img("photo-1513506003901-1e6a229e2d15")],
      description: "An arc lamp with a linen shade. Designed to throw light over a seating cluster.",
    },
    {
      slug: "meridian-sofa",
      name: "Meridian Sofa",
      price: 1280,
      compareAt: null,
      fabric: "Performance linen",
      featured: true,
      stock: 4,
      categoryId: living.id,
      sizes: ["One size"],
      colors: [
        { name: "Stone", hex: "#cfc6b8" },
        { name: "Ink", hex: "#2b3038" },
      ],
      images: [img("photo-1555041469-a586c61ea9bc"), img("photo-1493663284031-b7e3aefcae8e")],
      description: "Two-seat sofa with a deep sit and feather-wrapped cushions.",
    },
  ];

  for (const p of products) {
    const lens = lenses.get(p.slug);
    await prisma.product.create({
      data: {
        ...p,
        tryOnLensId: lens?.lensId ?? null,
        tryOnLensGroupId: lens?.groupId ?? null,
        images: JSON.stringify(p.images),
        colors: JSON.stringify(p.colors),
        sizes: JSON.stringify(p.sizes),
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
