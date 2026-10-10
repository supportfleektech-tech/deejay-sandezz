"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, Clock } from "lucide-react";
import { GlowBackground } from "@/components/visuals";
import { DJ, SOCIALS } from "@/lib/constants";
import { SocialIcon } from "@/components/icons";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", topic: "Booking Enquiry", message: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const text = `Hi Deej Sandezz! (${form.topic})\nName: ${form.name}\nPhone: ${form.phone}\n${form.message}`;
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      window.open(`https://wa.me/${DJ.phoneIntl}?text=${encodeURIComponent(text)}`, "_blank");
    }, 600);
  };

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">Let&apos;s talk</p>
          <h1 className="font-display mt-2 text-4xl text-white sm:text-6xl">GET IN <span className="gold-gradient-text">TOUCH</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Bookings, collabs, media, or just to say the mix was fire — I read everything, usually reply same day.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
            <div className="space-y-4">
              <a href={DJ.phoneHref} className="glass card-hover flex items-center gap-4 rounded-3xl p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-500 text-black"><Phone size={20} /></span>
                <span><span className="block text-xs font-black uppercase tracking-widest text-zinc-500">Call / WhatsApp</span><span className="block font-black text-white">{DJ.phoneDisplay}</span></span>
              </a>
              <a href={`mailto:${DJ.email}`} className="glass card-hover flex items-center gap-4 rounded-3xl p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-500/15 text-gold-300"><Mail size={20} /></span>
                <span className="min-w-0"><span className="block text-xs font-black uppercase tracking-widest text-zinc-500">Email</span><span className="block break-all font-black text-white">{DJ.email}</span></span>
              </a>
              <div className="glass flex items-center gap-4 rounded-3xl p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-500/15 text-gold-300"><MapPin size={20} /></span>
                <span><span className="block text-xs font-black uppercase tracking-widest text-zinc-500">Based in</span><span className="block font-black text-white">{DJ.location} • Travels worldwide</span></span>
              </div>
              <div className="glass flex items-center gap-4 rounded-3xl p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-500/15 text-gold-300"><Clock size={20} /></span>
                <span><span className="block text-xs font-black uppercase tracking-widest text-zinc-500">Response time</span><span className="block font-black text-white">WhatsApp: minutes • Email: 24h</span></span>
              </div>
              <div className="glass rounded-3xl p-5">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Follow everywhere</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SOCIALS.filter((s) => s.icon !== "linktree").slice(0, 8).map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-gold-500 hover:text-gold-300" style={{ ["--hover" as string]: s.color }}>
                      <SocialIcon icon={s.icon} size={17} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="glass rounded-[2rem] p-5 sm:p-8">
              {done ? (
                <div className="grid place-items-center py-16 text-center">
                  <div>
                    <CheckCircle2 size={52} className="mx-auto text-green-400" />
                    <p className="font-display mt-4 text-2xl text-white">OPENING WHATSAPP... 💬</p>
                    <p className="mt-2 text-sm text-zinc-400">Your message is ready to send — just hit send in WhatsApp. I&apos;ll reply ASAP!</p>
                    <button onClick={() => setDone(false)} className="mt-5 rounded-full border border-gold-500/50 px-6 py-2.5 text-sm font-bold text-gold-300 hover:bg-gold-500 hover:text-black">Send another</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <p className="font-display text-2xl text-white">SEND A MESSAGE</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name *" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Your phone" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                  </div>
                  <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                    {["Booking Enquiry", "Event Tickets", "Merch Order", "Collaboration", "Media / Press", "Just Saying Hi 🔥"].map((t) => <option key={t} className="bg-zinc-900">{t}</option>)}
                  </select>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={6} placeholder="What's up? Tell me dates, venues, ideas — everything..." className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                  <button disabled={loading} className="gold-btn flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-black disabled:opacity-60">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} SEND VIA WHATSAPP
                  </button>
                  <p className="text-center text-xs text-zinc-500">Zero-budget superpower: messages land straight in my WhatsApp. Fast replies, no forms lost in the void. ⚡</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </GlowBackground>
    </main>
  );
}
