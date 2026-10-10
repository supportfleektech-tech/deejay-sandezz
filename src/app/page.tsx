"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, CalendarCheck, Ticket, ShoppingBag, MapPin, Phone, Download, Heart, Users, Disc3, Sparkles, ChevronRight, BadgeCheck, Star } from "lucide-react";
import { GlowBackground, Marquee, SectionHeading, Countdown, VinylBadge } from "@/components/visuals";
import { MixCard, EventCard, FanCard, type MixDTO, type EventDTO } from "@/components/cards";
import { ProductCard, type ProductDTO, useCart } from "@/components/shop";
import { NewsletterForm, TipJar, PollWidget, SpinWheel } from "@/components/forms";
import { usePlayer } from "@/components/player";
import { DJ, whatsappLink } from "@/lib/constants";
import { kes } from "@/lib/utils";
import { SocialIcon } from "@/components/icons";

type Fan = { id: number; name: string; location?: string | null; message: string; avatarColor?: string | null; likes?: number | null; createdAt?: string | null };
type Poll = { id: number; question: string; options: string[]; votes: number[] };

export default function HomePage() {
  const [mixes, setMixes] = useState<MixDTO[]>([]);
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [fans, setFans] = useState<Fan[]>([]);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [stats, setStats] = useState({ plays: 0, downloads: 0, sold: 0, fans: 0 });
  const { playTrack } = usePlayer();

  useEffect(() => {
    fetch("/api/mixes?featured=true&limit=6").then((r) => r.json()).then((j) => setMixes(j.mixes ?? [])).catch(() => {});
    fetch("/api/events").then((r) => r.json()).then((j) => setEvents((j.events ?? []).slice(0, 3))).catch(() => {});
    fetch("/api/products?featured=true").then((r) => r.json()).then((j) => setProducts((j.products ?? []).slice(0, 4))).catch(() => {});
    fetch("/api/fanwall").then((r) => r.json()).then((j) => setFans((j.messages ?? []).slice(0, 3))).catch(() => {});
    fetch("/api/polls").then((r) => r.json()).then((j) => setPoll(j.polls?.[0] ?? null)).catch(() => {});
    fetch("/api/stats").then((r) => r.json()).then((j) => setStats({ plays: j.mixes?.plays ?? 0, downloads: j.mixes?.downloads ?? 0, sold: j.tickets?.sold ?? 0, fans: j.fans ?? 0 })).catch(() => {});
  }, []);

  const nextEvent = events.find((e) => new Date(e.date).getTime() > Date.now());

  return (
    <main className="min-h-screen">
      {/* ===== HERO ===== */}
      <GlowBackground className="relative">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-dj.jpg" alt="Deej Sandezz live" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#060606]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:pt-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-black/60 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-gold-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Nairobi • Kenya • Est. 2014
              </p>
              <h1 className="font-display mt-5 text-[clamp(3rem,9vw,6.5rem)] leading-[0.95] tracking-wide text-white">
                DEEJ<br />
                <span className="gold-gradient-text">SANDEZZ</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                {DJ.tagline}. Free mixes every Friday, sold-out events, heavyweight merch — and a fan family that parties harder than anyone in the 254. 🎧🔥
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => mixes[0] && playTrack({ id: mixes[0].id, title: mixes[0].title, genre: mixes[0].genre, coverUrl: mixes[0].coverUrl, audioUrl: mixes[0].audioUrl }, mixes.map((m) => ({ id: m.id, title: m.title, genre: m.genre, coverUrl: m.coverUrl, audioUrl: m.audioUrl })))} className="gold-btn flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-black">
                  <Play size={17} fill="currentColor" /> PLAY LATEST MIX
                </button>
                <Link href="/book" className="flex items-center gap-2 rounded-full border border-gold-500/60 bg-black/50 px-7 py-3.5 text-sm font-black text-gold-300 backdrop-blur transition hover:bg-gold-500 hover:text-black">
                  <CalendarCheck size={17} /> BOOK THE DJ
                </Link>
                <Link href="/events" className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-black text-white backdrop-blur transition hover:border-white/50">
                  <Ticket size={17} /> GET TICKETS
                </Link>
              </div>
              <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
                {[
                  [stats.plays > 0 ? `${(stats.plays / 1000).toFixed(1)}K+` : "60K+", "Mix plays"],
                  [stats.downloads > 0 ? `${(stats.downloads / 1000).toFixed(1)}K+` : "15K+", "Downloads"],
                  ["500+", "Shows played"],
                ].map(([v, l]) => (
                  <div key={l as string} className="glass rounded-2xl px-4 py-3 text-center">
                    <p className="font-display text-2xl text-gold-300 sm:text-3xl">{v}</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden flex-col items-center gap-6 lg:flex">
              <div className="animate-float">
                <VinylBadge size={240} />
              </div>
              <div className="glass w-full max-w-xs rounded-3xl p-5">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-gold-500">Now trending</p>
                <p className="mt-2 font-bold text-white">{mixes[0]?.title ?? "Nairobi Nights Vol. 12"}</p>
                <div className="equalizer mt-3 flex h-7 items-end"><span /><span /><span /><span /><span /></div>
                <button onClick={() => mixes[0] && playTrack({ id: mixes[0].id, title: mixes[0].title, genre: mixes[0].genre, coverUrl: mixes[0].coverUrl, audioUrl: mixes[0].audioUrl })} className="gold-btn mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-black">
                  <Play size={15} fill="currentColor" /> TAP TO PLAY
                </button>
              </div>
            </div>
          </div>
        </div>
      </GlowBackground>

      <Marquee items={["Free mixes every Friday", "Book the DJ — 0700 474 855", "New merch drop", "Mombasa Beach Rave loading", "Amapiano • Gengetone • Afrobeats", "Join the fan wall"]} />

      {/* ===== NEXT EVENT COUNTDOWN ===== */}
      {nextEvent && (
        <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <div className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/20 blur-[100px]" />
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">Next event — don&apos;t miss it</p>
                <h2 className="font-display mt-2 text-3xl text-white sm:text-4xl">{nextEvent.title}</h2>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gold-500" /> {nextEvent.venue}, {nextEvent.city}</span>
                  <span className="font-black text-gold-300">From {kes(nextEvent.price ?? 0)}</span>
                </p>
                <div className="mt-5"><Countdown target={nextEvent.date} /></div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/events/${nextEvent.slug}`} className="gold-btn flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black"><Ticket size={16} /> GET TICKETS</Link>
                  <Link href="/events" className="flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-bold text-white transition hover:border-gold-500/60">All events <ChevronRight size={16} /></Link>
                </div>
              </div>
              <Link href={`/events/${nextEvent.slug}`} className="group relative hidden overflow-hidden rounded-3xl lg:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={nextEvent.imageUrl || "/images/hero-dj.jpg"} alt={nextEvent.title} className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== MIXES ===== */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <SectionHeading kicker="Fresh from the decks" title="LATEST MIXES — FREE" sub="Stream instantly or download free MP3s. New heat every Friday. No account, no wahala." href="/mixes" linkLabel="All mixes" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mixes.slice(0, 6).map((m) => <MixCard key={m.id} mix={m} queue={mixes} />)}
          {mixes.length === 0 && [0, 1, 2].map((i) => <div key={i} className="glass h-80 animate-pulse rounded-3xl" />)}
        </div>
      </section>

      {/* ===== EVENTS ===== */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <SectionHeading kicker="Pull up" title="UPCOMING EVENTS" sub="Tickets via M-PESA in under a minute. Come solo, leave with a squad." href="/events" linkLabel="All events" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => <EventCard key={e.id} ev={e} />)}
          {events.length === 0 && [0, 1, 2].map((i) => <div key={i} className="glass h-80 animate-pulse rounded-3xl" />)}
        </div>
      </section>

      {/* ===== SHOP ===== */}
      <section className="border-y border-gold-500/15 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <SectionHeading kicker="Rep the brand" title="MERCH DROP 🛍️" sub="Heavyweight tees, hoodies, caps & collector USBs. Pay with M-PESA, delivered countrywide." href="/shop" linkLabel="Shop all" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
            {products.length === 0 && [0, 1, 2, 3].map((i) => <div key={i} className="glass h-96 animate-pulse rounded-3xl" />)}
          </div>
        </div>
      </section>

      {/* ===== ABOUT STRIP ===== */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/about-dj.jpg" alt="Deej Sandezz" className="aspect-[4/5] w-full rounded-[2rem] border border-gold-500/25 object-cover sm:aspect-square lg:aspect-[4/5]" />
            <div className="glass absolute -bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl p-4 sm:left-8 sm:right-auto">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-500 text-black"><BadgeCheck size={24} /></span>
              <div>
                <p className="font-black text-white">Deej Sandezz <span className="text-gold-400">✓</span></p>
                <p className="text-xs text-zinc-400">10+ yrs • 500+ shows • 2M+ streams</p>
              </div>
            </div>
          </div>
          <div className="pt-6 lg:pt-0">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">The story</p>
            <h2 className="font-display mt-2 text-3xl text-white sm:text-4xl lg:text-5xl">FROM KAYOLE BEDROOM<br />TO <span className="gold-gradient-text">MAIN STAGE</span></h2>
            <p className="mt-4 leading-relaxed text-zinc-300">
              I started with a cracked laptop, Virtual DJ and a KSh 500 speaker. A decade later I headline festivals — but the mission never changed: give ordinary people an extraordinary night.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
              {["Club residencies across Nairobi", "Campus tours — KU, UoN, Strathmore & more", "Weddings, ruracios & corporates countrywide", "2M+ mix plays across platforms"].map((t) => (
                <li key={t} className="flex items-center gap-2.5"><Star size={15} className="fill-gold-500 text-gold-500" /> {t}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/about" className="gold-btn rounded-full px-7 py-3 text-sm font-black">READ MY STORY</Link>
              <Link href="/stories" className="rounded-full border border-white/15 px-7 py-3 text-sm font-bold text-white transition hover:border-gold-500/60">Blog & stories</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAN ZONE PREVIEW ===== */}
      <section className="border-y border-gold-500/15 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <SectionHeading kicker="Sandezz family" title="FAN ZONE 💛" sub="Shout-outs, requests, votes & daily prizes. This is YOUR corner of the site." href="/fan-zone" linkLabel="Enter fan zone" />
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5">
              {fans.map((f) => <FanCard key={f.id} fan={f} />)}
              {fans.length === 0 && <div className="glass h-40 animate-pulse rounded-3xl" />}
            </div>
            <div className="space-y-5">
              {poll && <PollWidget poll={poll} />}
              <div className="glass rounded-3xl p-6">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-gold-500">Support the craft</p>
                <p className="mt-2 font-bold text-white">Buy the DJ a coffee ☕</p>
                <p className="mt-1 text-sm text-zinc-400">Tips fund new mixes, better sound & bigger shows.</p>
                <Link href="/support" className="gold-btn mt-4 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black"><Heart size={16} /> TIP VIA M-PESA</Link>
              </div>
            </div>
            <SpinWheel />
          </div>
        </div>
      </section>

      {/* ===== YOUTUBE / SOCIALS ===== */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="glass overflow-hidden rounded-[2rem]">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">Watch & follow</p>
              <h2 className="font-display mt-2 text-3xl text-white sm:text-4xl">JOIN 50K+ FANS<br />ACROSS PLATFORMS</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">Full video mixes on YouTube, behind-the-scenes on TikTok & IG, daily vibes on WhatsApp status. Pick your poison 👇</p>
              <div className="mt-6 grid grid-cols-2 gap-2.5">
                {[
                  ["youtube", "YouTube", "Full video mixes", "https://www.youtube.com/@deesandezz"],
                  ["tiktok", "TikTok", "60-sec fire blends", "https://www.tiktok.com/@deej.sandezz"],
                  ["instagram", "Instagram", "Posters & BTS", "https://www.instagram.com/deej_sandezz"],
                  ["whatsapp", "WhatsApp", "Direct line", `https://wa.me/${DJ.phoneIntl}`],
                ].map(([icon, label, sub, href]) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-2xl border border-white/10 p-3.5 transition hover:border-gold-500/60 hover:bg-gold-500/5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-300"><SocialIcon icon={icon} size={19} /></span>
                    <span><span className="block text-sm font-bold text-white">{label}</span><span className="block text-xs text-zinc-500">{sub}</span></span>
                  </a>
                ))}
              </div>
              <Link href="/links" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold-300 hover:text-gold-200">See ALL my links in one page <ChevronRight size={16} /></Link>
            </div>
            <div className="relative min-h-[280px] bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/aqz-KE-bpKQ"
                title="Deej Sandezz on YouTube"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOOK CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <GlowBackground className="rounded-[2rem] border border-gold-500/25 bg-gradient-to-br from-gold-600/20 via-[#0c0c0e] to-[#0c0c0e]">
          <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_380px]">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-gold-400"><Sparkles size={14} /> Weddings • Clubs • Corporates • Ruracios</p>
              <h2 className="font-display mt-3 text-3xl text-white sm:text-5xl">LET&apos;S MAKE YOUR EVENT <span className="gold-gradient-text">LEGENDARY</span></h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">Dates fill fast — especially December & wedding season. Tell me your date, get a quote within 24 hours. Or just call <a href={DJ.phoneHref} className="font-black text-gold-300">{DJ.phoneDisplay}</a>.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/book" className="gold-btn flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-black"><CalendarCheck size={17} /> CHECK AVAILABILITY</Link>
                <a href={whatsappLink("Hi Deej Sandezz! I want to book you for my event. Date: ___ Venue: ___")} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-[#25D366]/60 px-8 py-3.5 text-sm font-black text-[#25D366] transition hover:bg-[#25D366]/10"><Phone size={16} /> WHATSAPP ME</a>
              </div>
            </div>
            <div className="glass rounded-3xl p-6">
              <p className="font-black text-white">Get the free Friday mix 📩</p>
              <p className="mt-1 text-xs text-zinc-400">Join 5,000+ subscribers. No spam, just heat.</p>
              <div className="mt-4"><NewsletterForm source="homepage" /></div>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="flex items-center gap-2 text-xs text-zinc-400"><Disc3 size={14} className="text-gold-500" /> Prefer downloads? <Link href="/mixes" className="font-bold text-gold-300">Browse all mixes</Link></p>
                <p className="mt-1.5 flex items-center gap-2 text-xs text-zinc-400"><Users size={14} className="text-gold-500" /> Want in on the fun? <Link href="/fan-zone" className="font-bold text-gold-300">Join the fan wall</Link></p>
              </div>
            </div>
          </div>
        </GlowBackground>
      </section>
    </main>
  );
}
