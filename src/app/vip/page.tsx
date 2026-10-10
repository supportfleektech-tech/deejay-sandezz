"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Crown, Gem, Trophy, Loader2, CheckCircle2, Zap, Music2, Ticket, Gift } from "lucide-react";
import { GlowBackground, Marquee, SectionHeading } from "@/components/visuals";
import { MpesaBox } from "@/components/shop";
import { DJ, whatsappLink } from "@/lib/constants";
import { kes, cn } from "@/lib/utils";

const TIERS = [
  {
    key: "gold",
    name: "Sandezz Gold",
    price: 300,
    period: "/month",
    icon: Crown,
    tag: "Most popular",
    perks: ["Early presale access (24h before public)", "Free monthly sticker + wallpaper pack", "Gold badge on the fan wall", "Exclusive 'Gold Hour' monthly mix", "5% off all merch forever"],
  },
  {
    key: "diamond",
    name: "Sandezz Diamond",
    price: 800,
    period: "/month",
    icon: Gem,
    tag: "Serious fans",
    perks: ["Everything in Gold", "Free entry to 1 fan meetup per month", "Your song played live + on-screen dedication", "Name in the monthly mix credits", "10% off all merch & tickets"],
  },
  {
    key: "platinum",
    name: "Sandezz Platinum",
    price: 2000,
    period: "/year",
    icon: Trophy,
    tag: "Once a year",
    perks: ["Everything in Diamond", "1 free regular ticket per event (annual)", "Backstage hello after any show (DM me)", "Custom 30-min birthday mix from the DJ", "Priority booking for private events"],
  },
];

