"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Ticket, ShoppingBag, CalendarCheck, Users, Heart, Plus, RefreshCw, Lock, Download } from "lucide-react";
import { GlowBackground } from "@/components/visuals";
import { kes, timeAgo, cn } from "@/lib/utils";

type Stats = {
  mixes: { plays: number; downloads: number; likes: number; count: number };
  tickets: { sold: number; revenue: number };
  orders: { revenue: number; count: number };
  tips: { total: number; count: number };
  fans: number; subscribers: number; bookings: number; events: number;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState<"overview" | "bookings" | "orders" | "tickets" | "fans">("overview");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [mixForm, setMixForm] = useState({ title: "", slug: "", genre: "Afrobeats", description: "", audioUrl: "", youtubeUrl: "", duration: "60:00", coverUrl: "" });

  const loadStats = () => fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {});
  const loadTab = async (t: typeof tab) => {
    setLoading(true);
    try {
      if (t === "bookings") {
        const j = await (await fetch("/api/bookings")).json();
        setRows(j.bookings ?? []);
      } else if (t === "orders") {
        const j = await (await fetch("/api/orders")).json();
        setRows(j.orders ?? []);
      } else if (t === "tickets") {
        const j = await (await fetch("/api/tickets")).json();
        setRows(j.tickets ?? []);
      } else if (t === "fans") {
        const j = await (await fetch("/api/fanwall")).json();
        setRows(j.messages ?? []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (authed) {
      loadStats();
      loadTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const exportCsv = () => {
    if (rows.length === 0) return;
    const pick: [string, string][] = [
      ["refCode", "Ref"], ["orderCode", "Order"], ["ticketCode", "Ticket"],
      ["name", "Name"], ["customerName", "Name"], ["phone", "Phone"],
      ["eventType", "Type"], ["tier", "Tier"], ["quantity", "Qty"],
      ["status", "Status"], ["total", "Total"], ["totalAmount", "Total"], ["createdAt", "Date"],
    ];
    const headers: string[] = [];
    for (const [, label] of pick) {
      if (!headers.includes(label)) headers.push(label);
    }
    const lines = [headers.join(",")];
    for (const r of rows) {
      const o = r as Record<string, unknown>;
      lines.push(headers.map((h) => {
        const field = pick.find(([, l]) => l === h)?.[0] ?? "";
        const v = field ? (o[field] ?? o[pick.find((p) => p[1] === h)?.[0] ?? ""] ?? "") : "";
        return `"${String(v ?? "").replace(/"/g, '""')}"`;
      }).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sandezz-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const setStatus = async (id: number, status: string) => {
    setRows((rs) => rs.map((r) => ((r as Record<string, unknown>).id === id ? { ...(r as object), status } : r)));
    await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) }).catch(() => {});
  };

  useEffect(() => {
    if (authed && tab !== "overview") loadTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const seed = async () => {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      loadStats();
    } catch {}
    setSeeding(false);
  };

  const addMix = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = mixForm.slug || mixForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const r = await fetch("/api/mixes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...mixForm, slug }) });
      if (r.ok) {
        setShowAdd(false);
        setMixForm({ title: "", slug: "", genre: "Afrobeats", description: "", audioUrl: "", youtubeUrl: "", duration: "60:00", coverUrl: "" });
        loadStats();
      }
    } catch {}
  };

  if (!authed)
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="glass w-full max-w-sm rounded-[2rem] p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-500/15 text-gold-300"><Lock size={24} /></span>
          <p className="font-display mt-4 text-2xl text-white">DJ DASHBOARD</p>
          <p className="mt-1 text-sm text-zinc-400">Enter your admin PIN to continue. (Demo PIN: <b className="text-gold-300">sandezz</b>)</p>
          <form onSubmit={(e) => { e.preventDefault(); if (pin.trim().toLowerCase() === "sandezz") setAuthed(true); else alert("Wrong PIN 😅"); }} className="mt-5 space-y-3">
            <input value={pin} onChange={(e) => setPin(e.target.value)} type="password" placeholder="Admin PIN" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white placeholder:text-zinc-500" />
            <button className="gold-btn w-full rounded-2xl py-3 font-black">UNLOCK 🔓</button>
          </form>
        </div>
      </main>
    );

  const cards = stats ? [
    ["Mix Plays", Number(stats.mixes.plays).toLocaleString(), `${stats.mixes.count} mixes • ${Number(stats.mixes.downloads).toLocaleString()} downloads`],
    ["Ticket Revenue", kes(stats.tickets.revenue), `${stats.tickets.sold} tickets sold`],
    ["Merch Revenue", kes(stats.orders.revenue), `${stats.orders.count} orders`],
    ["Tips", kes(stats.tips.total), `${stats.tips.count} supporters`],
    ["Bookings", String(stats.bookings), "enquiries received"],
    ["Mailing List", String(stats.subscribers), `${stats.fans} fan wall posts`],
  ] : [];

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">Welcome back, boss 🎧</p>
              <h1 className="font-display mt-1 text-3xl text-white sm:text-5xl">DASHBOARD</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { loadStats(); loadTab(tab); }} className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white hover:border-gold-500/60">
                <RefreshCw size={15} /> Refresh
              </button>
              <button onClick={seed} disabled={seeding} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-zinc-300 hover:border-gold-500/60 disabled:opacity-50">
                {seeding ? "Seeding..." : "Seed demo data"}
              </button>
              {tab !== "overview" && (
                <button onClick={exportCsv} disabled={rows.length === 0} className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white hover:border-gold-500/60 disabled:opacity-40">
                  <Download size={15} /> CSV
                </button>
              )}
              <button onClick={() => setShowAdd(true)} className="gold-btn flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black">
                <Plus size={15} /> New Mix
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(([t, v, s]) => (
              <div key={t as string} className="glass rounded-3xl p-5">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{t}</p>
                <p className="font-display mt-1 text-3xl text-gold-300">{v}</p>
                <p className="mt-1 text-xs text-zinc-400">{s}</p>
              </div>
            ))}
            {!stats && [0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="glass h-28 animate-pulse rounded-3xl" />)}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              ["overview", "Overview", LayoutDashboard],
              ["bookings", "Bookings", CalendarCheck],
              ["orders", "Merch Orders", ShoppingBag],
              ["tickets", "Tickets", Ticket],
              ["fans", "Fan Wall", Users],
            ].map((row) => {
              const key = row[0] as string;
              const label = row[1] as string;
              const Icon = row[2] as typeof Users;
              return (
                <button key={key} onClick={() => setTab(key as typeof tab)} className={cn("flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition", tab === key ? "border-gold-500 bg-gold-500 text-black" : "border-white/10 text-zinc-300 hover:border-gold-500/50")}>
                  <Icon size={15} /> {label}
                </button>
              );
            })}
          </div>

          {showAdd && (
            <form onSubmit={addMix} className="glass mt-6 space-y-3 rounded-3xl p-6">
              <p className="font-black text-white">Drop a new mix 🔥</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={mixForm.title} onChange={(e) => setMixForm({ ...mixForm, title: e.target.value })} required placeholder="Mix title *" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                <input value={mixForm.genre} onChange={(e) => setMixForm({ ...mixForm, genre: e.target.value })} placeholder="Genre" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
              </div>
              <textarea value={mixForm.description} onChange={(e) => setMixForm({ ...mixForm, description: e.target.value })} rows={2} placeholder="Description" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={mixForm.audioUrl} onChange={(e) => setMixForm({ ...mixForm, audioUrl: e.target.value })} placeholder="Audio MP3 URL (free host e.g. hearthis / archive.org)" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                <input value={mixForm.youtubeUrl} onChange={(e) => setMixForm({ ...mixForm, youtubeUrl: e.target.value })} placeholder="YouTube URL" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={mixForm.coverUrl} onChange={(e) => setMixForm({ ...mixForm, coverUrl: e.target.value })} placeholder="Cover image URL" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
                <input value={mixForm.duration} onChange={(e) => setMixForm({ ...mixForm, duration: e.target.value })} placeholder="Duration e.g. 62:14" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500" />
              </div>
              <div className="flex gap-2">
                <button className="gold-btn rounded-2xl px-8 py-3 text-sm font-black">PUBLISH MIX</button>
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-bold text-zinc-300">Cancel</button>
              </div>
            </form>
          )}

          {tab === "overview" ? (
            <div className="glass mt-6 rounded-3xl p-6">
              <p className="font-black text-white">🚀 Zero-budget growth checklist</p>
              <ul className="mt-4 grid gap-2.5 text-sm text-zinc-300 sm:grid-cols-2">
                {[
                  "Drop a new mix every Friday — consistency beats quality early on",
                  "Clip 3× 30-sec TikToks from every mix (free reach)",
                  "Reply to all bookings within 1 hour — speed closes deals",
                  "Post fan wall screenshots on WhatsApp status daily",
                  "Announce events 3 weeks out + early-bird pricing",
                  "Email the list before every drop (free repeat traffic)",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5"><Heart size={15} className="mt-0.5 shrink-0 text-gold-500" /> {t}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="glass mt-6 overflow-x-auto rounded-3xl">
              {loading ? (
                <p className="p-8 text-center text-sm text-zinc-500">Loading...</p>
              ) : rows.length === 0 ? (
                <p className="p-8 text-center text-sm text-zinc-500">No records yet. Share your site and watch this fill up! 🚀</p>
              ) : (
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-zinc-500">
                      <th className="p-4">Ref / Code</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Detail</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 60).map((r, i) => {
                      const g = (k: string) => (r as Record<string, unknown>)[k] as string | number | null | undefined;
                      return (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
                          <td className="p-4 font-mono text-xs text-gold-300">{String(g("refCode") ?? g("orderCode") ?? g("ticketCode") ?? `#${g("id")}`)}</td>
                          <td className="p-4 font-bold text-white">{String(g("name") ?? g("customerName") ?? "-")}<span className="block text-xs font-normal text-zinc-500">{String(g("phone") ?? g("location") ?? "")}</span></td>
                          <td className="max-w-[260px] truncate p-4 text-zinc-300">{String(g("eventType") ?? g("message") ?? g("tier") ?? (Array.isArray(r.items) ? `${(r.items as unknown[]).length} items` : "-"))}</td>
                          <td className="p-4 font-bold text-white">{g("total") || g("totalAmount") ? kes(Number(g("total") ?? g("totalAmount"))) : "-"}</td>
                          <td className="p-4">
                          {tab === "bookings" ? (
                            <button
                              onClick={() => {
                                const cur = String(g("status") ?? "new");
                                const flow = ["new", "contacted", "quoted", "confirmed", "done", "declined"];
                                setStatus(Number(g("id")), flow[(flow.indexOf(cur) + 1) % flow.length]);
                              }}
                              className="rounded-full bg-gold-500/15 px-2.5 py-1 text-[11px] font-bold text-gold-300 transition hover:bg-gold-500 hover:text-black"
                            >
                              {String(g("status") ?? "new")} →
                            </button>
                          ) : (
                            <span className="rounded-full bg-gold-500/15 px-2.5 py-1 text-[11px] font-bold text-gold-300">{String(g("status") ?? "new")}</span>
                          )}
                        </td>
                          <td className="p-4 text-xs text-zinc-500">{timeAgo(g("createdAt") as string)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </GlowBackground>
    </main>
  );
}
