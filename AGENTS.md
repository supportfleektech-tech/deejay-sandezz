# AGENTS.md

## Build & Install

- **npm install crashes** with SIGSEGV/Bus error without memory limit. Always use: `NODE_OPTIONS="--max-old-space-size=384" npm install`
- **Build** also needs the memory limit: `NODE_OPTIONS="--max-old-space-size=384" npx next build`

## Known Issues

- **lucide-react 1.55.0** ships without bundled `.d.ts` files. Custom declarations live in `src/types/lucide-react.d.ts` — do not delete this file.
- **Next.js 16** does not support the `eslint` key in `next.config.ts`. Remove it if you see build warnings.

## Database

- `DATABASE_URL` env var is required for all `/api/*` routes. Without it, API calls return 500.
- Push schema: `npm run db:push`
- Seed data: visit `/api/seed` (GET or POST)
- Schema defined in `src/db/schema.ts` (Drizzle ORM)

## Architecture

- Pages are **static** (prerendered). API routes are **dynamic** (server-rendered).
- State: `CartProvider` and `PlayerProvider` wrap the app in `src/app/layout.tsx`.
- Custom SVG social icons in `src/components/icons.tsx` — not from lucide-react.

## Assets

- `public/images/` has SVG placeholders. Replace with real images when available.
- Logo: `public/images/logo.png`
