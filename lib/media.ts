/** Studio model packshots in /public/products — front-facing, sand backdrop, visible face for AR. */
export function shot(file: string) {
  return `/products/${file}`;
}

export const VISUALS = {
  hero: "/hero-banner.png",
  heroStill: shot("ivory-hoodie.png"),
  lookbook: shot("navy-hoodie.png"),
  tryOn: "/fitting-booth.png",
  tryOnGlass: "/fitting-glass-hoodie.png",
  quote: shot("moss-hoodie.png"),
  footer: shot("indigo-jeans.png"),
  hoodies: shot("ivory-hoodie.png"),
  tees: shot("rust-tee.png"),
  trousers: shot("indigo-jeans.png"),
  eyewear: shot("tortoise-frames.png"),
};

/** Three colourways per category so landscape tiles fill edge-to-edge. */
export const CATEGORY_COLLAGE: Record<string, string[]> = {
  hoodies: [shot("ember-hoodie.png"), shot("ivory-hoodie.png"), shot("navy-hoodie.png")],
  tees: [shot("rust-tee.png"), shot("sage-tee.png"), shot("wine-tee.png")],
  trousers: [shot("indigo-jeans.png"), shot("sand-chinos.png"), shot("rust-chinos.png")],
  eyewear: [shot("tortoise-frames.png"), shot("halo-rounds.png"), shot("ember-cateye.png")],
};

export const CATEGORY_IMAGES: Record<string, string> = {
  hoodies: VISUALS.hoodies,
  tees: VISUALS.tees,
  trousers: VISUALS.trousers,
  eyewear: VISUALS.eyewear,
};

const CATEGORY_ORDER = ["hoodies", "tees", "trousers", "eyewear"] as const;

export function sortCategories<T extends { slug: string }>(rows: T[]) {
  return [...rows].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.slug as (typeof CATEGORY_ORDER)[number]);
    const bi = CATEGORY_ORDER.indexOf(b.slug as (typeof CATEGORY_ORDER)[number]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export const PRODUCT_IMAGES: Record<string, string[]> = {
  "ivory-hoodie": [shot("ivory-hoodie.png")],
  "ember-hoodie": [shot("ember-hoodie.png")],
  "navy-hoodie": [shot("navy-hoodie.png")],
  "moss-hoodie": [shot("moss-hoodie.png")],
  "ink-hoodie": [shot("ink-hoodie.png")],
  "sun-hoodie": [shot("sun-hoodie.png")],
  "milk-tee": [shot("milk-tee.png")],
  "ink-tee": [shot("ink-tee.png")],
  "rust-tee": [shot("rust-tee.png")],
  "sage-tee": [shot("sage-tee.png")],
  "sky-tee": [shot("sky-tee.png")],
  "wine-tee": [shot("wine-tee.png")],
  "indigo-jeans": [shot("indigo-jeans.png")],
  "sand-chinos": [shot("sand-chinos.png")],
  "ink-trousers": [shot("ink-trousers.png")],
  "moss-trousers": [shot("moss-trousers.png")],
  "stone-trousers": [shot("stone-trousers.png")],
  "rust-chinos": [shot("rust-chinos.png")],
  "ink-wayfarers": [shot("ink-wayfarers.png")],
  "tortoise-frames": [shot("tortoise-frames.png")],
  "halo-rounds": [shot("halo-rounds.png")],
  "clear-coast": [shot("clear-coast.png")],
  "moss-sunglasses": [shot("moss-sunglasses.png")],
  "ember-cateye": [shot("ember-cateye.png")],
};
