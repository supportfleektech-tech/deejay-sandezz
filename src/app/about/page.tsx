"use client";

import Link from "next/link";
import { CalendarCheck, Download, MapPin, Award, Disc3, Users, Radio, ChevronRight } from "lucide-react";
import { GlowBackground, Marquee, Countdown } from "@/components/visuals";
import { NewsletterForm } from "@/components/forms";
import { DJ } from "@/lib/constants";

const TIMELINE = [
  { year: "2014", title: "The Bedroom Era", text: "Borrowed laptop, cracked Virtual DJ, KSh 500 speaker. First gig: cousin's ruracio, KSh 1,000 + pilau. The power cut twice. Nobody left." },
  { year: "2016", title: "Campus King", text: "KU freshers night changes everything. 800 students, one unforgettable set. Campus tour circuit begins — UoN, Strathmore, Daystar." },
  { year: "2018", title: "Club Residency", text: "First Westlands residency. Learning to read rooms: from slow Thursdays to chaotic Detty December Saturdays." },
  { year: "2020", title: "Lockdown Mixes", text: "No shows? No problem. Weekly living-room livestreams and the 'Nairobi Nights' mix series is born. 100K plays in year one." },
  { year: "2022", title: "Festival Main Stage", text: "First 5,000-capacity headline slot. The Golden Turntable brand launches — merch sells out in a week." },
  { year: "2024", title: "Sold-Out Tours", text: "Nakuru, Eldoret, Kisumu sell out. 2M+ total mix plays. Weddings & corporates booked months ahead." },
  { year: "2026", title: "This Website. This Family.", text: "Direct to fans: free mixes, M-PESA tickets, merch, bookings. No middlemen. The best era is right now — with you in it." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">The man behind the decks</p>
              <h1 className="font-display mt-2 text-4xl leading-tight text-white sm:text-6xl">SUNDAY OMONDI<br /><span className="gold-gradient-text">AKA DEEJ SANDEZZ</span></h1>
              <p className="mt-4 leading-relaxed text-zinc-300">
                DJ • MC • Producer • Professional vibe architect. Born and raised in Nairobi, I&apos;ve spent a decade turning ordinary nights into stories people tell for years.
              </p>
              <p className="mt-3 leading-relaxed text-zinc-400">
                My sound? Open-format with a Kenyan heart — Afrobeats to Amapiano, Gengetone to Gospel, Throwbacks to Dancehall. If it makes aunties and Gen Z dance to the same song, it&apos;s in my crate.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {[
                  ["10+", "Years DJing"],
                  ["500+", "Shows played"],
                  ["2M+", "Mix plays"],
                ].map(([v, l]) => (
                  <div key={l as string} className="glass rounded-2xl px-3 py-3.5 text-center">
                    <p className="font-display text-2xl text-gold-300 sm:text-3xl">{v}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/book" className="gold-btn flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black"><CalendarCheck size={16} /> BOOK ME</Link>
                <a href="/api/stats" download className="flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-bold text-white transition hover:border-gold-500/60"><Download size={16} /> PRESS KIT (PDF soon)</a>
              </div>
            </div>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about-dj.jpg" alt="Deej Sandezz portrait" className="aspect-[4/5] w-full rounded-[2rem] border border-gold-500/25 object-cover" />
              <div className="glass absolute bottom-5 left-5 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm">
                <MapPin size={16} className="text-gold-400" />
                <span className="font-bold text-white">Nairobi, Kenya</span>
                <span className="text-zinc-400">• Available worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </GlowBackground>

      <Marquee items={["10+ years on the decks", "500+ shows", "2M+ mix plays", "Nairobi to the world"]} />

      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-gold-500">The journey</p>
        <h2 className="font-display mt-2 text-center text-3xl text-white sm:text-5xl">FROM KAYOLE TO MAIN STAGE</h2>
        <div className="relative mt-10 space-y-6 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-0.5 before:bg-gradient-to-b before:from-gold-500 before:via-gold-600/50 before:to-transparent sm:before:left-[23px]">
          {TIMELINE.map((t) => (
            <div key={t.year} className="relative flex gap-4 sm:gap-6">
              <span className="z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-gold-500 bg-black font-display text-[11px] text-gold-300 sm:h-12 sm:w-12 sm:text-xs">{t.year.slice(2)}</span>
              <div className="glass flex-1 rounded-3xl p-5">
                <p className="text-xs font-black uppercase tracking-widest text-gold-500">{t.year}</p>
                <p className="mt-1 font-black text-white">{t.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gold-500/15 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <h2 className="font-display text-center text-3xl text-white sm:text-4xl">WHAT I DO BEST</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Disc3, "Club & Festival Sets", "High-octane open-format sets that keep floors packed till close."],
              [Users, "Weddings & Private", "Tasteful, flexible, family-approved — from ruracio to reception."],
              [Radio, "Mixes & Content", "Weekly mixes, livestreams, brand jingles and event aftermovies."],
              [Award, "MC & Hosting", "Bilingual hype (EN/SHENG), crowd games, artist intros and order."],
            ].map((row) => {
              const Icon = row[0] as typeof Disc3;
              const t = row[1] as string;
              const d = row[2] as string;
              return (
                <div key={t} className="glass card-hover rounded-3xl p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-500/15 text-gold-300"><Icon size={22} /></span>
                  <p className="mt-4 font-black text-white">{t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{d}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 grid gap-6 rounded-[2rem] border border-gold-500/25 bg-gradient-to-br from-gold-600/15 to-transparent p-6 sm:p-10 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl text-white sm:text-3xl">GET THE FREE FRIDAY MIX 📩</h3>
              <p className="mt-2 text-sm text-zinc-400">Join 5,000+ fans getting exclusive mixes, presale codes & behind-the-scenes stories.</p>
            </div>
            <div className="flex items-center"><div className="w-full"><NewsletterForm source="about" /></div></div>
          </div>
          <p className="mt-8 text-center">
            <Link href="/stories" className="inline-flex items-center gap-2 text-sm font-bold text-gold-300 hover:text-gold-200">Read my full blog & stories <ChevronRight size={16} /></Link>
          </p>
        </div>
      </section>
    </main>
  );
}
