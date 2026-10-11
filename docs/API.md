# API Reference

Base URL: `/api`

All endpoints return JSON. Errors follow the format: `{ "error": "string" }`.

---

## Health

### GET /api/health

Checks database connectivity.

**Response 200:**
```json
{ "ok": true }
```

**Response 500:**
```json
{ "ok": false }
```

---

## Mixes

### GET /api/mixes

Fetches mixes with optional filtering.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `genre` | string | - | Filter by genre (e.g., "Afrobeats") |
| `q` | string | - | Search title/description |
| `slug` | string | - | Get single mix by slug |
| `featured` | string | "true" | Filter featured only |
| `limit` | number | 50 | Max results (capped at 100) |

**Response 200:**
```json
{
  "mixes": [
    {
      "id": 1,
      "title": "Nairobi Nights Vol. 12",
      "slug": "nairobi-nights-vol-12",
      "description": "2 hours of non-stop Afrobeats...",
      "genre": "Afrobeats",
      "coverUrl": "/images/mix-afrobeats.svg",
      "audioUrl": "/mixes/nairobi-nights-vol-12.mp3",
      "youtubeUrl": "https://youtube.com/watch?v=...",
      "duration": "60:00",
      "plays": 1250,
      "downloads": 340,
      "likes": 89,
      "featured": true,
      "isFree": true,
      "publishedAt": "2026-10-01T12:00:00.000Z",
      "createdAt": "2026-09-15T10:30:00.000Z"
    }
  ]
}
```

**Single mix (by slug):**
```json
{
  "mix": { "id": 1, "title": "..." },
  "comments": [
    { "id": 1, "mixId": 1, "name": "Fan", "message": "Fire!", "likes": 5, "createdAt": "..." }
  ]
}
```

### PATCH /api/mixes

Increments play/download/like counter.

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | Yes | Mix ID |
| `action` | string | Yes | "play", "download", or "like" |

**Response 200:** `{ "ok": true }`

### POST /api/mixes

Creates a new mix or adds a comment.

**Body (new mix):**
```json
{
  "title": "Mix Title",
  "slug": "mix-title",
  "description": "Description",
  "genre": "Afrobeats",
  "coverUrl": "/images/mix.svg",
  "audioUrl": "/mixes/mix.mp3",
  "youtubeUrl": "https://youtube.com/...",
  "duration": "60:00"
}
```

**Body (comment):**
```json
{
  "mixId": 1,
  "name": "Your Name",
  "message": "Great mix!"
}
```

**Response 201:** `{ "mix": { ... } }` or `{ "comment": { ... } }`

---

## Events

### GET /api/events

Fetches events, optionally by slug.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | Get single event by slug |

**Response 200:**
```json
{
  "events": [
    {
      "id": 1,
      "title": "Golden Turntable Live",
      "slug": "golden-turntable-live",
      "venue": "KICC",
      "city": "Nairobi",
      "date": "2026-12-15T19:00:00.000Z",
      "price": 1000,
      "vipPrice": 3000,
      "currency": "KES",
      "capacity": 500,
      "ticketsSold": 120,
      "imageUrl": "/images/hero-dj.svg",
      "status": "upcoming",
      "featured": true
    }
  ]
}
```

### POST /api/events

Creates a new event.

**Body:**
```json
{
  "title": "Event Name",
  "slug": "event-name",
  "venue": "Venue",
  "city": "Nairobi",
  "date": "2026-12-15T19:00:00Z",
  "price": 1000,
  "vipPrice": 3000,
  "capacity": 500,
  "imageUrl": "/images/event.jpg",
  "description": "Event description"
}
```

**Response 201:** `{ "event": { ... } }`

---

## Tickets

### GET /api/tickets

Fetches tickets.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `eventId` | number | Filter by event |

**Response 200:**
```json
{
  "tickets": [
    {
      "id": 1,
      "eventId": 1,
      "ticketCode": "SDZ-ABC123",
      "name": "John Doe",
      "phone": "0700123456",
      "tier": "regular",
      "quantity": 2,
      "totalAmount": 2000,
      "status": "paid"
    }
  ]
}
```

### POST /api/tickets

Purchases tickets for an event.

**Body:**
```json
{
  "eventId": 1,
  "name": "John Doe",
  "phone": "0700123456",
  "email": "john@example.com",
  "tier": "vip",
  "quantity": 2,
  "mpesaCode": "QAH7EXAMPLE"
}
```

**Response 201:** `{ "ticket": { ... } }`

**Notes:**
- Quantity is capped at 10
- If `mpesaCode` is provided, status is set to "paid"
- Event's `ticketsSold` is incremented automatically

---

## Products

### GET /api/products

Fetches products with optional filtering.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |
| `featured` | string | "true" for featured only |

