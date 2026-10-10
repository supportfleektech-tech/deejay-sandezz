"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Share2, Check, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlowBackground({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("noise-overlay relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-gold-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[450px] w-[450px] rounded-full bg-orange-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[350px] w-[500px] rounded-full bg-gold-500/10 blur-[140px]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-gold-500/25 bg-gradient-to-r from-gold-600/15 via-gold-500/10 to-gold-600/15 py-3">
      <div className="marquee-track gap-8">
        {row.map((t, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8 whitespace-nowrap text-sm font-bold uppercase tracking-[0.2em] text-gold-300">
            {t} <Flame size={15} className="text-gold-500" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHeading({ kicker, title, sub, href, linkLabel }: { kicker: string; title: string; sub?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">{kicker}</p>
        <h2 className="font-display mt-2 text-3xl tracking-wide text-white sm:text-4xl lg:text-5xl">{title}</h2>
        {sub && <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="group flex items-center gap-2 rounded-full border border-gold-500/40 px-5 py-2.5 text-sm font-bold text-gold-300 transition hover:bg-gold-500 hover:text-black">
          {linkLabel ?? "View all"} <ArrowRight size={15} className="transition group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export function Countdown({ target }: { target: string | Date }) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, t - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <div className="flex gap-2 sm:gap-3">
      {[["DAYS", left.d], ["HRS", left.h], ["MIN", left.m], ["SEC", left.s]].map(([label, v]) => (
        <div key={label as string} className="glass min-w-[64px] rounded-2xl px-3 py-2.5 text-center sm:min-w-[78px]">
          <p className="font-display text-2xl text-gold-300 sm:text-3xl">{String(v).padStart(2, "0")}</p>
          <p className="text-[10px] font-black tracking-[0.25em] text-zinc-500">{label}</p>
        </div>
      ))}
    </div>
  );
}

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin + path : path;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-500"><Share2 size={13} /> Share</span>
      <a href={`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition hover:border-green-500 hover:text-green-400">WhatsApp</a>
      <a href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition hover:border-white hover:text-white">X</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition hover:border-blue-500 hover:text-blue-400">Facebook</a>
      <button onClick={copy} className="flex items-center gap-1 rounded-full border border-gold-500/40 px-3.5 py-1.5 text-xs font-bold text-gold-300 transition hover:bg-gold-500 hover:text-black">
        {copied ? <Check size={13} /> : null} {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

export function VinylBadge({ size = 120, spinning = true }: { size?: number; spinning?: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className={cn("absolute inset-0 rounded-full border-4 border-gold-500/70 bg-black shadow-[0_0_40px_rgba(255,196,0,0.3)]", spinning && "vinyl-spin")}>
        {[0.72, 0.55, 0.4].map((s, i) => (
          <div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" style={{ width: `${s * 100}%`, height: `${s * 100}%` }} />
        ))}
        <div className="absolute left-1/2 top-1/2 grid h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-700">
          <div className="h-2 w-2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

export function EventMeta({ date, venue, city }: { date: string | Date; venue: string; city?: string | null }) {
  const d = new Date(date);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-zinc-400">
      <span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-gold-500" /> {d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} • {d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gold-500" /> {venue}{city ? `, ${city}` : ""}</span>
    </div>
  );
}

export function ProgressBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-white/10", className)}>
      <div className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
