import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { mixes, mixComments } from "@/db/schema";
import { desc, eq, ilike, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");
    const q = searchParams.get("q");
    const slug = searchParams.get("slug");
    const featured = searchParams.get("featured");
    const limit = Number(searchParams.get("limit") ?? 50);

    if (slug) {
      const rows = await db.select().from(mixes).where(eq(mixes.slug, slug)).limit(1);
      if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const comments = await db.select().from(mixComments).where(eq(mixComments.mixId, rows[0].id)).orderBy(desc(mixComments.createdAt)).limit(50);
      return NextResponse.json({ mix: rows[0], comments });
    }

    let query = db.select().from(mixes).orderBy(desc(mixes.publishedAt)).limit(Math.min(limit, 100));
    const rows = await query;
    let filtered = rows;
    if (genre && genre !== "All") filtered = filtered.filter((m) => m.genre === genre);
    if (featured === "true") filtered = filtered.filter((m) => m.featured);
    if (q) {
      const needle = q.toLowerCase();
      filtered = filtered.filter((m) => m.title.toLowerCase().includes(needle) || (m.description ?? "").toLowerCase().includes(needle));
    }
    return NextResponse.json({ mixes: filtered });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load mixes" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const action = searchParams.get("action");
    if (!id || !action) return NextResponse.json({ error: "Missing params" }, { status: 400 });
    const col = action === "play" ? mixes.plays : action === "download" ? mixes.downloads : action === "like" ? mixes.likes : null;
    if (!col) return NextResponse.json({ error: "Bad action" }, { status: 400 });
    await db.update(mixes).set({ [action === "play" ? "plays" : action === "download" ? "downloads" : "likes"]: sql`${col} + 1` }).where(eq(mixes.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.comment) {
      const { mixId, name, message } = body;
      if (!mixId || !name || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      const rows = await db.insert(mixComments).values({ mixId: Number(mixId), name: String(name).slice(0, 120), message: String(message).slice(0, 500) }).returning();
      return NextResponse.json({ comment: rows[0] });
    }
    const { title, slug, description, genre, coverUrl, audioUrl, youtubeUrl, duration } = body;
    if (!title || !slug) return NextResponse.json({ error: "Title and slug required" }, { status: 400 });
    const rows = await db.insert(mixes).values({ title, slug, description, genre: genre ?? "Afrobeats", coverUrl, audioUrl, youtubeUrl, duration }).returning();
    return NextResponse.json({ mix: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
