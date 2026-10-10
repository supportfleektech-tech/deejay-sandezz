"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, Download, Heart, X, ListMusic } from "lucide-react";
import { cn } from "@/lib/utils";

export type Track = {
  id: number;
  title: string;
  genre: string;
  coverUrl?: string | null;
  audioUrl?: string | null;
  youtubeUrl?: string | null;
  duration?: string | null;
  plays?: number | null;
  likes?: number | null;
};

type PlayerCtx = {
  queue: Track[];
  current: Track | null;
  isPlaying: boolean;
  playTrack: (t: Track, queue?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  close: () => void;
  liked: Set<number>;
  like: (id: number) => void;
};

const Ctx = createContext<PlayerCtx | null>(null);
export const usePlayer = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePlayer outside provider");
  return v;
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dur, setDur] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = index >= 0 && queue[index] ? queue[index] : null;

  const playTrack = (t: Track, q?: Track[]) => {
    if (q && q.length) {
      setQueue(q);
      const i = q.findIndex((x) => x.id === t.id);
      setIndex(i >= 0 ? i : 0);
    } else if (!queue.find((x) => x.id === t.id)) {
      setQueue((prev) => [...prev, t]);
      setIndex(queue.length);
    } else {
      setIndex(queue.findIndex((x) => x.id === t.id));
    }
    setIsPlaying(true);
  };

  const toggle = () => {
    if (!current) return;
    setIsPlaying((p) => !p);
  };
  const next = () => {
    if (!queue.length) return;
    setIndex((i) => (i + 1) % queue.length);
    setIsPlaying(true);
  };
  const prev = () => {
    if (!queue.length) return;
    setIndex((i) => (i - 1 + queue.length) % queue.length);
    setIsPlaying(true);
  };
  const close = () => {
    setIsPlaying(false);
    setIndex(-1);
  };
  const like = (id: number) => {
    setLiked((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
    fetch(`/api/mixes?id=${id}&action=like`, { method: "PATCH" }).catch(() => {});
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current?.audioUrl) return;
    el.src = current.audioUrl;
    el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    fetch(`/api/mixes?id=${current.id}&action=play`, { method: "PATCH" }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) el.play().catch(() => setIsPlaying(false));
    else el.pause();
  }, [isPlaying]);

  const value = useMemo(
    () => ({ queue, current, isPlaying, playTrack, toggle, next, prev, close, liked, like }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queue, current, isPlaying, liked]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration || 0)}
        onEnded={next}
        className="hidden"
      />
      {current && (
        <div className="fixed bottom-0 inset-x-0 z-[80]">
          {showQueue && queue.length > 1 && (
            <div className="mx-auto max-w-3xl px-3">
              <div className="glass mb-2 max-h-56 overflow-y-auto rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-400">Up next</p>
                  <button onClick={() => setShowQueue(false)} className="text-zinc-400 hover:text-white"><X size={16} /></button>
                </div>
                {queue.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => { setIndex(i); setIsPlaying(true); }}
                    className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/5", i === index && "bg-gold-500/10")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.coverUrl || "/images/mix-afrobeats.jpg"} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate font-semibold", i === index ? "text-gold-300" : "text-zinc-100")}>{t.title}</span>
                      <span className="block text-xs text-zinc-500">{t.genre}</span>
                    </span>
                    {i === index && isPlaying && <span className="equalizer flex items-end"><span /><span /><span /><span /><span /></span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="border-t border-gold-500/25 bg-[#0c0c0e]/95 backdrop-blur-xl">
            <div className="h-1 w-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200 transition-all"
                style={{ width: dur ? `${(progress / dur) * 100}%` : "0%" }}
              />
            </div>
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-6">
              <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={current.coverUrl || "/images/mix-afrobeats.jpg"} alt={current.title} className={cn("h-full w-full rounded-full border-2 border-gold-500/60 object-cover vinyl-spin", !isPlaying && "vinyl-spin-paused")} />
                <div className="absolute inset-0 grid place-items-center"><div className="h-3 w-3 rounded-full bg-gold-400 shadow" /></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white sm:text-base">{current.title}</p>
                <p className="text-xs text-gold-400">{current.genre} • Deej Sandezz</p>
              </div>
              <div className="hidden items-center gap-1 sm:flex">
                <button onClick={() => like(current.id)} className={cn("rounded-full p-2 transition hover:bg-white/10", liked.has(current.id) ? "text-red-500" : "text-zinc-400")} aria-label="Like">
                  <Heart size={18} fill={liked.has(current.id) ? "currentColor" : "none"} />
                </button>
                <a href={current.audioUrl || "#"} download target="_blank" rel="noreferrer" className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-gold-300" aria-label="Download">
                  <Download size={18} />
                </a>
                <button onClick={() => setShowQueue((s) => !s)} className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-gold-300" aria-label="Queue">
                  <ListMusic size={18} />
                </button>
                <button onClick={() => { const el = audioRef.current; if (el) { el.muted = !muted; setMuted(!muted); } }} className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10" aria-label="Mute">
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button onClick={prev} className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-gold-300" aria-label="Previous"><SkipBack size={20} /></button>
                <button onClick={toggle} className="gold-btn grid h-11 w-11 place-items-center rounded-full sm:h-12 sm:w-12" aria-label="Play/Pause">
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </button>
                <button onClick={next} className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-gold-300" aria-label="Next"><SkipForward size={20} /></button>
                <button onClick={() => setShowQueue((s) => !s)} className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 sm:hidden" aria-label="Queue"><ListMusic size={18} /></button>
                <button onClick={close} className="rounded-full p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white" aria-label="Close"><X size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
