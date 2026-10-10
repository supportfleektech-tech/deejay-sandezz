"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Truck, ShieldCheck, BadgePercent } from "lucide-react";
import { GlowBackground, Marquee, SectionHeading } from "@/components/visuals";
import { ProductCard, type ProductDTO } from "@/components/shop";
import { cn } from "@/lib/utils";

const CATS = ["All", "apparel", "accessories", "music"];

export default function ShopPage() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [cat, setCat] = useState("All");

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((j) => setProducts(j.products ?? [])).catch(() => {});
  }, []);

  const list = useMemo(() => (cat === "All" ? products : products.filter((p) => p.category === cat)), [products, cat]);

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">Official store</p>
          <h1 className="font-display mt-2 text-4xl text-white sm:text-6xl">SANDEZZ <span className="gold-gradient-text">MERCH 🛍️</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Heavyweight fabrics, gold-standard prints. Pay with M-PESA, delivered anywhere in Kenya. Wear it to a show and you might get a free shout-out. 👀
          </p>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              { Icon: Truck, t: "Countrywide delivery", s: "Nairobi 250 • Upcountry 400 • Free over 5K" },
              { Icon: ShieldCheck, t: "M-PESA secure", s: "Pay to till, share code, we ship" },
              { Icon: BadgePercent, t: "Fan discounts", s: "Spin the wheel in Fan Zone for deals" },
            ].map(({ Icon, t, s }) => (
              <div key={t} className="glass flex items-center gap-3 rounded-2xl p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-300"><Icon size={20} /></span>
                <span><span className="block text-sm font-bold text-white">{t}</span><span className="block text-xs text-zinc-500">{s}</span></span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cn("flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-black uppercase tracking-wider transition", cat === c ? "border-gold-500 bg-gold-500 text-black" : "border-white/10 text-zinc-300 hover:border-gold-500/50")}>
                <ShoppingBag size={14} /> {c}
              </button>
            ))}
          </div>
        </div>
      </GlowBackground>
      <Marquee items={["Pay with M-PESA", "Free delivery over KES 5,000", "New drops monthly", "Wear it to shows, get shouted out"]} />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <SectionHeading kicker={`${list.length} products`} title={cat === "All" ? "FULL COLLECTION" : cat.toUpperCase()} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
          {products.length === 0 && [0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="glass h-96 animate-pulse rounded-3xl" />)}
        </div>
      </section>
    </main>
  );
}