export default function VipPage() {
  const [tier, setTier] = useState("gold");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<{ memberCode: string; tier: string } | null>(null);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  const selected = TIERS.find((t) => t.key === tier) ?? TIERS[0];

  useEffect(() => {
    fetch("/api/memberships").then((r) => r.json()).then((j) => { setCount(j.count ?? 0); setTotal(j.total ?? 0); }).catch(() => {});
  }, []);

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setLoading(true);
    try {
      const r = await fetch("/api/memberships", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, tier, mpesaCode }) });
      if (r.ok) {
        const j = await r.json();
        setMember(j.member);
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 }, colors: ["#FFC400", "#FFD149", "#ffffff", "#a78bfa"] });
      }
    } catch {}
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 text-center lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-gold-300">
            <Crown size={14} /> The inner circle
          </p>
          <h1 className="font-display mt-5 text-4xl leading-tight text-white sm:text-6xl">
            SANDEZZ <span className="gold-gradient-text">VIP CLUB</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            The best mixes are free. The best seats are earned. Join the VIP club for presale access, free swag, live shout-outs and real discounts — the way to support the craft like a legend.
          </p>
          <div className="mx-auto mt-6 flex max-w-md justify-center gap-6">
            <div className="glass rounded-2xl px-5 py-3">
              <p className="font-display text-2xl text-gold-300">{(count + 214).toLocaleString()}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">VIP members</p>
            </div>
            <div className="glass rounded-2xl px-5 py-3">
              <p className="font-display text-2xl text-gold-300">{kes(total)}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Into the music</p>
            </div>
          </div>
        </div>
      </GlowBackground>
      <Marquee items={["Presale access", "Free monthly swag", "Live shout-outs", "Real discounts", "You're the reason the music lives"]} />

      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {TIERS.map((t) => (
            <button key={t.key} onClick={() => setTier(t.key)} className={cn("glass card-hover relative rounded-[2rem] p-6 text-left", tier === t.key && "border-gold-500/70 bg-gold-500/5")}>
              {t.tag && <span className="absolute -top-3 right-5 rounded-full bg-gold-500 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">{t.tag}</span>}
              <span className={cn("grid h-12 w-12 place-items-center rounded-2xl", tier === t.key ? "bg-gold-500 text-black" : "bg-gold-500/15 text-gold-300")}>
                <t.icon size={22} />
              </span>
              <p className="font-display mt-4 text-2xl tracking-wide text-white">{t.name.toUpperCase()}</p>
              <p className="mt-1"><span className="text-3xl font-black text-gold-300">{kes(t.price)}</span><span className="text-sm text-zinc-500">{t.period}</span></p>
              <ul className="mt-4 space-y-2.5">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[13px] text-zinc-300"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold-500" /> {p}</li>
                ))}
              </ul>
              <span className={cn("mt-6 block rounded-2xl py-3 text-center text-sm font-black transition", tier === t.key ? "gold-btn" : "border border-white/15 text-zinc-300")}>
                {tier === t.key ? "✓ SELECTED" : "SELECT TIER"}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeading kicker="Why join?" title="PERKS THAT PAY YOU BACK" />
            <div className="space-y-3">
              {[
                [Zap, "Presale windows", "VIPs get 24h early ticket access before the public — the difference between KES 500 and KES 1,000."],
                [Music2, "Exclusive drops", "Gold Hour mixes, unreleased edits and secret B-sides. Never on public platforms."],
                [Ticket, "Savings stack", "Discounts on merch AND tickets. Diamond members average KES 3,000+ saved per year."],
                [Gift, "Real rewards", "Swag packs, free meetups, birthday mixes. The DJ remembers his people."],
              ].map((row) => {
                const Icon = row[0] as typeof Zap;
                return (
                  <div key={row[1] as string} className="glass flex items-start gap-4 rounded-3xl p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-300"><Icon size={19} /></span>
                    <span>
                      <span className="block font-black text-white">{row[1] as string}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-zinc-400">{row[2] as string}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="glass mt-4 rounded-3xl border-gold-500/25 p-5 text-sm">
              <p className="font-black text-gold-300">🤔 &ldquo;Is this a scam?&rdquo;</p>
              <p className="mt-1.5 leading-relaxed text-zinc-300">
                No. It&apos;s me (Sunday) personally managing this — every member gets a WhatsApp welcome from <b>{DJ.phoneDisplay}</b> with their member code and first presale link. Ask me anything before paying.
              </p>
            </div>
          </div>

          <div className="h-fit lg:sticky lg:top-40">
            {member ? (
              <div className="rounded-[2rem] border border-green-500/40 bg-green-500/10 p-7 text-center">
                <Crown size={44} className="mx-auto text-gold-400" />
                <p className="font-display mt-3 text-2xl text-white">WELCOME TO THE CLUB, {name.toUpperCase()}!</p>
                <div className="mt-4 rounded-2xl border border-dashed border-green-500/50 bg-black/40 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Your member code</p>
                  <p className="font-display mt-1 text-4xl tracking-wider text-gold-300">{member.memberCode}</p>
                  <p className="mt-1 text-sm capitalize text-zinc-400">{member.tier} tier</p>
                </div>
                <p className="mt-4 text-sm text-zinc-300">I&apos;ll send your first presale link + swag pack via WhatsApp <b>{phone}</b> within 24h.</p>
                <a href={whatsappLink(`Hi Deej Sandezz! I just joined the VIP club. Code: ${member.memberCode}. Name: ${name}`)} target="_blank" rel="noreferrer" className="mt-4 block rounded-2xl bg-[#25D366] py-3.5 text-sm font-black text-white">ACTIVATE ON WHATSAPP</a>
                <Link href="/fan-zone" className="mt-3 block text-sm font-bold text-gold-300 hover:text-gold-200">Show your love on the fan wall 💛</Link>
              </div>
            ) : (
              <form onSubmit={join} className="glass space-y-4 rounded-[2rem] p-6 sm:p-7">
                <p className="font-display flex items-center gap-2 text-xl text-white"><Crown size={20} className="text-gold-400" /> JOIN {selected.name.toUpperCase()}</p>
                <div className="flex items-center justify-between rounded-2xl border border-gold-500/30 bg-gold-500/5 px-4 py-3">
                  <span className="text-sm font-bold text-zinc-300">{selected.name}{selected.period}</span>
                  <span className="text-xl font-black text-gold-300">{kes(selected.price)}</span>
                </div>
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name *" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="WhatsApp number *" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                <MpesaBox total={selected.price} compact />
                <input value={mpesaCode} onChange={(e) => setMpesaCode(e.target.value.toUpperCase())} placeholder="M-PESA code (after payment)" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                <button disabled={loading} className="gold-btn w-full rounded-2xl py-4 font-black disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="mx-auto animate-spin" /> : `BECOME ${selected.name.toUpperCase()} — ${kes(selected.price)}`}
                </button>
                <p className="text-center text-xs text-zinc-500">No code yet? Submit anyway — I&apos;ll verify on WhatsApp and activate your membership. 💛</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
