import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const rows = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
      if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ event: rows[0] });
    }
    const rows = await db.select().from(events).orderBy(asc(events.date)).limit(60);
    return NextResponse.json({ events: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, venue, city, date, price, vipPrice, capacity, imageUrl, description } = body;
    if (!title || !slug || !venue || !date) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const rows = await db.insert(events).values({
      title, slug, venue, city, date: new Date(date), price, vipPrice, capacity, imageUrl, description,
    }).returning();
    return NextResponse.json({ event: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save event" }, { status: 500 });
  }
}
