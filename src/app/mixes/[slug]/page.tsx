"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Play, Pause, Heart, Download, ArrowLeft, ListMusic, Send, Loader2 } from "lucide-react";
import { YoutubeIcon } from "@/components/icons";
import { GlowBackground, ShareButtons } from "@/components/visuals";
import { MixCard, type MixDTO } from "@/components/cards";
import { usePlayer } from "@/components/player";
import { timeAgo, youtubeEmbed, cn } from "@/lib/utils";

type Comment = { id: number; name: string; message: string; createdAt?: string | null };

export default function MixDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [mix, setMix] = useState<MixDTO | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [more, setMore] = useState<MixDTO[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { current, isPlaying, playTrack, toggle, liked, like } = usePlayer();
  const isCurrent = current?.id === mix?.id;

  useEffect(() => {
    fetch(`/api/mixes?slug=${slug}`).then((r) => r.json()).then((j) => { setMix(j.mix ?? null); setComments(j.comments ?? []); }).catch(() => {});
    fetch("/api/mixes?limit=6").then((r) => r.json()).then((j) => setMore((j.mixes ?? []).filter((m: MixDTO) => m.slug !== slug).slice(0, 3))).catch(() => {});
  }, [slug]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mix || !name || !message) return;
    setSending(true);
    try {
      const r = await fetch("/api/mixes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ comment: true, mixId: mix.id, name, message }) });
      if (r.ok) {
        const j = await r.json();
        setComments((c) => [j.comment, ...c]);
        setName(""); setMessage("");
      }
    } catch {}
    setSending(false);
  };

  if (!mix)
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="glass h-96 animate-pulse rounded-[2rem]" />
      </main>
    );

  const embed = youtubeEmbed(mix.youtubeUrl);
  const tracklist = (mix as unknown as { tracklist?: string[] }).tracklist ?? [];

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 lg:px-8">
          <Link href="/mixes" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-gold-300">
            <ArrowLeft size={16} /> Back to all mixes
          </Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-[380px_1fr]">
            <div>
              <div className="relative overflow-hidden rounded-[2rem] border border-gold-500/30 shadow-[0_30px_80px_-20px_rgba(245,150,2,0.5)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mix.coverUrl || "/images/mix-afrobeats.jpg"} alt={mix.title} className="aspect-square w-full object-cover" />
                <button
                  onClick={() => (isCurrent ? toggle() : playTrack({ id: mix.id, title: mix.title, genre: mix.genre, coverUrl: mix.coverUrl, audioUrl: mix.audioUrl }))}
                  className="gold-btn absolute bottom-5 right-5 grid h-16 w-16 place-items-center rounded-full"
                  aria-label="Play"
                >
                  {isCurrent && isPlaying ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" className="ml-1" />}
                </button>
                {isCurrent && isPlaying && <span className="equalizer absolute bottom-8 left-5 flex items-end"><span /><span /><span /><span /><span /></span>}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[[`${Number(mix.plays ?? 0).toLocaleString()}`, "Plays"], [`${Number(mix.downloads ?? 0).toLocaleString()}`, "Downloads"], [`${Number(mix.likes ?? 0).toLocaleString()}`, "Likes"]].map(([v, l]) => (
                  <div key={l as string} className="glass rounded-2xl py-3"><p className="font-black text-gold-300">{v}</p><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{l}</p></div>
                ))}
              </div>
            </div>
            <div>
              <p className="inline-block rounded-full bg-gold-500/15 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-gold-300">{mix.genre} • {mix.duration}</p>
              <h1 className="font-display mt-3 text-3xl leading-tight text-white sm:text-5xl">{mix.title}</h1>
              <p className="mt-2 text-sm text-zinc-500">Dropped {timeAgo(mix.publishedAt)} • Free download • Deej Sandezz</p>
              <p className="mt-4 max-w-2xl leading-relaxed text-zinc-300">{mix.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => (isCurrent ? toggle() : playTrack({ id: mix.id, title: mix.title, genre: mix.genre, coverUrl: mix.coverUrl, audioUrl: mix.audioUrl }))} className="gold-btn flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black">
                  {isCurrent && isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />} {isCurrent && isPlaying ? "PAUSE" : "PLAY NOW"}
                </button>
                <a href={mix.audioUrl || "#"} download target="_blank" rel="noreferrer" onClick={() => fetch(`/api/mixes?id=${mix.id}&action=download`, { method: "PATCH" }).catch(() => {})} className="flex items-center gap-2 rounded-full border border-gold-500/50 px-7 py-3 text-sm font-black text-gold-300 transition hover:bg-gold-500 hover:text-black">
                  <Download size={16} /> FREE MP3
                </a>
                <button onClick={() => like(mix.id)} className={cn("flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition", liked.has(mix.id) ? "border-red-500/60 bg-red-500/10 text-red-400" : "border-white/15 text-zinc-200 hover:border-red-500/50")}>
                  <Heart size={16} fill={liked.has(mix.id) ? "currentColor" : "none"} /> {liked.has(mix.id) ? "Loved!" : "Love it"}
                </button>
              </div>
              <div className="mt-6"><ShareButtons title={mix.title} path={`/mixes/${mix.slug}`} /></div>
              {tracklist.length > 0 && (
                <div className="glass mt-6 rounded-3xl p-5 sm:p-6">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-gold-500"><ListMusic size={15} /> Tracklist</p>
                  <ol className="mt-3 space-y-2">
                    {tracklist.map((t, i) => (
                      <li key={i} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/5">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-500/15 text-xs font-black text-gold-300">{i + 1}</span> {t}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
          {embed && (
            <div className="mt-10">
              <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-gold-500"><YoutubeIcon size={15} /> Watch the video mix</p>
              <div className="overflow-hidden rounded-[2rem] border border-white/10">
                <iframe className="aspect-video w-full" src={embed} title={mix.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            </div>
          )}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="font-display text-2xl text-white">COMMENTS ({comments.length})</p>
              <form onSubmit={send} className="glass mt-4 space-y-3 rounded-3xl p-5">
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={3} placeholder="What do you think of this mix? 🔥" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                <button disabled={sending} className="gold-btn flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black disabled:opacity-60">
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} POST COMMENT
                </button>
              </form>
            </div>
            <div className="space-y-3 lg:pt-11">
              {comments.map((c) => (
                <div key={c.id} className="glass rounded-2xl p-4">
                  <p className="text-sm font-bold text-gold-300">{c.name} <span className="ml-2 text-xs font-normal text-zinc-500">{timeAgo(c.createdAt)}</span></p>
                  <p className="mt-1 text-sm text-zinc-200">{c.message}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="glass rounded-2xl p-6 text-center text-sm text-zinc-500">No comments yet — be the first to show love! 💛</p>}
            </div>
          </div>
          {more.length > 0 && (
            <div className="mt-12">
              <p className="font-display mb-5 text-2xl text-white">KEEP THE VIBE GOING</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((m) => <MixCard key={m.id} mix={m} queue={more} />)}
              </div>
            </div>
          )}
        </div>
      </GlowBackground>
    </main>
  );
}
