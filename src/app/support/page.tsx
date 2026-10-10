"use client";

import { useEffect, useState } from "react";
import { Heart, Coffee, Mic2, Speaker } from "lucide-react";
import { GlowBackground, ProgressBar } from "@/components/visuals";
import { TipJar } from "@/components/forms";
import { timeAgo } from "@/lib/utils";

type Tip = { id: number; name?: string | null; amount: number; message?: string | null; createdAt?: string | null };

export default function SupportPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [total, setTotal] = useState(0);
  const goal = 100000;

  useEffect(() => {
    fetch("/api/tips").then((r) => r.json()).then((j) => { setTips(j.tips ?? []); setTotal(j.total ?? 0); }).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 lg:px-8">
          <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-gold-500">Zero-budget, 100% heart</p>
          <h1 className="font-display mt-2 text-center text-4xl text-white sm:text-6xl">SUPPORT <span className="gold-gradient-text">THE CRAFT 💛</span></h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-400 sm:text-base">
            Every mix is free, every ticket is fair. Tips go straight into better sound, bigger shows and more free music. Even KES 100 makes noise.
          </p>

          <div className="glass mt-8 rounded-[2rem] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-black text-white">🎯 Goal: New PA System — KES {goal.toLocaleString()}</p>
              <p className="font-black text-gold-300">{Math.round((total / goal) * 100)}% • KES {total.toLocaleString()} raised</p>
            </div>
            <ProgressBar value={total} max={goal} className="mt-3 h-3" />
            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              {[
                [Coffee, "KES 100+", "Buys studio airtime"],
                [Speaker, "KES 500+", "Funds better sound"],
                [Mic2, "KES 1,000+", "Sponsors a free community show"],
              ].map((row) => {
                const Icon = row[0] as typeof Coffee;
                return (
                  <div key={row[1] as string} className="flex items-center gap-3 rounded-2xl border border-white/10 p-3.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-300"><Icon size={18} /></span>
                    <span><span className="block text-sm font-bold text-white">{row[1] as string}</span><span className="block text-xs text-zinc-500">{row[2] as string}</span></span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-[2rem] p-5 sm:p-7">
              <p className="flex items-center gap-2 text-lg font-black text-white"><Heart size={19} className="text-red-500" /> Send a tip via M-PESA</p>
              <div className="mt-4"><TipJar /></div>
            </div>
            <div>
              <p className="font-display text-xl text-white">RECENT SUPPORTERS ({tips.length})</p>
              <div className="mt-4 max-h-[560px] space-y-2.5 overflow-y-auto pr-1">
                {tips.map((t) => (
                  <div key={t.id} className="glass rounded-2xl p-4">
                    <p className="text-sm"><b className="text-gold-300">{t.name || "Anonymous"}</b> <span className="text-zinc-500">tipped</span> <b className="text-white">KES {t.amount.toLocaleString()}</b> <span className="text-xs text-zinc-500">• {timeAgo(t.createdAt)}</span></p>
                    {t.message && <p className="mt-1 text-sm text-zinc-300">&ldquo;{t.message}&rdquo;</p>}
                  </div>
                ))}
                {tips.length === 0 && <div className="glass rounded-2xl p-8 text-center text-sm text-zinc-500">Be the first legend on this wall. 👆</div>}
              </div>
            </div>
          </div>
        </div>
      </GlowBackground>
    </main>
  );
}
