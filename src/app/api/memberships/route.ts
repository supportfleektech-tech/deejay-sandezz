import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { memberships } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

function memberCode(tier: string) {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += c[Math.floor(Math.random() * c.length)];
  return `${tier.slice(0, 2).toUpperCase()}-${s}`;
}

export async function GET() {
  try {
    const rows = await db.select().from(memberships).orderBy(desc(memberships.createdAt)).limit(200);
    const [agg] = await db.select({
      total: sql<number>`coalesce(sum(${memberships.amount}),0)`,
      count: sql<number>`count(*)`,
    }).from(memberships);
    return NextResponse.json({ members: rows, total: Number(agg?.total ?? 0), count: Number(agg?.count ?? 0) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, tier, mpesaCode } = body;
    if (!name || !phone) return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
    const amounts: Record<string, number> = { gold: 300, diamond: 800, platinum: 2000 };
    const t = (tier ?? "gold") as string;
    const rows = await db.insert(memberships).values({
      memberCode: memberCode(t),
      name: String(name).slice(0, 150),
      phone: String(phone).slice(0, 30),
      email: email ? String(email).slice(0, 200) : null,
      tier: t,
      amount: amounts[t] ?? 300,
      mpesaCode: mpesaCode ? String(mpesaCode).slice(0, 30) : null,
      status: mpesaCode ? "active" : "pending",
    }).returning();
    return NextResponse.json({ member: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to join" }, { status: 500 });
  }
}
