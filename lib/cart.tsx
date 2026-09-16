"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  colorHex: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: string, size: string, color: string, qty: number) => void;
  remove: (productId: string, size: string, color: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE = "vela-cart-v1";

function keyOf(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}::${item.size}::${item.color}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const k = keyOf(item);
      const existing = prev.find((p) => keyOf(p) === k);
      if (existing) {
        return prev.map((p) =>
          keyOf(p) === k ? { ...p, qty: p.qty + qty } : p,
        );
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const setQty = useCallback(
    (productId: string, size: string, color: string, qty: number) => {
      setItems((prev) => {
        if (qty <= 0) {
          return prev.filter((p) => keyOf(p) !== keyOf({ productId, size, color }));
        }
        return prev.map((p) =>
          keyOf(p) === keyOf({ productId, size, color }) ? { ...p, qty } : p,
        );
      });
    },
    [],
  );

  const remove = useCallback((productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter((p) => keyOf(p) !== keyOf({ productId, size, color })),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    return { items, addItem, setQty, remove, clear, count, subtotal };
  }, [items, addItem, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
