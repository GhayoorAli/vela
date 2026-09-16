export type ProductColor = { name: string; hex: string };

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAt: number | null;
  fabric: string;
  /** Snap Camera Kit Lens ID. Present ⇒ the piece can be worn live in the fitting room. */
  tryOnLensId: string | null;
  /** Optional Lens Group override for this product's lens. */
  tryOnLensGroupId: string | null;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  featured: boolean;
  inStock: boolean;
  stock: number;
  categoryId: string;
  category: { slug: string; name: string };
  createdAt: Date;
};

export type ProductFilters = {
  q?: string;
  category?: string;
  size?: string;
  color?: string;
  /** "1" ⇒ only products with a try-on lens. */
  tryon?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
};

/** Slim product payload handed to the client-side fitting room. */
export type TryOnProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAt: number | null;
  image: string;
  colors: ProductColor[];
  sizes: string[];
  inStock: boolean;
  lensId: string;
  lensGroupId: string;
};
