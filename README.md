# Deej Sandezz — Official Website

The official website of **Deej Sandezz**, Nairobi's Golden Turntable. Mixes, events, merch, bookings, fan zone, and stories.

**Live:** https://deejay-sandez-main-4.vercel.app

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL via Drizzle ORM
- **Deployment:** Vercel
- **Language:** TypeScript

## Features

- Music player with queue management
- Event listings with ticket purchasing
- Merch shop with cart and checkout
- Fan wall, song requests, polls
- Blog/stories section
- VIP memberships
- Newsletter signup
- Admin dashboard
- M-PESA payment integration (manual codes)

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL database (local or cloud)

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL

# Run database migrations
npx drizzle-kit push

# Seed the database (optional)
npm run dev
# Visit http://localhost:3000/api/seed

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   ├── admin/        # Admin dashboard
│   ├── about/        # About page
│   ├── book/         # Booking page
│   ├── checkout/     # Checkout page
│   ├── contact/      # Contact page
│   ├── events/       # Events listing & detail
│   ├── fan-zone/     # Fan community
│   ├── gallery/      # Photo gallery
│   ├── links/        # Social links page
│   ├── mixes/        # Mixes listing & detail
│   ├── shop/         # Merch shop
│   ├── stories/      # Blog/stories
│   ├── support/      # Tips/donations
│   └── vip/          # VIP membership
├── components/       # React components
├── db/               # Database schema & connection
├── lib/              # Utilities & constants
└── types/            # TypeScript declarations
```

## Database

Uses Drizzle ORM with PostgreSQL. Schema includes:

- Mixes, Events, Products, Orders
- Tickets, Bookings, Memberships
- Fan messages, Song requests, Polls
- Newsletter subscribers, Tips
- Stories, Gallery

## Deployment

Deployed on Vercel. Push to `main` to trigger production deployment.

## Documentation

- [API Reference](docs/API.md) — All endpoints, parameters, and response schemas
- [Database Schema](docs/DATABASE.md) — Table definitions and relationships
- [Architecture](docs/ARCHITECTURE.md) — System design and rendering strategy
- [Components](docs/COMPONENTS.md) — React component reference
- [Deployment](docs/DEPLOYMENT.md) — Vercel deployment and database setup

## License

Private. All rights reserved.
