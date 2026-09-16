import type { StoreProduct, TryOnProduct } from "@/lib/types";

/**
 * Snap Camera Kit configuration.
 *
 * - CAMERA_KIT_API_TOKEN: API token from the Camera Kit portal
 *   (https://my-lenses.snapchat.com/camera-kit/apps). Use the *Staging*
 *   token while developing and the *Production* token once the app is reviewed.
 * - CAMERA_KIT_LENS_GROUP_ID: the Lens Group that holds the try-on lenses
 *   published from Lens Studio. Each product stores its own Lens ID.
 */
export type TryOnConfig = {
  apiToken: string;
  lensGroupId: string;
};

export function getTryOnConfig(): TryOnConfig | null {
  const apiToken = process.env.CAMERA_KIT_API_TOKEN?.trim();
  const lensGroupId = process.env.CAMERA_KIT_LENS_GROUP_ID?.trim();
  if (!apiToken) return null;
  return { apiToken, lensGroupId: lensGroupId ?? "" };
}

export function hasTryOn(product: Pick<StoreProduct, "tryOnLensId">) {
  return Boolean(product.tryOnLensId);
}

export function toTryOnProduct(
  product: StoreProduct,
  defaultGroupId: string,
): TryOnProduct | null {
  if (!product.tryOnLensId) return null;
  const lensGroupId = product.tryOnLensGroupId || defaultGroupId;
  if (!lensGroupId) return null;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    compareAt: product.compareAt,
    image: product.images[0] ?? "",
    colors: product.colors,
    sizes: product.sizes,
    inStock: product.inStock,
    lensId: product.tryOnLensId,
    lensGroupId,
  };
}
