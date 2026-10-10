import { NextResponse } from "next/server";
import { db } from "@/db";
import { mixes, events, tickets, orders, bookings, fanMessages, newsletterSubscribers, tips } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const [mixAgg] = await db.select({
      plays: sql<number>`coalesce(sum(${mixes.plays}),0)`,
      downloads: sql<number>`coalesce(sum(${mixes.downloads}),0)`,
      likes: sql<number>`coalesce(sum(${mixes.likes}),0)`,
      count: sql<number>`count(*)`,
    }).from(mixes);
    const [ticketAgg] = await db.select({
      sold: sql<number>`coalesce(sum(${tickets.quantity}),0)`,
      revenue: sql<number>`coalesce(sum(${tickets.totalAmount}),0)`,
    }).from(tickets);
    const [orderAgg] = await db.select({
      revenue: sql<number>`coalesce(sum(${orders.total}),0)`,
      count: sql<number>`count(*)`,
    }).from(orders);
    const [tipAgg] = await db.select({
      total: sql<number>`coalesce(sum(${tips.amount}),0)`,
      count: sql<number>`count(*)`,
    }).from(tips);
    const [fanCount] = await db.select({ count: sql<number>`count(*)` }).from(fanMessages);
    const [subCount] = await db.select({ count: sql<number>`count(*)` }).from(newsletterSubscribers);
    const [bookingCount] = await db.select({ count: sql<number>`count(*)` }).from(bookings);
    const [eventCount] = await db.select({ count: sql<number>`count(*)` }).from(events);

    return NextResponse.json({
      mixes: { plays: Number(mixAgg?.plays ?? 0), downloads: Number(mixAgg?.downloads ?? 0), likes: Number(mixAgg?.likes ?? 0), count: Number(mixAgg?.count ?? 0) },
      tickets: { sold: Number(ticketAgg?.sold ?? 0), revenue: Number(ticketAgg?.revenue ?? 0) },
      orders: { revenue: Number(orderAgg?.revenue ?? 0), count: Number(orderAgg?.count ?? 0) },
      tips: { total: Number(tipAgg?.total ?? 0), count: Number(tipAgg?.count ?? 0) },
      fans: Number(fanCount?.count ?? 0),
      subscribers: Number(subCount?.count ?? 0),
      bookings: Number(bookingCount?.count ?? 0),
      events: Number(eventCount?.count ?? 0),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
