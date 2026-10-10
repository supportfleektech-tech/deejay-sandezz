"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowLeft, Minus, Plus, Ticket, Loader2, CheckCircle2, Crown, MapPin } from "lucide-react";
import { GlowBackground, ShareButtons, Countdown, ProgressBar, EventMeta } from "@/components/visuals";
import { MpesaBox } from "@/components/shop";
import { kes, cn } from "@/lib/utils";
import { DJ, whatsappLink } from "@/lib/constants";

type Ev = {
  id: number; title: string; slug: string; venue: string; city?: string | null; address?: string | null;
  date: string; price?: number | null; vipPrice?: number | null; capacity?: number | null;
  ticketsSold?: number | null; imageUrl?: string | null; description?: string | null;
  lineup?: string[] | null; status?: string | null;
};

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [ev, setEv] = useState<Ev | null>(null);
  const [tier, setTier] = useState<"regular" | "vip">("regular");
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<{ ticketCode: string; totalAmount: number } | null>(null);

  useEffect(() => {
    fetch(`/api/events?slug=${slug}`).then((r) => r.json()).then((j) => setEv(j.event ?? null)).catch(() => {});
  }, [slug]);

  const unit = tier === "vip" ? (ev?.vipPrice ?? 0) : (ev?.price ?? 0);
  const total = unit * qty;
  const sold = ev?.ticketsSold ?? 0;
  const cap = ev?.capacity ?? 200;
  const past = ev ? (ev.status === "past" || new Date(ev.date).getTime() < Date.now() - 86400000) : false;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ev || !name || !phone) return;
    setLoading(true);
    try {
      const r = await fetch("/api/tickets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventId: ev.id, name, phone, tier, quantity: qty, mpesaCode }) });
      if (r.ok) {
        const j = await r.json();
        setTicket(j.ticket);
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors: ["#FFC400", "#FF8A00", "#ffffff"] });
      }
    } catch {}
    setLoading(false);
  };

  if (!ev)
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 lg:px-8"><div className="glass h-96 animate-pulse rounded-[2rem]" /></main>
    );

  return (
    <main className="min-h-screen">
      <div className="relative h-[46vh] min-h-[340px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ev.imageUrl || "/images/hero-dj.jpg"} alt={ev.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-black/50 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-zinc-300 backdrop-blur transition hover:text-gold-300">
            <ArrowLeft size={16} /> All events
          </Link>
          <h1 className="font-display mt-4 max-w-4xl text-3xl leading-tight text-white sm:text-5xl">{ev.title}</h1>
          <div className="mt-3"><EventMeta date={ev.date} venue={ev.venue} city={ev.city} /></div>
        </div>
      </div>

      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div>
              {!past && (
                <div className="glass rounded-3xl p-5 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-gold-500">Countdown to showtime</p>
                  <div className="mt-3"><Countdown target={ev.date} /></div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-bold text-zinc-300">{sold}/{cap} tickets gone</span>
                    <span className="font-black text-gold-300">{Math.round((sold / cap) * 100)}% full</span>
                  </div>
                  <ProgressBar value={sold} max={cap} className="mt-2" />
                </div>
              )}
              <div className="glass mt-5 rounded-3xl p-5 sm:p-7">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-gold-500">About this event</p>
                <p className="mt-3 leading-relaxed text-zinc-200">{ev.description}</p>
                {ev.lineup && ev.lineup.length > 0 && (
                  <>
                    <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-gold-500">Lineup</p>
                    <ul className="mt-3 space-y-2">
                      {ev.lineup.map((l, i) => (
                        <li key={i} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-500/15 text-xs font-black text-gold-300">{i + 1}</span> {l}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
                  <iframe
                    className="h-64 w-full"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${ev.venue}, ${ev.city ?? "Nairobi"}, Kenya`)}&output=embed`}
                    title={`Map: ${ev.venue}`}
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ev.venue}, ${ev.city ?? "Nairobi"}, Kenya`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-gold-300 hover:text-gold-200"
                >
                  <MapPin size={15} /> Open in Google Maps
                </a>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <ShareButtons title={ev.title} path={`/events/${ev.slug}`} />
                </div>
              </div>
            </div>

            <div>
              {past ? (
                <div className="glass rounded-3xl p-6 text-center">
                  <p className="font-display text-2xl text-white">THIS ONE IS HISTORY 📸</p>
                  <p className="mt-2 text-sm text-zinc-400">Catch the next one — they sell out fast.</p>
                  <Link href="/events" className="gold-btn mt-5 block rounded-2xl py-3.5 text-center text-sm font-black">SEE UPCOMING SHOWS</Link>
                </div>
              ) : ticket ? (
                <div className="rounded-3xl border border-green-500/40 bg-green-500/10 p-6 text-center sm:p-8">
                  <CheckCircle2 size={48} className="mx-auto text-green-400" />
                  <p className="font-display mt-4 text-2xl text-white">YOU&apos;RE IN! 🎉</p>
                  <div className="mt-4 rounded-2xl border border-dashed border-green-500/50 bg-black/40 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Your ticket code</p>
                    <p className="font-display mt-1 text-4xl tracking-wider text-gold-300">{ticket.ticketCode}</p>
                    <p className="mt-2 text-xs text-zinc-400">{qty} × {tier.toUpperCase()} • {ev.title}</p>
                  </div>
                  <p className="mt-4 text-sm text-zinc-300">Screenshot this code — show it at the gate. A confirmation will be sent to <b>{phone}</b>.</p>
                  <a href={whatsappLink(`Hi! I just bought ${qty} ${tier} ticket(s) for ${ev.title}. Code: ${ticket.ticketCode}. Name: ${name}`)} target="_blank" rel="noreferrer" className="mt-4 block rounded-2xl bg-[#25D366] py-3 text-sm font-black text-white">CONFIRM ON WHATSAPP</a>
                </div>
              ) : (
                <form onSubmit={submit} className="glass space-y-4 rounded-3xl p-5 sm:p-6 lg:sticky lg:top-40">
                  <p className="font-display flex items-center gap-2 text-xl text-white"><Ticket size={20} className="text-gold-400" /> GET YOUR TICKETS</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setTier("regular")} className={cn("rounded-2xl border p-4 text-left transition", tier === "regular" ? "border-gold-500 bg-gold-500/10" : "border-white/10 hover:border-white/30")}>
                      <p className="text-xs font-black uppercase tracking-wider text-zinc-400">Regular</p>
                      <p className="mt-1 text-xl font-black text-white">{kes(ev.price ?? 0)}</p>
                    </button>
                    <button type="button" onClick={() => setTier("vip")} className={cn("rounded-2xl border p-4 text-left transition", tier === "vip" ? "border-gold-500 bg-gold-500/10" : "border-white/10 hover:border-white/30")}>
                      <p className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-gold-400"><Crown size={12} /> VIP</p>
                      <p className="mt-1 text-xl font-black text-white">{kes(ev.vipPrice ?? 0)}</p>
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                    <span className="text-sm font-bold text-zinc-300">Quantity <span className="text-zinc-500">(max 10)</span></span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-8 w-8 place-items-center rounded-full border border-white/15 hover:border-gold-500" aria-label="Less"><Minus size={14} /></button>
                      <span className="min-w-6 text-center text-lg font-black text-gold-300">{qty}</span>
                      <button type="button" onClick={() => setQty(Math.min(10, qty + 1))} className="grid h-8 w-8 place-items-center rounded-full border border-white/15 hover:border-gold-500" aria-label="More"><Plus size={14} /></button>
                    </div>
                  </div>
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name *" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone / M-PESA number *" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                  <input value={mpesaCode} onChange={(e) => setMpesaCode(e.target.value.toUpperCase())} placeholder="M-PESA code (after payment)" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                  <MpesaBox total={total} compact />
                  <button disabled={loading} className="gold-btn w-full rounded-2xl py-3.5 font-black disabled:opacity-60">
                    {loading ? <Loader2 size={18} className="mx-auto animate-spin" /> : `PAY ${kes(total)} — GET TICKETS`}
                  </button>
                  <p className="text-center text-xs text-zinc-500">Pay to <b className="text-zinc-300">{DJ.mpesaTill}</b> ({DJ.mpesaName}), paste code above, done. ✅</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </GlowBackground>
    </main>
  );
}
