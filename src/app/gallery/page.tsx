"use client";

import { useEffect, useState } from "react";
import { X, Camera } from "lucide-react";
import { GlowBackground, Marquee } from "@/components/visuals";
import { cn } from "@/lib/utils";

type G = { id: number; title?: string | null; imageUrl: string; category?: string | null };

export default function GalleryPage() {
  const [items, setItems] = useState<G[]>([]);
  const [cat, setCat] = useState("All");
  const [light, setLight] = useState<G | null>(null);

  useEffect(() => {
    fetch("/api/gallery").then((r) => r.json()).then((j) => setItems(j.gallery ?? [])).catch(() => {});
  }, []);

  const cats = ["All", ...Array.from(new Set(items.map((i) => i.category ?? "events")))];
  const list = cat === "All" ? items : items.filter((i) => i.category === cat);

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">Proof of vibes 📸</p>
          <h1 className="font-display mt-2 text-4xl text-white sm:text-6xl">GALLERY — <span className="gold-gradient-text">NIGHTS WE MADE</span></h1>
          <div className="mt-6 flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cn("flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-black uppercase tracking-wider transition", cat === c ? "border-gold-500 bg-gold-500 text-black" : "border-white/10 text-zinc-300 hover:border-gold-500/50")}>
                <Camera size={13} /> {c}
              </button>
            ))}
          </div>
        </div>
      </GlowBackground>
      <Marquee items={["Tag @deej_sandezz to get featured", "Shot on dancefloors", "Nairobi • Nakuru • Mombasa • Kisumu"]} />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {list.map((g) => (
            <button key={g.id} onClick={() => setLight(g)} className="glass group block w-full overflow-hidden rounded-3xl text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.imageUrl} alt={g.title || "Gallery"} loading="lazy" className="w-full object-cover transition duration-500 group-hover:scale-105" />
              <p className="flex items-center justify-between p-4 text-sm font-bold text-white">
                {g.title || "Sandezz live"}
                <span className="rounded-full bg-gold-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-gold-300">{g.category}</span>
              </p>
            </button>
          ))}
          {items.length === 0 && [0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="glass h-72 animate-pulse rounded-3xl" />)}
        </div>
      </section>
      {light && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/90 p-4 backdrop-blur" onClick={() => setLight(null)}>
          <button className="absolute right-5 top-5 rounded-full border border-white/20 p-2.5 text-white hover:border-gold-500" aria-label="Close"><X size={20} /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={light.imageUrl} alt={light.title || ""} className="max-h-[85vh] max-w-full rounded-2xl border border-gold-500/30 object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
