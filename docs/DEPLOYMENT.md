# Deployment Guide

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Vercel](https://vercel.com/) account
- PostgreSQL database (local or cloud)

---

## Vercel Deployment

### 1. Push to GitHub

The repo is connected to Vercel. Push to `main` to trigger a production deployment:

```bash
git push origin main
```

### 2. Environment Variables

In your Vercel project dashboard, add:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |

**Path:** Project Settings → Environment Variables

### 3. Build Settings

Vercel auto-detects Next.js. No custom settings needed.

- **Build Command:** `next build`
- **Output Directory:** Next.js default
- **Install Command:** `npm install`

### 4. Deploy

Every push to `main` triggers an automatic production deployment.

Manual deploy:
```bash
vercel --prod
```

---

## Database Setup

### Option A: Local PostgreSQL

```bash
# Start local database (Docker)
docker run -d \
  --name deejay-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=deejay \
  -p 5432:5432 \
  postgres:16

# Set connection string
echo "DATABASE_URL=postgres://postgres:postgres@localhost:5432/deejay" > .env.local

# Push schema
npm run db:push

# Seed data
curl http://localhost:3000/api/seed
```

### Option B: Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Get the connection string from Settings → Database
3. Set as `DATABASE_URL` in Vercel environment variables
4. Run `npm run db:push` locally with the same URL

### Option C: Neon

1. Create a project at [neon.tech](https://neon.tech)
2. Get the connection string
3. Set as `DATABASE_URL` in Vercel environment variables

---

## Database Migrations

```bash
# Push schema changes to database
npm run db:push

# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (visual editor)
npm run db:studio
```

---

## Seeding Data

Once the database is set up, seed initial data:

```bash
# Via curl
curl -X POST https://your-domain.com/api/seed

# Or visit in browser
https://your-domain.com/api/seed
```

This populates:
- 6 mixes
- 3 events
- 6 products
- 4 stories
- Fan messages
- Song requests
- Polls
- Gallery images

---

## Custom Domain

1. Go to Vercel Project Settings → Domains
2. Add your domain (e.g., `deejsandezz.com`)
3. Update DNS records as instructed
4. SSL is automatic

---

## Monitoring

- **Build Logs:** Vercel Dashboard → Deployments
- **Runtime Logs:** Vercel Dashboard → Logs
- **Database:** Use Drizzle Studio or your provider's dashboard
