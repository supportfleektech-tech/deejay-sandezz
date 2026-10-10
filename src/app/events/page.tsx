"use client";

import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { GlowBackground, Marquee, SectionHeading } from "@/components/visuals";
import { EventCard, type EventDTO } from "@/components/cards";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    fetch("/api/events").then((r) => r.json()).then((j) => setEvents(j.events ?? [])).catch(() => {});
  }, []);

  const upcoming = events.filter((e) => e.status !== "past" && new Date(e.date).getTime() > Date.now() - 86400000);
  const past = events.filter((e) => !upcoming.includes(e));
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">Pull up — party with the DJ</p>
          <h1 className="font-display mt-2 text-4xl text-white sm:text-6xl">EVENTS & <span className="gold-gradient-text">TOUR DATES</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Club nights, rooftop sundowners, campus tours & festival stages. Grab M-PESA tickets in under a minute — show your code at the gate. Easy.
          </p>
          <div className="mt-6 flex gap-2">
            {(["upcoming", "past"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-black uppercase tracking-wider transition", tab === t ? "border-gold-500 bg-gold-500 text-black" : "border-white/10 text-zinc-300 hover:border-gold-500/50")}>
                <Ticket size={15} /> {t === "upcoming" ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
              </button>
            ))}
          </div>
        </div>
      </GlowBackground>
      <Marquee items={["M-PESA tickets in 60 seconds", "Early birds sell out fast", "VIP tables via WhatsApp", "Group discounts for 5+"]} />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <SectionHeading kicker={tab === "upcoming" ? "Don't sleep on these" : "We made history"} title={tab === "upcoming" ? "UPCOMING SHOWS" : "PAST EVENTS"} />
        {list.length === 0 && events.length > 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-lg font-bold text-white">No {tab} events right now</p>
            <p className="mt-1 text-sm text-zinc-400">New dates drop soon — follow on socials so you never miss out.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => <EventCard key={e.id} ev={e} />)}
            {events.length === 0 && [0, 1, 2].map((i) => <div key={i} className="glass h-80 animate-pulse rounded-3xl" />)}
          </div>
        )}
      </section>
    </main>
  );
}
