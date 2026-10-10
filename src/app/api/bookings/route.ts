import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

function refCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)];
  return `BK-${s}`;
}

export async function GET() {
  try {
    const rows = await db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(200);
    return NextResponse.json({ bookings: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventType, eventDate, venue, city, guests, hours, budget, package: pkg, message } = body;
    if (!name || !phone || !eventType) return NextResponse.json({ error: "Name, phone and event type required" }, { status: 400 });
    const rows = await db.insert(bookings).values({
      refCode: refCode(),
      name: String(name).slice(0, 150),
      email: email ? String(email).slice(0, 200) : null,
      phone: String(phone).slice(0, 30),
      eventType: String(eventType).slice(0, 120),
      eventDate: eventDate ? new Date(eventDate) : null,
      venue: venue ? String(venue).slice(0, 255) : null,
      city: city ? String(city).slice(0, 120) : null,
      guests: Number(guests) || 100,
      hours: Number(hours) || 4,
      budget: budget ? String(budget).slice(0, 60) : null,
      package: pkg ? String(pkg).slice(0, 80) : null,
      message: message ? String(message).slice(0, 2000) : null,
    }).returning();
    return NextResponse.json({ booking: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to submit booking" }, { status: 500 });
  }
}

const FLOW = ["new", "contacted", "quoted", "confirmed", "done", "declined"];

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = Number(body?.id);
    const status = body?.status as string | undefined;
    if (!id || !status || !FLOW.includes(status)) return NextResponse.json({ error: "Invalid update" }, { status: 400 });
    const rows = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
    return NextResponse.json({ booking: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
