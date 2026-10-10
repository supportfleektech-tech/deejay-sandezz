"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag, Star, Truck } from "lucide-react";
import { kes, cn } from "@/lib/utils";
import { DJ, whatsappLink } from "@/lib/constants";

export type CartItem = { productId: number; name: string; price: number; image?: string; size?: string; qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (i: CartItem) => void;
  remove: (productId: number, size?: string) => void;
  setQty: (productId: number, size: string | undefined, qty: number) => void;
  clear: () => void;
  drawer: boolean;
  setDrawer: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);
export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside provider");
  return v;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sandezz-cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("sandezz-cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.qty * i.price, 0);

  const add = (item: CartItem) =>
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.productId === item.productId && p.size === item.size);
      if (idx >= 0) {
        const n = [...prev];
        n[idx] = { ...n[idx], qty: n[idx].qty + item.qty };
        return n;
      }
      return [...prev, item];
    });
  const remove = (productId: number, size?: string) =>
    setItems((prev) => prev.filter((p) => !(p.productId === productId && p.size === size)));
  const setQty = (productId: number, size: string | undefined, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => !(p.productId === productId && p.size === size))
        : prev.map((p) => (p.productId === productId && p.size === size ? { ...p, qty } : p))
    );
  const clear = () => setItems([]);

  const value = useMemo(
    () => ({ items, count, subtotal, add, remove, setQty, clear, drawer, setDrawer }),
    [items, count, subtotal, drawer]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

function CartDrawer() {
  const { items, subtotal, drawer, setDrawer, setQty, remove } = useCart();
  if (!drawer) return null;
  const waMsg = `Hi Deej Sandezz! I want to order:\n${items.map((i) => `• ${i.name} (${i.size ?? "OS"}) x${i.qty} — KES ${i.price * i.qty}`).join("\n")}\nTotal: KES ${subtotal}\nMy name is: `;
  return (
    <>
      <div className="fixed inset-0 z-[85] bg-black/70 backdrop-blur-sm" onClick={() => setDrawer(false)} />
      <aside className="fixed right-0 top-0 z-[86] flex h-dvh w-full max-w-md flex-col border-l border-gold-500/25 bg-[#0c0c0e]">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <p className="font-display text-xl tracking-wide">YOUR CART <span className="text-gold-400">({items.length})</span></p>
          <button onClick={() => setDrawer(false)} className="rounded-full border border-white/10 p-2 hover:border-gold-500" aria-label="Close cart"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <ShoppingBag size={48} className="mx-auto text-zinc-700" />
                <p className="mt-4 font-bold text-zinc-300">Cart is empty</p>
                <p className="mt-1 text-sm text-zinc-500">Rep the brand — grab a tee or hoodie.</p>
                <Link href="/shop" onClick={() => setDrawer(false)} className="gold-btn mt-5 inline-block rounded-full px-6 py-3 text-sm font-black">SHOP MERCH</Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={`${i.productId}-${i.size}`} className="glass flex gap-3 rounded-2xl p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image || "/images/merch-tee.jpg"} alt={i.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{i.name}</p>
                    <p className="text-xs text-zinc-500">{i.size ? `Size ${i.size}` : "One size"} • {kes(i.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-white/10 px-1 py-0.5">
                        <button onClick={() => setQty(i.productId, i.size, i.qty - 1)} className="p-1 hover:text-gold-300" aria-label="Decrease"><Minus size={14} /></button>
                        <span className="min-w-5 text-center text-sm font-bold">{i.qty}</span>
                        <button onClick={() => setQty(i.productId, i.size, i.qty + 1)} className="p-1 hover:text-gold-300" aria-label="Increase"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => remove(i.productId, i.size)} className="p-1.5 text-zinc-500 hover:text-red-400" aria-label="Remove"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="space-y-3 border-t border-white/10 p-5">
            <div className="flex items-center gap-2 text-xs text-zinc-400"><Truck size={14} className="text-gold-500" /> Delivery: Nairobi KES 250 • Outside Nairobi KES 400 • Free over KES 5,000</div>
            <div className="flex items-center justify-between font-bold"><span className="text-zinc-400">Subtotal</span><span className="text-xl text-gold-300">{kes(subtotal)}</span></div>
            <Link href="/checkout" onClick={() => setDrawer(false)} className="gold-btn block rounded-2xl py-3.5 text-center font-black">CHECKOUT WITH M-PESA</Link>
            <a href={whatsappLink(waMsg)} target="_blank" rel="noreferrer" className="block rounded-2xl border border-[#25D366]/50 py-3 text-center text-sm font-bold text-[#25D366] transition hover:bg-[#25D366]/10">Order via WhatsApp instead</a>
          </div>
        )}
      </aside>
    </>
  );
}

export type ProductDTO = {
  id: number; name: string; slug: string; description?: string | null; price: number;
  comparePrice?: number | null; category?: string | null; sizes?: string[] | null;
  colors?: string[] | null; imageUrls?: string[] | null; stock?: number | null;
  rating?: number | null; reviews?: number | null; featured?: boolean | null;
};

export function ProductCard({ p }: { p: ProductDTO }) {
  const { add, setDrawer } = useCart();
  const [size, setSize] = useState<string | undefined>(p.sizes?.[1] ?? p.sizes?.[0]);
  const img = p.imageUrls?.[0] || "/images/merch-tee.jpg";
  const off = p.comparePrice && p.comparePrice > p.price ? Math.round((1 - p.price / p.comparePrice) * 100) : 0;

  return (
    <div className="glass card-hover group overflow-hidden rounded-3xl">
      <div className="relative aspect-square overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">-{off}%</span>}
        {p.featured && <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-black text-black">HOT</span>}
      </div>
      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gold-500">{p.category}</p>
        <h3 className="mt-1 font-bold text-white">{p.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
          <Star size={13} className="fill-gold-400 text-gold-400" /> {Number(p.rating ?? 5).toFixed(1)} ({p.reviews ?? 0} reviews)
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-black text-gold-300">{kes(p.price)}</span>
          {p.comparePrice ? <span className="text-sm text-zinc-500 line-through">{kes(p.comparePrice)}</span> : null}
        </div>
        {p.sizes && p.sizes.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={cn("rounded-lg border px-2.5 py-1 text-xs font-bold transition", size === s ? "border-gold-500 bg-gold-500/15 text-gold-300" : "border-white/10 text-zinc-400 hover:border-white/30")}>{s}</button>
            ))}
          </div>
        )}
        <button
          onClick={() => { add({ productId: p.id, name: p.name, price: p.price, image: img, size, qty: 1 }); setDrawer(true); }}
          className="gold-btn mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black"
        >
          <ShoppingBag size={16} /> ADD TO CART
        </button>
      </div>
    </div>
  );
}

export function MpesaBox({ total, compact }: { total?: number; compact?: boolean }) {
  return (
    <div className={cn("rounded-2xl border border-green-500/30 bg-green-500/10", compact ? "p-4" : "p-5")}>
      <p className="flex items-center gap-2 text-sm font-black text-green-400">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-green-500 font-black text-black">M</span>
        PAY WITH M-PESA {total ? `— ${kes(total)}` : ""}
      </p>
      <ol className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-zinc-300">
        <li>1. Go to <b>M-PESA → Send Money</b></li>
        <li>2. Number: <b className="text-white">{DJ.mpesaTill}</b> ({DJ.mpesaName})</li>
        <li>3. Enter amount{total ? ` — ${kes(total)}` : ""} & complete</li>
        <li>4. Paste the <b>M-PESA code</b> in the form below 👇</li>
      </ol>
    </div>
  );
}
