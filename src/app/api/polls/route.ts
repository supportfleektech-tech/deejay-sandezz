import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { polls } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(polls).orderBy(desc(polls.createdAt)).limit(10);
    return NextResponse.json({ polls: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, options } = body;
    if (!question || !options?.length) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const rows = await db.insert(polls).values({ question, options, votes: options.map(() => 0) }).returning();
    return NextResponse.json({ poll: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const option = Number(searchParams.get("option"));
    if (!id || Number.isNaN(option)) return NextResponse.json({ error: "Missing params" }, { status: 400 });
    const rows = await db.select().from(polls).where(eq(polls.id, id)).limit(1);
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const votes = [...(rows[0].votes ?? [])];
    votes[option] = (votes[option] ?? 0) + 1;
    await db.update(polls).set({ votes }).where(eq(polls.id, id));
    return NextResponse.json({ votes });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
