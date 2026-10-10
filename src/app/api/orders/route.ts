import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";

function orderCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)];
  return `ORD-${s}`;
}

export async function GET() {
  try {
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
    return NextResponse.json({ orders: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, email, phone, address, city, items, mpesaCode, paymentMethod } = body;
    if (!customerName || !phone || !items?.length) return NextResponse.json({ error: "Name, phone and items required" }, { status: 400 });
    const subtotal = items.reduce((a: number, i: { qty: number; price: number }) => a + i.qty * i.price, 0);
    const nairobi = (city ?? "").toLowerCase().includes("nairobi");
    const deliveryFee = subtotal >= 5000 ? 0 : nairobi ? 250 : 400;
    const rows = await db.insert(orders).values({
      orderCode: orderCode(),
      customerName: String(customerName).slice(0, 150),
      email: email ? String(email).slice(0, 200) : null,
      phone: String(phone).slice(0, 30),
      address: address ? String(address).slice(0, 500) : null,
      city: city ? String(city).slice(0, 120) : null,
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      paymentMethod: paymentMethod ?? "mpesa",
      mpesaCode: mpesaCode ? String(mpesaCode).slice(0, 30) : null,
      status: mpesaCode ? "paid" : "pending",
    }).returning();
    return NextResponse.json({ order: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
