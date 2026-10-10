import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const rows = await db.select().from(products).orderBy(desc(products.createdAt)).limit(60);
    let out = rows;
    if (category && category !== "All") out = out.filter((p) => p.category === category);
    if (featured === "true") out = out.filter((p) => p.featured);
    return NextResponse.json({ products: out });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, price, comparePrice, category, sizes, colors, imageUrls, stock } = body;
    if (!name || !slug || price === undefined) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const rows = await db.insert(products).values({ name, slug, description, price: Number(price), comparePrice, category, sizes, colors, imageUrls, stock }).returning();
    return NextResponse.json({ product: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}
