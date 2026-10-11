# Database Schema

PostgreSQL via Drizzle ORM. All tables use `serial` primary keys and `timestamp` audit fields.

---

## Mixes

### `mixes`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| title | varchar(255) | NOT NULL | - |
| slug | varchar(255) | NOT NULL, UNIQUE | - |
| description | text | nullable | - |
| genre | varchar(100) | NOT NULL | "Afrobeats" |
| cover_url | text | nullable | - |
| audio_url | text | nullable | - |
| youtube_url | text | nullable | - |
| mixcloud_url | text | nullable | - |
| hearthis_url | text | nullable | - |
| duration | varchar(20) | nullable | "60:00" |
| duration_seconds | integer | nullable | 3600 |
| bpm | integer | nullable | 120 |
| tracklist | jsonb | nullable | [] |
| plays | integer | nullable | 0 |
| downloads | integer | nullable | 0 |
| likes | integer | nullable | 0 |
| featured | boolean | nullable | false |
| is_free | boolean | nullable | true |
| published_at | timestamp | nullable | now() |
| created_at | timestamp | nullable | now() |

### `mix_comments`

| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| mix_id | integer | NOT NULL |
| name | varchar(120) | NOT NULL |
| message | text | NOT NULL |
| likes | integer | default 0 |
| created_at | timestamp | default now() |

---

## Events

### `events`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| title | varchar(255) | NOT NULL | - |
| slug | varchar(255) | NOT NULL, UNIQUE | - |
| venue | varchar(255) | NOT NULL | - |
| city | varchar(120) | nullable | "Nairobi" |
| address | text | nullable | - |
| date | timestamp | NOT NULL | - |
| end_date | timestamp | nullable | - |
| price | integer | nullable | 0 |
| vip_price | integer | nullable | 0 |
| currency | varchar(10) | nullable | "KES" |
| capacity | integer | nullable | 200 |
| tickets_sold | integer | nullable | 0 |
| image_url | text | nullable | - |
| gallery_urls | jsonb | nullable | [] |
| description | text | nullable | - |
| lineup | jsonb | nullable | [] |
| status | varchar(30) | nullable | "upcoming" |
| featured | boolean | nullable | false |
| created_at | timestamp | nullable | now() |

### `tickets`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| event_id | integer | NOT NULL | - |
| ticket_code | varchar(30) | NOT NULL | - |
| name | varchar(150) | NOT NULL | - |
| email | varchar(200) | nullable | - |
| phone | varchar(30) | NOT NULL | - |
| tier | varchar(30) | nullable | "regular" |
| quantity | integer | nullable | 1 |
| total_amount | integer | nullable | 0 |
| mpesa_code | varchar(30) | nullable | - |
| status | varchar(30) | nullable | "pending" |
| created_at | timestamp | nullable | now() |

---

## Shop

### `products`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| name | varchar(255) | NOT NULL | - |
| slug | varchar(255) | NOT NULL, UNIQUE | - |
| description | text | nullable | - |
| price | integer | NOT NULL | - |
| compare_price | integer | nullable | 0 |
| currency | varchar(10) | nullable | "KES" |
| category | varchar(80) | nullable | "apparel" |
| sizes | jsonb | nullable | [] |
| colors | jsonb | nullable | [] |
| image_urls | jsonb | nullable | [] |
| stock | integer | nullable | 50 |
| sold | integer | nullable | 0 |
| rating | real | nullable | 5 |
| reviews | integer | nullable | 0 |
| featured | boolean | nullable | false |
| active | boolean | nullable | true |
| created_at | timestamp | nullable | now() |

### `orders`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| order_code | varchar(30) | NOT NULL | - |
| customer_name | varchar(150) | NOT NULL | - |
| email | varchar(200) | nullable | - |
| phone | varchar(30) | NOT NULL | - |
| address | text | nullable | - |
| city | varchar(120) | nullable | - |
| items | jsonb | nullable | [] |
| subtotal | integer | nullable | 0 |
| delivery_fee | integer | nullable | 0 |
| total | integer | nullable | 0 |
| payment_method | varchar(30) | nullable | "mpesa" |
| mpesa_code | varchar(30) | nullable | - |
| status | varchar(30) | nullable | "pending" |
| created_at | timestamp | nullable | now() |

