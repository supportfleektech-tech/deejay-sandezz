# Component Reference

## Site Chrome (`src/components/site-chrome.tsx`)

### `Logo`
Site logo with brand mark and text.

```tsx
<Logo size={44} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | number | 44 | Logo diameter in pixels |

### `Navbar`
Fixed navigation bar with top info strip, logo, links, cart, and mobile drawer.

```tsx
<Navbar />
```

No props. Uses `usePathname` for active states.

### `Footer`
Site footer with links, social icons, and contact info.

```tsx
<Footer />
```

No props.

### `FloatingButtons`
Fixed WhatsApp and Book buttons in bottom-right corner.

```tsx
<FloatingButtons />
```

No props.

---

## Player (`src/components/player.tsx`)

### `usePlayer()`
Hook that provides audio playback state.

```tsx
const { queue, current, isPlaying, progress, duration, playTrack, togglePlay, next, prev, seek } = usePlayer();
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| queue | Track[] | Current playback queue |
| current | Track \| null | Currently playing track |
| isPlaying | boolean | Playback state |
| progress | number | Current position in seconds |
| duration | number | Track duration in seconds |
| playTrack | (track, queue?) => void | Start playing a track |
| togglePlay | () => void | Toggle play/pause |
| next | () => void | Skip to next track |
| prev | () => void | Go to previous track |
| seek | (time) => void | Seek to position |

**Track type:**
```tsx
type Track = {
  id: number;
  title: string;
  genre?: string;
  coverUrl?: string;
  audioUrl?: string;
};
```

---

## Shop (`src/components/shop.tsx`)

### `useCart()`
Hook that provides shopping cart state.

```tsx
const { items, add, remove, updateQty, clear, count, total, drawer, setDrawer } = useCart();
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| items | CartItem[] | Cart items |
| add | (product, size?) => void | Add item to cart |
| remove | (productId, size?) => void | Remove item |
| updateQty | (productId, size?, delta) => void | Adjust quantity |
| clear | () => void | Clear cart |
| count | number | Total item count |
| total | number | Cart total in KES |
| drawer | boolean | Cart drawer visibility |
| setDrawer | (open) => void | Toggle cart drawer |

### `ProductCard`
Product display card.

```tsx
<ProductCard p={product} />
```

| Prop | Type | Description |
|------|------|-------------|
| p | Product | Product data object |

---

## Cards (`src/components/cards.tsx`)

### `MixCard`
Mix display card with cover art and play button.

```tsx
<MixCard mix={mix} queue={mixesArray} />
```

| Prop | Type | Description |
|------|------|-------------|
| mix | MixDTO | Mix data |
| queue | MixDTO[] | Full queue for playback |

### `EventCard`
Event display card with date, venue, and price.

```tsx
<EventCard ev={event} />
```

| Prop | Type | Description |
|------|------|-------------|
| ev | EventDTO | Event data |

### `FanCard`
Fan message display card.

```tsx
<FanCard fan={fan} />
```

| Prop | Type | Description |
|------|------|-------------|
| fan | Fan | Fan message data |

---

## Forms (`src/components/forms.tsx`)

### `NewsletterForm`
Email subscription form.

```tsx
<NewsletterForm source="homepage" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| source | string | "website" | Submission source label |

### `TipJar`
M-PESA tip/donation form.

```tsx
<TipJar />
```

### `PollWidget`
Interactive poll voting widget.

```tsx
<PollWidget poll={poll} />
```

### `SpinWheel`
Prize spin wheel game.

```tsx
<SpinWheel />
```

---

## Visuals (`src/components/visuals.tsx`)

### `GlowBackground`
Gradient glow background wrapper.

```tsx
<GlowBackground className="relative">...</GlowBackground>
```

### `Marquee`
Scrolling text marquee.

```tsx
<Marquee items={["Item 1", "Item 2"]} />
```

### `SectionHeading`
Section header with kicker, title, and subtitle.

```tsx
<SectionHeading kicker="Label" title="Title" sub="Description" href="/link" linkLabel="View All" />
```

### `Countdown`
Event countdown timer.

```tsx
<Countdown target={eventDate} />
```

### `VinylBadge`
Animated vinyl record badge.

```tsx
<VinylBadge size={240} />
```

---

## Icons (`src/components/icons.tsx`)

### Social Icons

| Component | Description |
|-----------|-------------|
| `YoutubeIcon` | YouTube logo |
| `InstagramIcon` | Instagram logo |
| `FacebookIcon` | Facebook logo |
| `XIcon` | X (Twitter) logo |
| `TiktokIcon` | TikTok logo |
| `WhatsappIcon` | WhatsApp logo |
| `MixcloudIcon` | Mixcloud logo |
| `SoundcloudIcon` | SoundCloud logo |
| `SpotifyIcon` | Spotify logo |
| `LinktreeIcon` | Linktree logo |

All accept `{ size?: number; className?: string }`.

### `SocialIcon`
Icon router component.

```tsx
<SocialIcon icon="youtube" size={20} />
```

---

## DTO Types

```tsx
type MixDTO = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  genre: string;
  coverUrl?: string;
  audioUrl?: string;
  youtubeUrl?: string;
  duration?: string;
  plays: number;
  downloads: number;
  likes: number;
  featured: boolean;
  isFree: boolean;
  publishedAt?: string;
  createdAt?: string;
};

type EventDTO = {
  id: number;
  title: string;
  slug: string;
  venue: string;
  city?: string;
  date: string;
  price: number;
  vipPrice: number;
  currency: string;
  capacity: number;
  ticketsSold: number;
  imageUrl?: string;
  description?: string;
  status: string;
  featured: boolean;
};

type ProductDTO = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice: number;
  currency: string;
  category: string;
  sizes: string[];
  colors: string[];
  imageUrls: string[];
  stock: number;
  sold: number;
  rating: number;
  reviews: number;
  featured: boolean;
  active: boolean;
};
```
