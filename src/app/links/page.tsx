"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, ChevronRight, Play, Ticket, ShoppingBag, CalendarCheck, Heart, Crown } from "lucide-react";
import { GlowBackground } from "@/components/visuals";
import { SOCIALS, DJ } from "@/lib/constants";
import { SocialIcon } from "@/components/icons";

export default function LinksPage() {
  const [stats, setStats] = useState({ plays: 0, sold: 0 });
  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then((j) => setStats({ plays: j.mixes?.plays ?? 0, sold: j.tickets?.sold ?? 0 })).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-xl px-4 pb-16 pt-10">
          <div className="text-center">
            <div className="relative mx-auto h-28 w-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about-dj.jpg" alt="Deej Sandezz" className="h-full w-full rounded-full border-4 border-gold-500 object-cover shadow-[0_0_40px_rgba(255,196,0,0.4)]" />
              <span className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-gold-500 text-black"><BadgeCheck size={20} /></span>
            </div>
            <h1 className="font-display mt-4 text-3xl text-white">DEEJ <span className="gold-gradient-text">SANDEZZ</span></h1>
            <p className="mt-1 text-sm text-zinc-400">{DJ.tagline}</p>
            <p className="mt-2 text-xs text-zinc-500">{stats.plays > 0 ? `${(stats.plays / 1000).toFixed(0)}K+ mix plays` : "60K+ mix plays"} • Nairobi, Kenya 🇰🇪</p>
          </div>

          <div className="mt-7 space-y-2.5">
            <p className="pb-1 text-center text-xs font-black uppercase tracking-[0.3em] text-gold-500">Start here 🔥</p>
            {[
              { icon: Play, label: "🎧 Latest Mixes — Stream & Download FREE", href: "/mixes", hot: true },
              { icon: Ticket, label: "🎟️ Get Event Tickets (M-PESA)", href: "/events", hot: true },
              { icon: CalendarCheck, label: "📅 Book the DJ for Your Event", href: "/book", hot: false },
              { icon: ShoppingBag, label: "🛍️ Shop Official Merch", href: "/shop", hot: false },
              { icon: Heart, label: "💛 Tip / Support the Craft", href: "/support", hot: false },
              { icon: Crown, label: "👑 VIP Club — Presales & Perks", href: "/vip", hot: false },
            ].map((l) => (
              <Link key={l.href + l.label} href={l.href} className={`group flex items-center gap-3 rounded-2xl border p-4 transition ${l.hot ? "border-gold-500/60 bg-gold-500/10 hover:bg-gold-500 hover:text-black" : "border-white/10 bg-white/[0.04] hover:border-gold-500/50"}`}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${l.hot ? "bg-gold-500 text-black group-hover:bg-black group-hover:text-gold-400" : "bg-gold-500/15 text-gold-300"}`}>
                  <l.icon size={18} />
                </span>
                <span className={`flex-1 text-sm font-bold ${l.hot ? "text-gold-200 group-hover:text-black" : "text-white"}`}>{l.label}</span>
                <ChevronRight size={17} className="text-zinc-500 group-hover:translate-x-1 transition" />
              </Link>
            ))}
          </div>

          <div className="mt-7 space-y-2.5">
            <p className="pb-1 text-center text-xs font-black uppercase tracking-[0.3em] text-gold-500">Follow everywhere</p>
            {SOCIALS.filter((s) => s.icon !== "linktree").map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 transition hover:border-gold-500/50 hover:bg-gold-500/5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-zinc-200 transition group-hover:scale-110" style={{ color: s.color }}>
                  <SocialIcon icon={s.icon} size={19} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-white">{s.label}</span>
                  <span className="block text-xs text-zinc-500">{s.handle}</span>
                </span>
                <ChevronRight size={17} className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-gold-400" />
              </a>
            ))}
          </div>

          <div className="glass mt-7 rounded-3xl p-5 text-center">
            <p className="text-sm font-bold text-white">Bookings & collabs</p>
            <a href={DJ.phoneHref} className="mt-1 block font-black text-gold-300">{DJ.phoneDisplay}</a>
            <a href={`mailto:${DJ.email}`} className="block text-sm text-zinc-400 hover:text-gold-300">{DJ.email}</a>
          </div>
        </div>
      </GlowBackground>
    </main>
  );
}
