"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { CalendarCheck, Loader2, CheckCircle2, Phone, Clock, BadgeCheck } from "lucide-react";
import { GlowBackground, Marquee } from "@/components/visuals";
import { BOOKING_PACKAGES, DJ, whatsappLink } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EVENT_TYPES = ["Club Night", "Wedding", "Birthday Party", "Ruracio / Traditional", "Corporate Event", "Campus Event", "Festival / Concert", "Church / Gospel Event", "House Party", "Other"];

export default function BookPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", eventType: "Club Night", eventDate: "", venue: "", city: "Nairobi", guests: 200, hours: 4, budget: "KES 15K – 25K", package: "Club Set", message: "" });
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setLoading(true);
    try {
      const r = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (r.ok) {
        const j = await r.json();
        setRef(j.booking.refCode);
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors: ["#FFC400", "#FF8A00", "#ffffff"] });
      }
    } catch {}
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">Bookings open — 2026 dates filling fast</p>
          <h1 className="font-display mt-2 text-4xl text-white sm:text-6xl">BOOK <span className="gold-gradient-text">DEEJ SANDEZZ</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Clubs, weddings, ruracios, corporates, campus — if people need to dance, I&apos;m your guy. Fill the form, get a quote within 24 hours. Or call <a href={DJ.phoneHref} className="font-black text-gold-300">{DJ.phoneDisplay}</a> right now.
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {BOOKING_PACKAGES.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => set("package", p.name)}
                className={cn("glass card-hover relative rounded-3xl p-6 text-left", form.package === p.name && "border-gold-500/70 bg-gold-500/5")}
              >
                <span className="absolute right-4 top-4 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">{p.tag}</span>
                <p className="font-display text-xl tracking-wide text-white">{p.name.toUpperCase()}</p>
                <p className="mt-1 text-lg font-black text-gold-300">{p.price}</p>
                <p className="flex items-center gap-1.5 text-xs text-zinc-400"><Clock size={13} /> {p.duration}</p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-zinc-300"><BadgeCheck size={14} className="shrink-0 text-gold-500" /> {f}</li>
                  ))}
                </ul>
                <span className={cn("mt-5 block rounded-2xl py-2.5 text-center text-sm font-black transition", form.package === p.name ? "gold-btn" : "border border-white/15 text-zinc-300")}>
                  {form.package === p.name ? "✓ SELECTED" : "SELECT PACKAGE"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </GlowBackground>
      <Marquee items={["24-hour quote guarantee", "December dates almost gone", "Sound + MC options available", "Countrywide travel"]} />
      <section className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {ref ? (
          <div className="rounded-[2rem] border border-green-500/40 bg-green-500/10 p-8 text-center sm:p-12">
            <CheckCircle2 size={52} className="mx-auto text-green-400" />
            <p className="font-display mt-4 text-3xl text-white">REQUEST RECEIVED! 🎧</p>
            <div className="mx-auto mt-4 max-w-sm rounded-2xl border border-dashed border-green-500/50 bg-black/40 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Booking reference</p>
              <p className="font-display mt-1 text-4xl tracking-wider text-gold-300">{ref}</p>
            </div>
            <p className="mx-auto mt-4 max-w-md text-sm text-zinc-300">
              Asante <b>{form.name}</b>! I&apos;ll confirm availability for <b>{form.eventDate || "your date"}</b> within 24 hours. Want a faster reply? Hit me on WhatsApp now:
            </p>
            <a href={whatsappLink(`Hi Deej Sandezz! I just sent a booking request (Ref: ${ref}). ${form.eventType} on ${form.eventDate} at ${form.venue}, ${form.city}.`)} target="_blank" rel="noreferrer" className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-black text-white">
              <Phone size={16} /> FAST-TRACK ON WHATSAPP
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="glass space-y-4 rounded-[2rem] p-5 sm:p-8">
            <p className="font-display flex items-center gap-2 text-2xl text-white"><CalendarCheck size={22} className="text-gold-400" /> CHECK AVAILABILITY</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Your name *</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Brian Otieno" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Phone (WhatsApp) *</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} required placeholder="07XX XXX XXX" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Event type *</label>
                <select value={form.eventType} onChange={(e) => set("eventType", e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                  {EVENT_TYPES.map((t) => <option key={t} className="bg-zinc-900">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Event date</label>
                <input type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} min={new Date().toISOString().slice(0, 10)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Venue</label>
                <input value={form.venue} onChange={(e) => set("venue", e.target.value)} placeholder="e.g. The Alchemist, Westlands" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">City</label>
                <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Nairobi" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Expected guests: {form.guests}</label>
                <input type="range" min={20} max={5000} step={10} value={form.guests} onChange={(e) => set("guests", Number(e.target.value))} className="player-range w-full" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Set length: {form.hours} hrs</label>
                <input type="range" min={1} max={12} value={form.hours} onChange={(e) => set("hours", Number(e.target.value))} className="player-range w-full" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Budget range</label>
                <select value={form.budget} onChange={(e) => set("budget", e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                  {["Under KES 15K", "KES 15K – 25K", "KES 25K – 50K", "KES 50K – 100K", "KES 100K+"].map((b) => <option key={b} className="bg-zinc-900">{b}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Tell me about your event</label>
              <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={4} placeholder="Vibe, music taste, theme, must-play songs, sound system situation..." className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
            </div>
            <button disabled={loading} className="gold-btn w-full rounded-2xl py-4 font-black disabled:opacity-60">
              {loading ? <Loader2 size={18} className="mx-auto animate-spin" /> : `REQUEST ${form.package.toUpperCase()} — GET QUOTE IN 24H`}
            </button>
            <p className="text-center text-xs text-zinc-500">No payment now — just checking availability. 50% deposit locks your date. Prefer talking? <a href={DJ.phoneHref} className="font-bold text-gold-300">{DJ.phoneDisplay}</a></p>
          </form>
        )}
        <div className="mx-auto mt-14 max-w-3xl">
          <p className="font-display text-center text-2xl text-white sm:text-3xl">BOOKING FAQ</p>
          <div className="mt-6 space-y-3">
            {[
              ["How fast do you respond?", "Bookings get a reply within 24 hours — usually the same day. WhatsApp is fastest: " + DJ.phoneDisplay],
              ["How does payment work?", "50% deposit locks your date; the balance is due 3 days before the event. All payments via M-PESA to " + DJ.mpesaTill + " with a written receipt on WhatsApp."],
              ["Do you provide sound & lighting?", "I bring my laptop, controllers and monitor. Most venues have PA; for outdoor/private events I can connect vetted sound partners at extra cost — just say the word in your booking."],
              ["What if it rains / power cuts?", "Rain or shine, I play. I carry backup batteries for my laptop and speakers run fine on most venue generators. In 10 years, zero cancelled gigs. 🏆"],
              ["Can I request specific songs?", "Absolutely. Send your must-play list with the booking. 90% of requests get played — the DJ has final say only on taste. 😉"],
              ["Do you travel outside Nairobi?", "Yes — all of Kenya. Travel & accommodation for out-of-town events is billed at cost, no hidden markups."],
            ].map(([q, a]) => (
              <details key={q} className="glass group rounded-2xl p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="text-gold-400 transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
