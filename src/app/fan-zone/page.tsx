"use client";

import { useEffect, useState } from "react";
import { Heart, TrendingUp } from "lucide-react";
import { GlowBackground, Marquee, SectionHeading } from "@/components/visuals";
import { FanCard } from "@/components/cards";
import { FanWallForm, RequestForm, PollWidget, SpinWheel } from "@/components/forms";

type Fan = { id: number; name: string; location?: string | null; message: string; avatarColor?: string | null; likes?: number | null; createdAt?: string | null };
type Req = { id: number; name: string; song: string; artist?: string | null; dedication?: string | null; likes?: number | null };
type Poll = { id: number; question: string; options: string[]; votes: number[] };

export default function FanZonePage() {
  const [fans, setFans] = useState<Fan[]>([]);
  const [reqs, setReqs] = useState<Req[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);

  const loadFans = () => fetch("/api/fanwall").then((r) => r.json()).then((j) => setFans(j.messages ?? [])).catch(() => {});
  const loadReqs = () => fetch("/api/requests").then((r) => r.json()).then((j) => setReqs(j.requests ?? [])).catch(() => {});

  useEffect(() => {
    loadFans();
    loadReqs();
    fetch("/api/polls").then((r) => r.json()).then((j) => setPolls(j.polls ?? [])).catch(() => {});
  }, []);

  const likeFan = async (id: number) => {
    setFans((f) => f.map((x) => (x.id === id ? { ...x, likes: (x.likes ?? 0) + 1 } : x)));
    fetch(`/api/fanwall?id=${id}`, { method: "PATCH" }).catch(() => {});
  };
  const likeReq = async (id: number) => {
    setReqs((f) => f.map((x) => (x.id === id ? { ...x, likes: (x.likes ?? 0) + 1 } : x)));
    fetch(`/api/requests?id=${id}`, { method: "PATCH" }).catch(() => {});
  };

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">Sandezz family only 💛</p>
          <h1 className="font-display mt-2 text-4xl text-white sm:text-6xl">FAN ZONE — <span className="gold-gradient-text">PLAY & WIN</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Drop love on the wall, request songs for live sets, vote on the next mix, and spin daily to win merch discounts. Most active fans get VIP upgrades. 👀
          </p>
        </div>
      </GlowBackground>
      <Marquee items={["Spin daily & win", "Top fans get VIP upgrades", "Requests played live", "Your vote picks the next mix"]} />

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <SectionHeading kicker="Wall of love" title="FAN WALL" sub={`${fans.length} messages and counting. Leave yours!`} />
            <FanWallForm onPosted={loadFans} />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fans.map((f) => <FanCard key={f.id} fan={f} onLike={likeFan} />)}
              {fans.length === 0 && [0, 1, 2, 3].map((i) => <div key={i} className="glass h-44 animate-pulse rounded-3xl" />)}
            </div>
          </div>
          <div className="space-y-6">
            <SpinWheel />
            {polls.map((p) => <PollWidget key={p.id} poll={p} />)}
          </div>
        </div>
      </section>

      <section className="border-t border-gold-500/15 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <SectionHeading kicker="Heard live on stage" title="SONG REQUESTS 🎶" sub="Most-voted requests get played at the next show. Vote for your faves!" />
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <RequestForm onPosted={loadReqs} />
            <div className="space-y-3">
              {reqs.map((r, i) => (
                <div key={r.id} className="glass flex items-center gap-4 rounded-2xl p-4">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-lg ${i < 3 ? "bg-gold-500 text-black" : "bg-white/10 text-zinc-300"}`}>
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white">&ldquo;{r.song}&rdquo; {r.artist && <span className="font-normal text-zinc-400">— {r.artist}</span>}</p>
                    <p className="truncate text-xs text-zinc-500">by {r.name}{r.dedication ? ` • ${r.dedication}` : ""}</p>
                  </div>
                  <button onClick={() => likeReq(r.id)} className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-xs font-bold text-zinc-200 transition hover:border-red-500/60 hover:text-red-400">
                    <Heart size={13} /> {r.likes ?? 0}
                  </button>
                </div>
              ))}
              {reqs.length === 0 && <div className="glass h-32 animate-pulse rounded-2xl" />}
              <p className="flex items-center gap-2 pt-2 text-xs text-zinc-500"><TrendingUp size={14} className="text-gold-500" /> Leaderboard updates live — top 3 get played at the next event.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
