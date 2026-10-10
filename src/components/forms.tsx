"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Send, Heart, PartyPopper, CheckCircle2, Loader2, Gift, BarChart3, Music4, MessageSquareHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { MpesaBox } from "./shop";
import { DJ } from "@/lib/constants";

function boom() {
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.7 }, colors: ["#FFC400", "#FF8A00", "#ffffff", "#22d3ee"] });
}

export function NewsletterForm({ source = "website" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, source }) });
      setDone(true);
      boom();
    } catch {}
    setLoading(false);
  };
  if (done)
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-sm font-semibold text-green-300">
        <CheckCircle2 size={20} /> You&apos;re on the list! First exclusive mix drops in your inbox soon. 🎧
      </div>
    );
  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5 sm:flex-row">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 sm:max-w-[160px]" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@email.com" className="w-full flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
      <button disabled={loading} className="gold-btn flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} JOIN
      </button>
    </form>
  );
}

export function TipJar() {
  const [amount, setAmount] = useState(200);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const final = custom ? Number(custom) || 0 : amount;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (final <= 0) return;
    setLoading(true);
    try {
      const r = await fetch("/api/tips", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, amount: final, message, mpesaCode }) });
      if (r.ok) { setDone(true); boom(); setTimeout(() => boom(), 400); }
    } catch {}
    setLoading(false);
  };
  if (done)
    return (
      <div className="rounded-3xl border border-gold-500/40 bg-gold-500/10 p-8 text-center">
        <PartyPopper size={40} className="mx-auto text-gold-400" />
        <p className="font-display mt-4 text-2xl text-gold-300">ASANTE SANA, {name || "FAN"}!</p>
        <p className="mt-2 text-sm text-zinc-300">Your KES {final.toLocaleString()} keeps the music playing. Shout-out coming in the next mix! 🔊</p>
        <button onClick={() => { setDone(false); setMpesaCode(""); setMessage(""); }} className="mt-5 rounded-full border border-gold-500/50 px-6 py-2.5 text-sm font-bold text-gold-300 hover:bg-gold-500 hover:text-black">Send another</button>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {[100, 200, 500, 1000].map((a) => (
          <button type="button" key={a} onClick={() => { setAmount(a); setCustom(""); }} className={cn("rounded-2xl border py-3 text-sm font-black transition", !custom && amount === a ? "border-gold-500 bg-gold-500/15 text-gold-300" : "border-white/10 text-zinc-300 hover:border-gold-500/50")}>
            {a}
          </button>
        ))}
      </div>
      <input value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))} placeholder="Or custom amount (KES)" inputMode="numeric" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
      <div className="grid gap-2.5 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (for shout-out)" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
        <input value={mpesaCode} onChange={(e) => setMpesaCode(e.target.value.toUpperCase())} placeholder="M-PESA code e.g. QHX12ABC34" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Dedication / message (optional)" rows={2} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
      <MpesaBox total={final} compact />
      <button disabled={loading || final <= 0} className="gold-btn flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-black disabled:opacity-50">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} />} {final > 0 ? `TIP KES ${final.toLocaleString()}` : "ENTER AMOUNT"}
      </button>
    </form>
  );
}

export function FanWallForm({ onPosted }: { onPosted?: () => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setLoading(true);
    try {
      const r = await fetch("/api/fanwall", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, location, message }) });
      if (r.ok) { setName(""); setLocation(""); setMessage(""); boom(); onPosted?.(); }
    } catch {}
    setLoading(false);
  };
  return (
    <form onSubmit={submit} className="glass space-y-3 rounded-3xl p-5 sm:p-6">
      <p className="flex items-center gap-2 font-black text-gold-300"><MessageSquareHeart size={18} /> Drop some love on the wall</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name *" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / Estate (e.g. Kayole)" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={3} maxLength={280} placeholder="Your message to Deej Sandezz... (280 chars)" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
      <button disabled={loading} className="gold-btn flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} POST TO FAN WALL
      </button>
    </form>
  );
}

export function RequestForm({ onPosted }: { onPosted?: () => void }) {
  const [name, setName] = useState("");
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [dedication, setDedication] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !song) return;
    setLoading(true);
    try {
      const r = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, song, artist, dedication }) });
      if (r.ok) { setName(""); setSong(""); setArtist(""); setDedication(""); boom(); onPosted?.(); }
    } catch {}
    setLoading(false);
  };
  return (
    <form onSubmit={submit} className="glass space-y-3 rounded-3xl p-5 sm:p-6">
      <p className="flex items-center gap-2 font-black text-gold-300"><Music4 size={18} /> Request a song for the next set</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name *" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
        <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artiste (e.g. Bien)" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
      </div>
      <input value={song} onChange={(e) => setSong(e.target.value)} required placeholder="Song title * (e.g. Mbwe Mbwe)" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
      <input value={dedication} onChange={(e) => setDedication(e.target.value)} placeholder="Dedication (optional — who is it for?)" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
      <button disabled={loading} className="gold-btn flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Music4 size={16} />} SEND REQUEST
      </button>
    </form>
  );
}