**items JSON structure:**
```json
[{ "productId": 1, "name": "DS Tee", "size": "L", "qty": 1, "price": 2500 }]
```

---

## Bookings

### `bookings`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| ref_code | varchar(30) | NOT NULL | - |
| name | varchar(150) | NOT NULL | - |
| email | varchar(200) | nullable | - |
| phone | varchar(30) | NOT NULL | - |
| event_type | varchar(120) | NOT NULL | - |
| event_date | timestamp | nullable | - |
| venue | varchar(255) | nullable | - |
| city | varchar(120) | nullable | - |
| guests | integer | nullable | 100 |
| hours | integer | nullable | 4 |
| budget | varchar(60) | nullable | - |
| package | varchar(80) | nullable | - |
| message | text | nullable | - |
| status | varchar(30) | nullable | "new" |
| created_at | timestamp | nullable | now() |

**Status flow:** `new` → `contacted` → `quoted` → `confirmed` → `done` / `declined`

---

## Community

### `fan_messages`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| name | varchar(120) | NOT NULL | - |
| location | varchar(120) | nullable | - |
| message | text | NOT NULL | - |
| avatar_color | varchar(20) | nullable | "#FFC400" |
| likes | integer | nullable | 0 |
| approved | boolean | nullable | true |
| created_at | timestamp | nullable | now() |

### `song_requests`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| name | varchar(120) | NOT NULL | - |
| song | varchar(200) | NOT NULL | - |
| artist | varchar(200) | nullable | - |
| dedication | text | nullable | - |
| likes | integer | nullable | 0 |
| status | varchar(30) | nullable | "open" |
| created_at | timestamp | nullable | now() |

### `polls`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| question | text | NOT NULL | - |
| options | jsonb | nullable | [] |
| votes | jsonb | nullable | [] |
| active | boolean | nullable | true |
| created_at | timestamp | nullable | now() |

---

## Newsletter

### `newsletter_subscribers`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| email | varchar(200) | NOT NULL, UNIQUE | - |
| name | varchar(150) | nullable | - |
| source | varchar(60) | nullable | "website" |
| created_at | timestamp | nullable | now() |

---

## Memberships

### `memberships`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| member_code | varchar(30) | NOT NULL | - |
| name | varchar(150) | NOT NULL | - |
| phone | varchar(30) | NOT NULL | - |
| email | varchar(200) | nullable | - |
| tier | varchar(40) | nullable | "gold" |
| amount | integer | nullable | 300 |
| mpesa_code | varchar(30) | nullable | - |
| status | varchar(30) | nullable | "pending" |
| created_at | timestamp | nullable | now() |

---

## Tips

### `tips`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| name | varchar(120) | nullable | - |
| amount | integer | NOT NULL | - |
| message | text | nullable | - |
| mpesa_code | varchar(30) | nullable | - |
| created_at | timestamp | nullable | now() |

---

## Content

### `stories`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| title | varchar(255) | NOT NULL | - |
| slug | varchar(255) | NOT NULL, UNIQUE | - |
| excerpt | text | nullable | - |
| content | text | nullable | - |
| image_url | text | nullable | - |
| category | varchar(80) | nullable | "Journey" |
| read_minutes | integer | nullable | 4 |
| featured | boolean | nullable | false |
| published_at | timestamp | nullable | now() |
| created_at | timestamp | nullable | now() |

### `gallery`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | serial | PK | auto |
| title | varchar(200) | nullable | - |
| image_url | text | NOT NULL | - |
| category | varchar(60) | nullable | "events" |
| likes | integer | nullable | 0 |
| created_at | timestamp | nullable | now() |
