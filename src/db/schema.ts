import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
} from "drizzle-orm/pg-core";

// ---- MIXES ----
export const mixes = pgTable("mixes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  genre: varchar("genre", { length: 100 }).notNull().default("Afrobeats"),
  coverUrl: text("cover_url"),
  audioUrl: text("audio_url"),
  youtubeUrl: text("youtube_url"),
  mixcloudUrl: text("mixcloud_url"),
  hearthisUrl: text("hearthis_url"),
  duration: varchar("duration", { length: 20 }).default("60:00"),
  durationSeconds: integer("duration_seconds").default(3600),
  bpm: integer("bpm").default(120),
  tracklist: jsonb("tracklist").$type<string[]>().default([]),
  plays: integer("plays").default(0),
  downloads: integer("downloads").default(0),
  likes: integer("likes").default(0),
  featured: boolean("featured").default(false),
  isFree: boolean("is_free").default(true),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mixComments = pgTable("mix_comments", {
  id: serial("id").primaryKey(),
  mixId: integer("mix_id").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  message: text("message").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---- EVENTS ----
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  venue: varchar("venue", { length: 255 }).notNull(),
  city: varchar("city", { length: 120 }).default("Nairobi"),
  address: text("address"),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date"),
  price: integer("price").default(0),
  vipPrice: integer("vip_price").default(0),
  currency: varchar("currency", { length: 10 }).default("KES"),
  capacity: integer("capacity").default(200),
  ticketsSold: integer("tickets_sold").default(0),
  imageUrl: text("image_url"),
  galleryUrls: jsonb("gallery_urls").$type<string[]>().default([]),
  description: text("description"),
  lineup: jsonb("lineup").$type<string[]>().default([]),
  status: varchar("status", { length: 30 }).default("upcoming"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  ticketCode: varchar("ticket_code", { length: 30 }).notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 200 }),
  phone: varchar("phone", { length: 30 }).notNull(),
  tier: varchar("tier", { length: 30 }).default("regular"),
  quantity: integer("quantity").default(1),
  totalAmount: integer("total_amount").default(0),
  mpesaCode: varchar("mpesa_code", { length: 30 }),
  status: varchar("status", { length: 30 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---- SHOP ----
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: integer("price").notNull(),
  comparePrice: integer("compare_price").default(0),
  currency: varchar("currency", { length: 10 }).default("KES"),
  category: varchar("category", { length: 80 }).default("apparel"),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  colors: jsonb("colors").$type<string[]>().default([]),
  imageUrls: jsonb("image_urls").$type<string[]>().default([]),
  stock: integer("stock").default(50),
  sold: integer("sold").default(0),
  rating: real("rating").default(5),
  reviews: integer("reviews").default(0),
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderCode: varchar("order_code", { length: 30 }).notNull(),
  customerName: varchar("customer_name", { length: 150 }).notNull(),
  email: varchar("email", { length: 200 }),
  phone: varchar("phone", { length: 30 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 120 }),
  items: jsonb("items")
    .$type<
      { productId: number; name: string; size?: string; qty: number; price: number }[]
    >()
    .default([]),
  subtotal: integer("subtotal").default(0),
  deliveryFee: integer("delivery_fee").default(0),
  total: integer("total").default(0),
  paymentMethod: varchar("payment_method", { length: 30 }).default("mpesa"),
  mpesaCode: varchar("mpesa_code", { length: 30 }),
  status: varchar("status", { length: 30 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---- BOOKINGS ----
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  refCode: varchar("ref_code", { length: 30 }).notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 200 }),
  phone: varchar("phone", { length: 30 }).notNull(),
  eventType: varchar("event_type", { length: 120 }).notNull(),
  eventDate: timestamp("event_date"),
  venue: varchar("venue", { length: 255 }),
  city: varchar("city", { length: 120 }),
  guests: integer("guests").default(100),
  hours: integer("hours").default(4),
  budget: varchar("budget", { length: 60 }),
  package: varchar("package", { length: 80 }),
  message: text("message"),
  status: varchar("status", { length: 30 }).default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---- COMMUNITY ----
export const fanMessages = pgTable("fan_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  location: varchar("location", { length: 120 }),
  message: text("message").notNull(),
  avatarColor: varchar("avatar_color", { length: 20 }).default("#FFC400"),
  likes: integer("likes").default(0),
  approved: boolean("approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const songRequests = pgTable("song_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  song: varchar("song", { length: 200 }).notNull(),
  artist: varchar("artist", { length: 200 }),
  dedication: text("dedication"),
  likes: integer("likes").default(0),
  status: varchar("status", { length: 30 }).default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().default([]),
  votes: jsonb("votes").$type<number[]>().default([]),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  name: varchar("name", { length: 150 }),
  source: varchar("source", { length: 60 }).default("website"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  memberCode: varchar("member_code", { length: 30 }).notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 200 }),
  tier: varchar("tier", { length: 40 }).default("gold"),
  amount: integer("amount").default(300),
  mpesaCode: varchar("mpesa_code", { length: 30 }),
  status: varchar("status", { length: 30 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }),
  amount: integer("amount").notNull(),
  message: text("message"),
  mpesaCode: varchar("mpesa_code", { length: 30 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---- CONTENT ----
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  imageUrl: text("image_url"),
  category: varchar("category", { length: 80 }).default("Journey"),
  readMinutes: integer("read_minutes").default(4),
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }),
  imageUrl: text("image_url").notNull(),
  category: varchar("category", { length: 60 }).default("events"),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Mix = typeof mixes.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Story = typeof stories.$inferSelect;
