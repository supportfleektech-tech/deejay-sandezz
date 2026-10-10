import { NextResponse } from "next/server";
import { db } from "@/db";
import { gallery } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(gallery).orderBy(desc(gallery.createdAt)).limit(60);
    return NextResponse.json({ gallery: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
