import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tips } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(tips).orderBy(desc(tips.createdAt)).limit(50);
    const total = await db.select({ sum: sql<number>`coalesce(sum(${tips.amount}),0)` }).from(tips);
    return NextResponse.json({ tips: rows, total: Number(total[0]?.sum ?? 0), count: rows.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, amount, message, mpesaCode } = body;
    if (!amount || Number(amount) <= 0) return NextResponse.json({ error: "Amount required" }, { status: 400 });
    const rows = await db.insert(tips).values({
      name: name ? String(name).slice(0, 120) : null,
      amount: Number(amount),
      message: message ? String(message).slice(0, 500) : null,
      mpesaCode: mpesaCode ? String(mpesaCode).slice(0, 30) : null,
    }).returning();
    return NextResponse.json({ tip: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
