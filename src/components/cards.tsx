"use client";

import Link from "next/link";
import { Play, Pause, Heart, Download, MapPin, CalendarDays, Users, ArrowUpRight, MessageCircle } from "lucide-react";
import { usePlayer, type Track } from "./player";
import { kes, timeAgo, cn } from "@/lib/utils";
import { ProgressBar } from "./visuals";

export type MixDTO = {
  id: number; title: string; slug: string; description?: string | null; genre: string;
  coverUrl?: string | null; audioUrl?: string | null; youtubeUrl?: string | null;
  duration?: string | null; plays?: number | null; downloads?: number | null; likes?: number | null;
  featured?: boolean | null; publishedAt?: string | Date | null;
};

export function MixCard({ mix, queue }: { mix: MixDTO; queue?: MixDTO[] }) {
  const { current, isPlaying, playTrack, toggle, liked, like } = usePlayer();
  const isCurrent = current?.id === mix.id;
  const q: Track[] = (queue ?? [mix]).map((m) => ({ id: m.id, title: m.title, genre: m.genre, coverUrl: m.coverUrl, audioUrl: m.audioUrl, youtubeUrl: m.youtubeUrl, duration: m.duration, plays: m.plays, likes: m.likes }));
  const track: Track = { id: mix.id, title: mix.title, genre: mix.genre, coverUrl: mix.coverUrl, audioUrl: mix.audioUrl, youtubeUrl: mix.youtubeUrl };
  const isLiked = liked.has(mix.id);

  return (
    <div className="glass card-hover group overflow-hidden rounded-3xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mix.coverUrl || "/images/mix-afrobeats.jpg"} alt={mix.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-gold-300 backdrop-blur">{mix.genre}</span>
        {mix.featured && <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-[11px] font-black text-black">FEATURED</span>}
        <button
          onClick={() => (isCurrent ? toggle() : playTrack(track, q))}
          className="gold-btn absolute bottom-3 left-3 grid h-12 w-12 place-items-center rounded-full"
          aria-label="Play mix"
        >
          {isCurrent && isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
        </button>
        {isCurrent && isPlaying && (
          <span className="equalizer absolute bottom-5 right-4 flex items-end"><span /><span /><span /><span /><span /></span>
        )}
        <span className="absolute bottom-4 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white">{mix.duration ?? "60:00"}</span>
      </div>
      <div className="p-5">
        <Link href={`/mixes/${mix.slug}`} className="font-bold leading-snug text-white transition hover:text-gold-300 line-clamp-2">{mix.title}</Link>
        <p className="mt-1.5 text-xs text-zinc-500">{Number(mix.plays ?? 0).toLocaleString()} plays • {Number(mix.downloads ?? 0).toLocaleString()} downloads • {timeAgo(mix.publishedAt)}</p>
        <div className="mt-3.5 flex items-center gap-2">
          <button onClick={() => like(mix.id)} className={cn("flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition", isLiked ? "border-red-500/60 bg-red-500/10 text-red-400" : "border-white/10 text-zinc-300 hover:border-red-500/50")}>
            <Heart size={13} fill={isLiked ? "currentColor" : "none"} /> {Number(mix.likes ?? 0).toLocaleString()}
          </button>
          <a href={mix.audioUrl || "#"} download target="_blank" rel="noreferrer" onClick={() => fetch(`/api/mixes?id=${mix.id}&action=download`, { method: "PATCH" }).catch(() => {})} className="flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition hover:border-gold-500/60 hover:text-gold-300">
            <Download size={13} /> Free MP3
          </a>
          <Link href={`/mixes/${mix.slug}`} className="ml-auto flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-bold text-gold-400 hover:text-gold-200">
            Open <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export type EventDTO = {
  id: number; title: string; slug: string; venue: string; city?: string | null;
  date: string | Date; price?: number | null; vipPrice?: number | null; capacity?: number | null;
  ticketsSold?: number | null; imageUrl?: string | null; status?: string | null; featured?: boolean | null;
};

export function EventCard({ ev }: { ev: EventDTO }) {
  const sold = ev.ticketsSold ?? 0;
  const cap = ev.capacity ?? 200;
  const pct = Math.min(100, Math.round((sold / cap) * 100));
  const past = ev.status === "past" || new Date(ev.date).getTime() < Date.now() - 86400000;
  const d = new Date(ev.date);
  return (
    <div className="glass card-hover group overflow-hidden rounded-3xl">
      <div className="relative aspect-[16/9] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ev.imageUrl || "/images/hero-dj.jpg"} alt={ev.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
        <div className="absolute left-3 top-3 rounded-2xl bg-black/80 px-3.5 py-2 text-center backdrop-blur">
          <p className="font-display text-2xl leading-none text-gold-400">{d.getDate()}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{d.toLocaleDateString("en-GB", { month: "short" })}</p>
        </div>
        {past ? (
          <span className="absolute right-3 top-3 rounded-full bg-zinc-700 px-3 py-1 text-[11px] font-black text-white">PAST EVENT</span>
        ) : pct >= 85 ? (
          <span className="absolute right-3 top-3 animate-pulse rounded-full bg-red-600 px-3 py-1 text-[11px] font-black text-white">ALMOST SOLD OUT</span>
        ) : ev.featured ? (
          <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-[11px] font-black text-black">HEADLINE</span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-bold leading-snug text-white line-clamp-2">{ev.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-300"><MapPin size={12} className="text-gold-400" /> {ev.venue}{ev.city ? `, ${ev.city}` : ""}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-gold-500" /> {d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</span>
          <span className="flex items-center gap-1.5"><Users size={13} className="text-gold-500" /> {sold}/{cap} going</span>
          <span className="font-black text-gold-300">{kes(ev.price ?? 0)}</span>
        </div>
        <ProgressBar value={sold} max={cap} className="mt-2.5" />
        <Link href={`/events/${ev.slug}`} className={cn("mt-3.5 block rounded-2xl py-3 text-center text-sm font-black transition", past ? "border border-white/10 text-zinc-300 hover:border-gold-500/50" : "gold-btn")}>
          {past ? "VIEW RECAP" : "GET TICKETS"}
        </Link>
      </div>
    </div>
  );
}

export function FanCard({ fan, onLike }: { fan: { id: number; name: string; location?: string | null; message: string; avatarColor?: string | null; likes?: number | null; createdAt?: string | Date | null }; onLike?: (id: number) => void }) {
  return (
    <div className="glass card-hover rounded-3xl p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg font-black text-black" style={{ background: fan.avatarColor || "#FFC400" }}>
          {fan.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold text-white">{fan.name}</p>
          <p className="text-xs text-zinc-500">{fan.location || "Kenya"} • {timeAgo(fan.createdAt)}</p>
        </div>
        <MessageCircle size={18} className="ml-auto shrink-0 text-gold-500/50" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-200">&ldquo;{fan.message}&rdquo;</p>
      <button onClick={() => onLike?.(fan.id)} className="mt-3 flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition hover:border-red-500/50 hover:text-red-400">
        <Heart size={13} /> {Number(fan.likes ?? 0).toLocaleString()}
      </button>
    </div>
  );
}