export function PollWidget({ poll }: { poll: { id: number; question: string; options: string[]; votes: number[] } }) {
  const [voted, setVoted] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>(poll.votes);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      const v = localStorage.getItem(`poll-${poll.id}`);
      if (v !== null) setVoted(Number(v));
    } catch {}
  }, [poll.id]);
  const total = votes.reduce((a, b) => a + b, 0);
  const vote = async (i: number) => {
    if (voted !== null || loading) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/polls?id=${poll.id}&option=${i}`, { method: "PATCH" });
      if (r.ok) {
        const j = await r.json();
        setVotes(j.votes ?? votes.map((v, k) => (k === i ? v + 1 : v)));
        setVoted(i);
        try { localStorage.setItem(`poll-${poll.id}`, String(i)); } catch {}
        boom();
      }
    } catch {}
    setLoading(false);
  };
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-gold-500"><BarChart3 size={15} /> Fan vote</p>
      <p className="mt-2 font-bold text-white">{poll.question}</p>
      <div className="mt-4 space-y-2.5">
        {poll.options.map((opt, i) => {
          const pct = total > 0 ? Math.round(((votes[i] ?? 0) / total) * 100) : 0;
          const mine = voted === i;
          return (
            <button key={i} onClick={() => vote(i)} disabled={voted !== null} className={cn("relative w-full overflow-hidden rounded-2xl border text-left transition", mine ? "border-gold-500" : "border-white/10 hover:border-gold-500/50", voted !== null && "cursor-default")}>
              {voted !== null && <span className={cn("absolute inset-y-0 left-0 transition-all", mine ? "bg-gold-500/30" : "bg-white/10")} style={{ width: `${pct}%` }} />}
              <span className="relative flex items-center justify-between px-4 py-3 text-sm font-semibold text-white">
                {opt} {mine ? "✅" : ""}
                {voted !== null && <span className="text-gold-300">{pct}%</span>}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-zinc-500">{total.toLocaleString()} votes • {voted !== null ? "Thanks for voting!" : "Tap to vote"}</p>
    </div>
  );
}

export function SpinWheel() {
  const prizes = ["5% OFF merch", "FREE sticker pack", "10% OFF merch", "Shout-out in next mix", "FREE mix download", "20% OFF merch"];
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(3);
  useEffect(() => {
    try {
      const day = new Date().toDateString();
      const raw = localStorage.getItem("sandezz-spins");
      if (raw) {
        const j = JSON.parse(raw);
        if (j.day === day) setSpinsLeft(j.left);
        else { setSpinsLeft(3); localStorage.setItem("sandezz-spins", JSON.stringify({ day, left: 3 })); }
      } else localStorage.setItem("sandezz-spins", JSON.stringify({ day, left: 3 }));
    } catch {}
  }, []);
  const spin = () => {
    if (spinning || spinsLeft <= 0) return;
    setSpinning(true);
    setResult(null);
    const idx = Math.floor(Math.random() * prizes.length);
    const target = 360 * 5 + (360 - (idx * 60 + 30));
    setAngle((a) => a + target);
    setTimeout(() => {
      setSpinning(false);
      setResult(prizes[idx]);
      const left = spinsLeft - 1;
      setSpinsLeft(left);
      try { localStorage.setItem("sandezz-spins", JSON.stringify({ day: new Date().toDateString(), left })); } catch {}
      boom();
    }, 3200);
  };
  return (
    <div className="glass rounded-3xl p-6 text-center sm:p-8">
      <p className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-gold-500"><Gift size={15} /> Spin the deck — win daily</p>
      <div className="relative mx-auto mt-6 h-56 w-56 sm:h-64 sm:w-64">
        <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 text-3xl">🔻</div>
        <div className="h-full w-full rounded-full border-4 border-gold-500 shadow-[0_0_50px_rgba(255,196,0,0.35)] transition-transform duration-[3200ms] ease-out" style={{ transform: `rotate(${angle}deg)`, background: "conic-gradient(#f59602 0 60deg,#141417 60deg 120deg,#ffd149 120deg 180deg,#141417 180deg 240deg,#f59602 240deg 300deg,#141417 300deg 360deg)" }}>
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-gold-300 bg-black text-center text-[10px] font-black leading-tight text-gold-300">DEEJ<br />SANDEZZ</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        {prizes.map((p, i) => (
          <span key={i} className={cn("rounded-full border px-2.5 py-1 text-[11px] font-bold", result === p ? "border-gold-400 bg-gold-500/20 text-gold-200" : "border-white/10 text-zinc-400")}>{p}</span>
        ))}
      </div>
      {result ? (
        <div className="mt-5 rounded-2xl border border-gold-500/50 bg-gold-500/10 p-4">
          <p className="text-sm text-zinc-300">You won</p>
          <p className="font-display text-2xl text-gold-300">{result}!</p>
          <p className="mt-1 text-xs text-zinc-400">Screenshot this & WhatsApp {DJ.phoneDisplay} to claim 🎉</p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-zinc-400">{spinsLeft > 0 ? `${spinsLeft} free spin${spinsLeft > 1 ? "s" : ""} left today` : "No spins left today — come back tomorrow!"}</p>
      )}
      <button onClick={spin} disabled={spinning || spinsLeft <= 0} className="gold-btn mt-4 rounded-full px-10 py-3.5 font-black disabled:opacity-40">
        {spinning ? "SPINNING..." : "SPIN NOW"}
      </button>
    </div>
  );
}
