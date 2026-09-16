"use client";

import type { Category } from "@prisma/client";
import type { StoreProduct } from "@/lib/types";
import { deleteProduct, saveProduct } from "@/lib/actions";

export function ProductForm({
  product,
  categories,
}: {
  product?: StoreProduct;
  categories: Category[];
}) {
  return (
    <form action={saveProduct} className="max-w-3xl space-y-4">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block font-sans text-sm">
          Name
          <input name="name" required defaultValue={product?.name} className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2" />
        </label>
        <label className="block font-sans text-sm">
          Slug
          <input name="slug" required defaultValue={product?.slug} className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2" />
        </label>
      </div>
      <label className="block font-sans text-sm">
        Description
        <textarea name="description" rows={4} required defaultValue={product?.description} className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2" />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block font-sans text-sm">
          Price (USD)
          <input name="price" type="number" required defaultValue={product?.price} className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2" />
        </label>
        <label className="block font-sans text-sm">
          Compare at
          <input name="compareAt" type="number" defaultValue={product?.compareAt ?? ""} className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2" />
        </label>
        <label className="block font-sans text-sm">
          Stock
          <input name="stock" type="number" required defaultValue={product?.stock ?? 10} className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block font-sans text-sm">
          Category
          <select name="categoryId" required defaultValue={product?.categoryId} className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block font-sans text-sm">
          Fabric
          <input name="fabric" required defaultValue={product?.fabric} className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2" />
        </label>
      </div>
      <fieldset className="border border-ink/15 p-4">
        <legend className="px-2 font-sans text-[11px] uppercase tracking-[0.16em] text-ink/50">
          Live try-on (Snap Camera Kit)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block font-sans text-sm">
            Try-on Lens ID
            <input
              name="tryOnLensId"
              defaultValue={product?.tryOnLensId ?? ""}
              placeholder="e.g. 4f2c1e6a-…"
              className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2 font-mono text-xs"
            />
          </label>
          <label className="block font-sans text-sm">
            Lens Group ID <span className="text-ink/40">(optional override)</span>
            <input
              name="tryOnLensGroupId"
              defaultValue={product?.tryOnLensGroupId ?? ""}
              placeholder="Defaults to CAMERA_KIT_LENS_GROUP_ID"
              className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2 font-mono text-xs"
            />
          </label>
        </div>
        <p className="mt-3 font-sans text-xs leading-relaxed text-ink/50">
          Publish the garment lens from Lens Studio to your Camera Kit lens
          group, then paste its Lens ID here. Products with a Lens ID show a
          “Try it on live” button and appear in the fitting room.
        </p>
      </fieldset>
      <label className="block font-sans text-sm">
        Image URLs (one per line)
        <textarea
          name="images"
          rows={4}
          required
          defaultValue={product?.images.join("\n")}
          className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2 font-mono text-xs"
        />
      </label>
      <label className="block font-sans text-sm">
        Colors (Name|#hex per line)
        <textarea
          name="colors"
          rows={3}
          required
          defaultValue={product?.colors.map((c) => `${c.name}|${c.hex}`).join("\n")}
          className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2 font-mono text-xs"
        />
      </label>
      <label className="block font-sans text-sm">
        Sizes (comma separated)
        <input
          name="sizes"
          required
          defaultValue={product?.sizes.join(", ")}
          className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2"
        />
      </label>
      <div className="flex gap-6 font-sans text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} /> Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} /> In stock
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="bg-ink px-6 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] text-paper">
          Save product
        </button>
        {product && (
          <button
            formAction={deleteProduct}
            className="px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.16em] text-rust"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
