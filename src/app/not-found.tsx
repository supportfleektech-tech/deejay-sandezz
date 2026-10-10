"use client";

import Link from "next/link";
import { ArrowLeft, Play, Ticket, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-[80vh] place-items-center px-4 py-20">
      <div className="text-center">
        <div className="relative mx-auto h-40 w-40">
          <div className="absolute inset-0 rounded-full border-4 border-gold-500/70 bg-black shadow-[0_0_60px_rgba(255,196,0,0.35)] vinyl-spin">
            {[0.72, 0.5, 0.32].map((s, i) => (
              <div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" style={{ width: `${s * 100}%`, height: `${s * 100}%` }} />
            ))}
            <div className="absolute left-1/2 top-1/2 grid h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-700 text-center">
              <span className="font-display text-[10px] leading-none text-black">404</span>
            </div>
          </div>
        </div>
        <h1 className="font-display mt-8 text-4xl text-white sm:text-6xl">WRONG TRACK, <span className="gold-gradient-text">BOSS</span></h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
          This page scratched off the record. But the music keeps going — pick a lane and let&apos;s dance. 🎧
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="gold-btn flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black"><ArrowLeft size={16} /> BACK HOME</Link>
          <Link href="/mixes" className="flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-bold text-white hover:border-gold-500/60"><Play size={15} /> Mixes</Link>
          <Link href="/events" className="flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-bold text-white hover:border-gold-500/60"><Ticket size={15} /> Events</Link>
          <Link href="/shop" className="flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-bold text-white hover:border-gold-500/60"><ShoppingBag size={15} /> Merch</Link>
        </div>
      </div>
    </main>
  );
}
