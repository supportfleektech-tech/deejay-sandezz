"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowLeft, Loader2, CheckCircle2, ShoppingBag } from "lucide-react";
import { GlowBackground } from "@/components/visuals";
import { MpesaBox, useCart } from "@/components/shop";
import { kes } from "@/lib/utils";
import { DJ, whatsappLink } from "@/lib/constants";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Nairobi");
  const [address, setAddress] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{ orderCode: string; total: number } | null>(null);

  const deliveryFee = subtotal >= 5000 || subtotal === 0 ? 0 : city.toLowerCase().includes("nairobi") ? 250 : 400;
  const total = subtotal + deliveryFee;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || !name || !phone) return;
    setLoading(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name, phone, city, address, items: items.map((i) => ({ productId: i.productId, name: i.name, size: i.size, qty: i.qty, price: i.price })), mpesaCode }),
      });
      if (r.ok) {
        const j = await r.json();
        setOrder(j.order);
        clear();
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors: ["#FFC400", "#FF8A00", "#ffffff"] });
      }
    } catch {}
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 lg:px-8">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-gold-300"><ArrowLeft size={16} /> Back to shop</Link>
          <h1 className="font-display mt-3 text-4xl text-white sm:text-5xl">CHECKOUT</h1>

          {order ? (
            <div className="mx-auto mt-8 max-w-xl rounded-[2rem] border border-green-500/40 bg-green-500/10 p-8 text-center">
              <CheckCircle2 size={52} className="mx-auto text-green-400" />
              <p className="font-display mt-4 text-3xl text-white">ORDER RECEIVED! 🎉</p>
              <div className="mt-4 rounded-2xl border border-dashed border-green-500/50 bg-black/40 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Order code</p>
                <p className="font-display mt-1 text-4xl tracking-wider text-gold-300">{order.orderCode}</p>
                <p className="mt-1 text-sm text-zinc-300">Total paid: {kes(order.total)}</p>
              </div>
              <p className="mt-4 text-sm text-zinc-300">We&apos;ll call <b>{phone}</b> to confirm delivery to <b>{city}</b>. Delivery takes 1–3 days.</p>
              <a href={whatsappLink(`Hi! I just ordered merch. Code: ${order.orderCode}. Name: ${name}`)} target="_blank" rel="noreferrer" className="mt-5 block rounded-2xl bg-[#25D366] py-3.5 text-sm font-black text-white">CONFIRM ON WHATSAPP</a>
              <Link href="/shop" className="mt-3 block text-sm font-bold text-gold-300 hover:text-gold-200">Continue shopping</Link>
            </div>
          ) : items.length === 0 ? (
            <div className="glass mt-8 rounded-[2rem] p-12 text-center">
              <ShoppingBag size={52} className="mx-auto text-zinc-700" />
              <p className="mt-4 text-lg font-bold text-white">Your cart is empty</p>
              <Link href="/shop" className="gold-btn mt-5 inline-block rounded-full px-8 py-3 text-sm font-black">GO TO SHOP</Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
              <form onSubmit={submit} className="glass space-y-4 rounded-[2rem] p-5 sm:p-7">
                <p className="font-black text-white">1. Delivery details</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name *" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone / M-PESA number *" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City / Town" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Estate, street, landmark" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                </div>
                <p className="pt-2 font-black text-white">2. Pay with M-PESA</p>
                <MpesaBox total={total} />
                <input value={mpesaCode} onChange={(e) => setMpesaCode(e.target.value.toUpperCase())} placeholder="M-PESA transaction code (e.g. QHX12ABC34)" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                <button disabled={loading} className="gold-btn w-full rounded-2xl py-4 font-black disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="mx-auto animate-spin" /> : `COMPLETE ORDER — ${kes(total)}`}
                </button>
                <p className="text-center text-xs text-zinc-500">Pay to <b className="text-zinc-300">{DJ.mpesaTill}</b> first, then paste your code above. No code yet? You can still submit — we&apos;ll confirm on WhatsApp.</p>
              </form>
              <div className="glass h-fit rounded-[2rem] p-5 sm:p-6 lg:sticky lg:top-40">
                <p className="font-black text-white">Order summary</p>
                <ul className="mt-4 space-y-3">
                  {items.map((i) => (
                    <li key={`${i.productId}-${i.size}`} className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={i.image || "/images/merch-tee.jpg"} alt={i.name} className="h-14 w-14 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">{i.name}</p>
                        <p className="text-xs text-zinc-500">{i.size ?? "OS"} × {i.qty}</p>
                      </div>
                      <p className="text-sm font-black text-gold-300">{kes(i.price * i.qty)}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span className="font-bold text-white">{kes(subtotal)}</span></div>
                  <div className="flex justify-between text-zinc-400"><span>Delivery ({city})</span><span className="font-bold text-white">{deliveryFee === 0 ? "FREE 🎉" : kes(deliveryFee)}</span></div>
                  <div className="flex justify-between text-lg"><span className="font-bold text-white">Total</span><span className="font-black text-gold-300">{kes(total)}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </GlowBackground>
    </main>
  );
}
