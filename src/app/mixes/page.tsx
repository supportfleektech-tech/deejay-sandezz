"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Play, Download, SlidersHorizontal } from "lucide-react";
import { GlowBackground, Marquee, SectionHeading } from "@/components/visuals";
import { MixCard, type MixDTO } from "@/components/cards";
import { GENRES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/components/player";

export default function MixesPage() {
  const [mixes, setMixes] = useState<MixDTO[]>([]);
  const [genre, setGenre] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "plays" | "likes">("new");
  const { playTrack } = usePlayer();

  useEffect(() => {
    fetch("/api/mixes?limit=50").then((r) => r.json()).then((j) => setMixes(j.mixes ?? [])).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let out = [...mixes];
    if (genre !== "All") out = out.filter((m) => m.genre === genre);
    if (q) out = out.filter((m) => m.title.toLowerCase().includes(q.toLowerCase()));
    if (sort === "plays") out.sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0));
    else if (sort === "likes") out.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    return out;
  }, [mixes, genre, q, sort]);

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">The vault</p>
          <h1 className="font-display mt-2 text-4xl text-white sm:text-6xl">MIXES — <span className="gold-gradient-text">STREAM & DOWNLOAD FREE</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Every mix is free. Stream instantly, download the MP3, share with your crew. New drops every Friday — Afrobeats, Amapiano, Gengetone, Dancehall & more.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => filtered[0] && playTrack({ id: filtered[0].id, title: filtered[0].title, genre: filtered[0].genre, coverUrl: filtered[0].coverUrl, audioUrl: filtered[0].audioUrl }, filtered.map((m) => ({ id: m.id, title: m.title, genre: m.genre, coverUrl: m.coverUrl, audioUrl: m.audioUrl })))}
              className="gold-btn flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black"
            >
              <Play size={16} fill="currentColor" /> PLAY ALL
            </button>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-300">
              <Download size={14} className="text-gold-400" /> {mixes.reduce((a, m) => a + (m.downloads ?? 0), 0).toLocaleString()} total downloads
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search mixes... (e.g. amapiano, gengetone, praise)" className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500" />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <SlidersHorizontal size={15} />
              {(["new", "plays", "likes"] as const).map((s) => (
                <button key={s} onClick={() => setSort(s)} className={cn("rounded-full border px-4 py-2.5 uppercase tracking-wider transition", sort === s ? "border-gold-500 bg-gold-500/15 text-gold-300" : "border-white/10 hover:border-white/30")}>
                  {s === "new" ? "Newest" : s === "plays" ? "Most played" : "Most loved"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button key={g} onClick={() => setGenre(g)} className={cn("rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wider transition", genre === g ? "border-gold-500 bg-gold-500 text-black" : "border-white/10 text-zinc-300 hover:border-gold-500/50 hover:text-gold-300")}>
                {g}
              </button>
            ))}
          </div>
        </div>
      </GlowBackground>
      <Marquee items={["100% free downloads", "New mix every Friday", "Share with your crew", "Request songs in the fan zone"]} />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <SectionHeading kicker={`${filtered.length} mixes`} title={genre === "All" ? "ALL MIXES" : genre.toUpperCase()} />
        {filtered.length === 0 && mixes.length > 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-lg font-bold text-white">No mixes found for &ldquo;{q}&rdquo;</p>
            <p className="mt-1 text-sm text-zinc-400">Try another keyword or genre.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => <MixCard key={m.id} mix={m} queue={filtered} />)}
            {mixes.length === 0 && [0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="glass h-80 animate-pulse rounded-3xl" />)}
          </div>
        )}
      </section>
    </main>
  );
}