**Response 200:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "DS Golden Tee",
      "slug": "ds-golden-tee",
      "description": "Heavyweight cotton tee",
      "price": 2500,
      "comparePrice": 3500,
      "category": "apparel",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["Black", "Gold"],
      "imageUrls": ["/images/merch-tee.svg"],
      "stock": 50,
      "sold": 12,
      "rating": 5,
      "reviews": 3,
      "featured": true,
      "active": true
    }
  ]
}
```

### POST /api/products

Creates a new product.

**Body:**
```json
{
  "name": "Product Name",
  "slug": "product-name",
  "description": "Description",
  "price": 2500,
  "category": "apparel",
  "sizes": ["M", "L"],
  "imageUrls": ["/images/product.svg"],
  "stock": 30
}
```

**Response 201:** `{ "product": { ... } }`

---

## Orders

### GET /api/orders

Fetches all orders (admin).

**Response 200:**
```json
{
  "orders": [
    {
      "id": 1,
      "orderCode": "ORD-ABC123",
      "customerName": "Jane Doe",
      "phone": "0700123456",
      "items": [{ "productId": 1, "name": "DS Tee", "qty": 1, "price": 2500 }],
      "subtotal": 2500,
      "deliveryFee": 250,
      "total": 2750,
      "paymentMethod": "mpesa",
      "status": "paid"
    }
  ]
}
```

### POST /api/orders

Places a new order.

**Body:**
```json
{
  "customerName": "Jane Doe",
  "phone": "0700123456",
  "email": "jane@example.com",
  "address": "123 Nairobi",
  "city": "Nairobi",
  "items": [
    { "productId": 1, "name": "DS Tee", "size": "L", "qty": 1, "price": 2500 }
  ],
  "mpesaCode": "QAH7EXAMPLE"
}
```

**Delivery Fee Logic:**
- Free delivery for orders >= 5000 KES
- Nairobi: 250 KES
- Outside Nairobi: 400 KES

**Response 201:** `{ "order": { ... } }`

---

## Bookings

### GET /api/bookings

Fetches all bookings (admin).

**Response 200:**
```json
{
  "bookings": [
    {
      "id": 1,
      "refCode": "BK-ABC123",
      "name": "Client Name",
      "phone": "0700123456",
      "eventType": "Wedding",
      "eventDate": "2026-12-20T19:00:00.000Z",
      "venue": "KICC",
      "city": "Nairobi",
      "guests": 200,
      "hours": 4,
      "budget": "50000",
      "package": "Premium",
      "status": "new"
    }
  ]
}
```

### POST /api/bookings

Submits a DJ booking request.

**Body:**
```json
{
  "name": "Client Name",
  "phone": "0700123456",
  "email": "client@example.com",
  "eventType": "Wedding",
  "eventDate": "2026-12-20T19:00:00Z",
  "venue": "KICC",
  "city": "Nairobi",
  "guests": 200,
  "hours": 4,
  "budget": "50000",
  "package": "Premium",
  "message": "Looking forward to working with you!"
}
```

**Required fields:** `name`, `phone`, `eventType`

**Response 201:** `{ "booking": { ... } }`

### PATCH /api/bookings

Updates booking status (admin).

**Body:**
```json
{ "id": 1, "status": "confirmed" }
```

**Valid statuses:** `new`, `contacted`, `quoted`, `confirmed`, `done`, `declined`

**Response 200:** `{ "booking": { ... } }`

---

## Fan Wall

### GET /api/fanwall

Fetches fan messages.

**Response 200:**
```json
{
  "messages": [
    {
      "id": 1,
      "name": "Sarah Fan",
      "location": "Nairobi",
      "message": "Your mixes are fire!",
      "avatarColor": "#FFC400",
      "likes": 12,
      "approved": true
    }
  ]
}
```

### POST /api/fanwall

Posts a fan message.

**Body:**
```json
{
  "name": "Your Name",
  "location": "Nairobi",
  "message": "Love your mixes!"
}
```

**Response 201:** `{ "message": { ... } }`

### PATCH /api/fanwall

Likes a message.

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | Yes | Message ID |

**Response 200:** `{ "ok": true }`

---

## Song Requests

### GET /api/requests

Fetches song requests ordered by likes.

**Response 200:**
```json
{
  "requests": [
    {
      "id": 1,
      "name": "Fan Name",
      "song": "Song Title",
      "artist": "Artist",
      "dedication": "For my team",
      "likes": 25,
      "status": "open"
    }
  ]
}
```

### POST /api/requests

Submits a song request.

**Body:**
```json
{
  "name": "Your Name",
  "song": "Song Title",
  "artist": "Artist",
  "dedication": "Optional message"
}
```

**Response 201:** `{ "request": { ... } }`

### PATCH /api/requests

Likes a request.

**Query Parameters:**

| Param | Type | Required |
|-------|------|----------|
| `id` | number | Yes |

**Response 200:** `{ "ok": true }`

---

## Polls

### GET /api/polls

Fetches active polls.

**Response 200:**
```json
{
  "polls": [
    {
      "id": 1,
      "question": "Which genre should I mix next?",
      "options": ["Afrobeats", "Amapiano", "Gengetone"],
      "votes": [45, 78, 32],
      "active": true
    }
  ]
}
```

### POST /api/polls

Creates a new poll.

**Body:**
```json
{
  "question": "Your question?",
  "options": ["Option A", "Option B", "Option C"]
}
```

**Response 201:** `{ "poll": { ... } }`

### PATCH /api/polls

Votes on a poll.

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | Yes | Poll ID |
| `option` | number | Yes | Option index (0-based) |

**Response 200:** `{ "votes": [46, 78, 32] }`

---

## Newsletter

### GET /api/newsletter

Fetches subscribers (admin).

**Response 200:**
```json
{
  "subscribers": [
    { "id": 1, "email": "fan@example.com", "name": "Fan", "source": "website" }
  ],
  "count": 500
}
```

### POST /api/newsletter

Subscribes to the newsletter.

**Body:**
```json
{
  "email": "fan@example.com",
  "name": "Fan Name",
  "source": "homepage"
}
```

**Response 200 (new):** `{ "subscriber": { ... } }`
**Response 200 (duplicate):** `{ "ok": true, "duplicate": true }`

---

## Memberships

### GET /api/memberships

Fetches memberships with totals (admin).

**Response 200:**
```json
{
  "members": [
    {
      "id": 1,
      "memberCode": "GO-AB123",
      "name": "Member Name",
      "phone": "0700123456",
      "tier": "gold",
      "amount": 300,
      "status": "active"
      "createdAt": "2026-10-01T12:00:00.000Z"
    }
  ],
  "total": 5000,
  "count": 17
}
```

### POST /api/memberships

Joins the VIP membership.

**Tiers:**

| Tier | Amount (KES) |
|------|-------------|
| Gold | 300 |
| Diamond | 800 |
| Platinum | 2000 |

**Body:**
```json
{
  "name": "Your Name",
  "phone": "0700123456",
  "email": "you@example.com",
  "tier": "diamond",
  "mpesaCode": "QAH7EXAMPLE"
}
```

**Response 201:** `{ "member": { ... } }`

---

## Tips

### GET /api/tips

Fetches tips with totals.

**Response 200:**
```json
{
  "tips": [
    { "id": 1, "name": "Fan", "amount": 200, "message": "Keep it up!", "createdAt": "..." }
  ],
  "total": 5000,
  "count": 10
}
```

### POST /api/tips

Sends a tip/donation.

**Body:**
```json
{
  "name": "Your Name",
  "amount": 500,
  "message": "For the next mix",
  "mpesaCode": "QAH7EXAMPLE"
}
```

**Response 201:** `{ "tip": { ... } }`

---

## Stories

### GET /api/stories

Fetches stories with optional slug filter.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | Get single story by slug |

**Response 200:**
```json
{
  "stories": [
    {
      "id": 1,
      "title": "My Journey",
      "slug": "my-journey",
      "excerpt": "How I started...",
      "content": "Full story content...",
      "imageUrl": "/images/about-dj.svg",
      "category": "Journey",
      "readMinutes": 4,
      "featured": true,
      "publishedAt": "2026-09-01T12:00:00.000Z"
    }
  ]
}
```

### POST /api/stories

Creates a new story.

**Body:**
```json
{
  "title": "Story Title",
  "slug": "story-title",
  "excerpt": "Short summary",
  "content": "Full content...",
  "imageUrl": "/images/story.svg",
  "category": "Journey"
}
```

**Response 201:** `{ "story": { ... } }`

---

## Gallery

### GET /api/gallery

Fetches gallery images.

**Response 200:**
```json
{
  "gallery": [
    {
      "id": 1,
      "title": "In the studio",
      "imageUrl": "/images/about-dj.svg",
      "category": "studio",
      "likes": 15
    }
  ]
}
```

---

## Stats

### GET /api/stats

Fetches aggregate statistics for the homepage.

**Response 200:**
```json
{
  "mixes": { "plays": 60000, "downloads": 15000, "likes": 5000, "count": 25 },
  "tickets": { "sold": 500, "revenue": 750000 },
  "orders": { "revenue": 1250000, "count": 89 },
  "tips": { "total": 50000, "count": 45 },
  "fans": 2000,
  "subscribers": 5000,
  "bookings": 150,
  "events": 12
}
```

---

## Seed

### GET/POST /api/seed

Seeds the database with initial data. Skips if data already exists.

**Response 200:** `{ "ok": true, "message": "Seeded successfully" }`
**Response 200 (already seeded):** `{ "ok": true, "skipped": true, "message": "Already seeded" }`
