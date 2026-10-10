import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fanMessages } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { AVATAR_COLORS } from "@/lib/utils";

export async function GET() {
  try {
    const rows = await db.select().from(fanMessages).orderBy(desc(fanMessages.createdAt)).limit(100);
    return NextResponse.json({ messages: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, message } = body;
    if (!name || !message) return NextResponse.json({ error: "Name and message required" }, { status: 400 });
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const rows = await db.insert(fanMessages).values({
      name: String(name).slice(0, 120),
      location: location ? String(location).slice(0, 120) : null,
      message: String(message).slice(0, 280),
      avatarColor: color,
    }).returning();
    return NextResponse.json({ message: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to post" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.update(fanMessages).set({ likes: sql`${fanMessages.likes} + 1` }).where(eq(fanMessages.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
