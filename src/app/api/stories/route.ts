import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const rows = await db.select().from(stories).where(eq(stories.slug, slug)).limit(1);
      if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ story: rows[0] });
    }
    const rows = await db.select().from(stories).orderBy(desc(stories.publishedAt)).limit(40);
    return NextResponse.json({ stories: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, imageUrl, category } = body;
    if (!title || !slug) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const rows = await db.insert(stories).values({ title, slug, excerpt, content, imageUrl, category }).returning();
    return NextResponse.json({ story: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
