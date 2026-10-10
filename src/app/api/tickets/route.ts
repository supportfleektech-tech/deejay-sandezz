import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tickets, events } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

function ticketCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)];
  return `SDZ-${s}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    let rows;
    if (eventId) rows = await db.select().from(tickets).where(eq(tickets.eventId, Number(eventId))).orderBy(desc(tickets.createdAt)).limit(200);
    else rows = await db.select().from(tickets).orderBy(desc(tickets.createdAt)).limit(200);
    return NextResponse.json({ tickets: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, name, email, phone, tier, quantity, mpesaCode } = body;
    if (!eventId || !name || !phone) return NextResponse.json({ error: "Name, phone and event are required" }, { status: 400 });
    const ev = await db.select().from(events).where(eq(events.id, Number(eventId))).limit(1);
    if (!ev[0]) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    const qty = Math.min(10, Math.max(1, Number(quantity) || 1));
    const unit = tier === "vip" ? (ev[0].vipPrice ?? 0) : (ev[0].price ?? 0);
    const total = unit * qty;
    const code = ticketCode();
    const rows = await db.insert(tickets).values({
      eventId: Number(eventId), ticketCode: code, name: String(name).slice(0, 150),
      email: email ? String(email).slice(0, 200) : null, phone: String(phone).slice(0, 30),
      tier: tier ?? "regular", quantity: qty, totalAmount: total,
      mpesaCode: mpesaCode ? String(mpesaCode).slice(0, 30) : null,
      status: mpesaCode ? "paid" : "pending",
    }).returning();
    await db.update(events).set({ ticketsSold: sql`${events.ticketsSold} + ${qty}` }).where(eq(events.id, Number(eventId)));
    return NextResponse.json({ ticket: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to book ticket" }, { status: 500 });
  }
}
