# Architecture

## Overview

This is a Next.js 16 application using the App Router pattern with a PostgreSQL database via Drizzle ORM. It follows a server-first architecture where pages are statically prerendered and data is fetched client-side from API routes.

---

## Request Flow

```
Browser → Next.js Server → API Route → Drizzle ORM → PostgreSQL
```

1. **Static pages** are prerendered at build time (marked `○ Static`)
2. **Client components** fetch data from API routes at runtime
3. **API routes** (`ƒ Dynamic`) handle CRUD operations
4. **Drizzle ORM** provides type-safe SQL queries
5. **PostgreSQL** stores all data

---

## Rendering Strategy

| Type | Routes | Description |
|------|--------|-------------|
| Static | `/`, `/about`, `/events`, `/mixes`, `/shop`, etc. | Prerendered at build time, data fetched client-side |
| Dynamic | `/api/*`, `/events/[slug]`, `/mixes/[slug]`, `/stories/[slug]` | Server-rendered on demand |

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Homepage (client component)
│   ├── loading.tsx         # Global loading state
│   ├── not-found.tsx       # 404 page
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── globals.css         # Tailwind + custom styles
│   ├── about/page.tsx      # About page
│   ├── admin/page.tsx      # Admin dashboard
│   ├── book/page.tsx       # Booking form
│   ├── checkout/page.tsx   # Checkout flow
│   ├── contact/page.tsx    # Contact form
│   ├── events/
│   │   ├── page.tsx        # Events listing
│   │   └── [slug]/page.tsx # Event detail
│   ├── fan-zone/page.tsx   # Fan community
│   ├── gallery/page.tsx    # Photo gallery
│   ├── links/page.tsx      # Social links
│   ├── mixes/
│   │   ├── page.tsx        # Mixes listing
│   │   └── [slug]/page.tsx # Mix detail + player
│   ├── shop/page.tsx       # Product catalog
│   ├── stories/
│   │   ├── page.tsx        # Stories listing
│   │   └── [slug]/page.tsx # Story detail
│   ├── support/page.tsx    # Tips/donations
│   ├── vip/page.tsx        # VIP membership
│   └── api/
│       ├── bookings/route.ts
│       ├── events/route.ts
│       ├── fanwall/route.ts
│       ├── gallery/route.ts
│       ├── health/route.ts
│       ├── memberships/route.ts
│       ├── mixes/route.ts
│       ├── newsletter/route.ts
│       ├── orders/route.ts
│       ├── polls/route.ts
│       ├── products/route.ts
│       ├── requests/route.ts
│       ├── seed/route.ts
│       ├── stats/route.ts
│       ├── stories/route.ts
│       ├── tickets/route.ts
│       └── tips/route.ts
├── components/
│   ├── site-chrome.tsx     # Navbar, Footer, FloatingButtons, Logo
│   ├── player.tsx          # Audio player with context
│   ├── shop.tsx            # Cart context + ProductCard
│   ├── cards.tsx           # MixCard, EventCard, FanCard
│   ├── forms.tsx           # NewsletterForm, TipJar, PollWidget, SpinWheel
│   ├── visuals.tsx         # GlowBackground, Marquee, Countdown, etc.
│   └── icons.tsx           # Custom SVG social icons
├── db/
│   ├── index.ts            # Database connection (singleton)
│   └── schema.ts           # Drizzle table definitions
├── lib/
│   ├── constants.ts        # DJ info, socials, nav links, packages
│   ├── utils.ts            # cn(), kes(), timeAgo(), slugify(), etc.
│   └── seed-data.ts        # Initial seed data
└── types/
    └── lucide-react.d.ts   # Type declarations for lucide-react
```

---

## State Management

### React Context Providers

1. **CartProvider** (`components/shop.tsx`)
   - Shopping cart state
   - Add/remove items
   - Cart drawer visibility

2. **PlayerProvider** (`components/player.tsx`)
   - Audio playback state
   - Track queue
   - Play/pause/seek controls

### Component Hierarchy

```
RootLayout
├── CartProvider
│   └── PlayerProvider
│       ├── Navbar
│       │   └── Logo
│       ├── {children} (page content)
│       ├── FloatingButtons
│       └── Footer
│           └── Logo
```

---

## Database Connection

Uses a singleton pattern to prevent connection exhaustion during hot reload:

```typescript
const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool = globalForDb.__arenaNextJsPostgresqlPool ?? new Pool({...});
```

---

## Security

- **SQL Injection:** Prevented by Drizzle ORM parameterized queries
- **XSS:** React's built-in escaping + Next.js sanitization
- **Secrets:** Environment variables only, `.env.example` for documentation
- **No auth on public endpoints:** Admin endpoints are unprotected (basic setup)

---

## Performance

- **Static prerendering** for all public pages
- **Client-side data fetching** for dynamic content
- **Image optimization** via Next.js Image component (where applicable)
- **Build caching** on Vercel
- **Database connection pooling** via singleton pattern
