import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { songRequests } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(songRequests).orderBy(desc(songRequests.likes)).limit(100);
    return NextResponse.json({ requests: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, song, artist, dedication } = body;
    if (!name || !song) return NextResponse.json({ error: "Name and song required" }, { status: 400 });
    const rows = await db.insert(songRequests).values({
      name: String(name).slice(0, 120),
      song: String(song).slice(0, 200),
      artist: artist ? String(artist).slice(0, 200) : null,
      dedication: dedication ? String(dedication).slice(0, 500) : null,
    }).returning();
    return NextResponse.json({ request: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.update(songRequests).set({ likes: sql`${songRequests.likes} + 1` }).where(eq(songRequests.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
