import { NextResponse } from "next/server";
import { db } from "@/db";
import { mixes, events, products, stories, fanMessages, songRequests, polls, gallery } from "@/db/schema";
import { sql } from "drizzle-orm";
import { seedMixes, seedEvents, seedProducts, seedStories, seedFans, seedRequests, seedPolls, seedGallery } from "@/lib/seed-data";
import { AVATAR_COLORS } from "@/lib/utils";

export async function POST() {
  try {
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(mixes);
    if (Number(count) > 0) return NextResponse.json({ ok: true, skipped: true, message: "Already seeded" });

    for (const m of seedMixes) {
      await db.insert(mixes).values({ ...m, publishedAt: new Date(Date.now() - Math.random() * 90 * 86400000) }).onConflictDoNothing();
    }
    for (const e of seedEvents) {
      const { dateOffsetDays, ...rest } = e;
      const date = new Date(Date.now() + dateOffsetDays * 86400000);
      date.setHours(19, 0, 0, 0);
      await db.insert(events).values({ ...rest, date }).onConflictDoNothing();
    }
    for (const p of seedProducts) {
      await db.insert(products).values(p).onConflictDoNothing();
    }
    for (const s of seedStories) {
      await db.insert(stories).values({ ...s, publishedAt: new Date(Date.now() - Math.random() * 60 * 86400000) }).onConflictDoNothing();
    }
    seedFans.forEach(async (f, i) => {
      await db.insert(fanMessages).values({ ...f, avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length] });
    });
    for (const r of seedRequests) {
      await db.insert(songRequests).values(r);
    }
    for (const p of seedPolls) {
      await db.insert(polls).values(p);
    }
    for (const g of seedGallery) {
      await db.insert(gallery).values(g);
    }
    return NextResponse.json({ ok: true, message: "Seeded successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Seed failed", detail: String(e) }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
