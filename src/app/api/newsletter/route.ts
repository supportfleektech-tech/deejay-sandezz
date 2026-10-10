import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt)).limit(500);
    return NextResponse.json({ subscribers: rows, count: rows.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source } = body;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    try {
      const rows = await db.insert(newsletterSubscribers).values({
        email: String(email).toLowerCase().slice(0, 200),
        name: name ? String(name).slice(0, 150) : null,
        source: source ?? "website",
      }).returning();
      return NextResponse.json({ subscriber: rows[0] });
    } catch {
      return NextResponse.json({ ok: true, duplicate: true });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
