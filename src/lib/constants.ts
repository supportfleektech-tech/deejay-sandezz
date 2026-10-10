export const DJ = {
  name: "Deej Sandezz",
  tagline: "Nairobi's Golden Turntable — Afrobeats • Amapiano • Gengetone • Dancehall",
  phoneDisplay: "+254 700 474855",
  phoneIntl: "254700474855",
  phoneHref: "tel:+254700474855",
  email: "sundayomondi@gmail.com",
  location: "Nairobi, Kenya",
  mpesaTill: "0700 474 855",
  mpesaName: "Sunday Omondi (Deej Sandezz)",
};

export const SOCIALS = [
  { label: "YouTube", href: "https://www.youtube.com/@deesandezz", icon: "youtube", handle: "@deesandezz", color: "#FF0000" },
  { label: "TikTok", href: "https://www.tiktok.com/@deej.sandezz", icon: "tiktok", handle: "@deej.sandezz", color: "#00F2EA" },
  { label: "Instagram", href: "https://www.instagram.com/deej_sandezz", icon: "instagram", handle: "@deej_sandezz", color: "#E1306C" },
  { label: "X (Twitter)", href: "https://x.com/deejsandezz", icon: "x", handle: "@deejsandezz", color: "#ffffff" },
  { label: "Facebook", href: "https://www.facebook.com/deejsandezz", icon: "facebook", handle: "Deej Sandezz", color: "#1877F2" },
  { label: "Mixcloud", href: "https://www.mixcloud.com/deejsandezz/", icon: "mixcloud", handle: "deejsandezz", color: "#52aad8" },
  { label: "SoundCloud", href: "https://soundcloud.com/deejsandezz", icon: "soundcloud", handle: "deejsandezz", color: "#FF5500" },
  { label: "Audiomack", href: "https://audiomack.com/deejsandezz", icon: "audiomack", handle: "deejsandezz", color: "#FFA200" },
  { label: "Spotify", href: "https://open.spotify.com/search/deej%20sandezz", icon: "spotify", handle: "Deej Sandezz", color: "#1DB954" },
  { label: "Apple Music", href: "https://music.apple.com/ke/search?term=deej%20sandezz", icon: "apple", handle: "Deej Sandezz", color: "#FA243C" },
  { label: "WhatsApp", href: "https://wa.me/254700474855?text=Hi%20Deej%20Sandezz!%20I%20found%20you%20on%20your%20website%20%E2%9A%A1", icon: "whatsapp", handle: "+254 700 474855", color: "#25D366" },
  { label: "Linktree", href: "/links", icon: "linktree", handle: "All links in one place", color: "#43E660" },
];

export const GENRES = ["All", "Afrobeats", "Amapiano", "Gengetone", "Dancehall", "Bongo", "Hip-Hop", "Gospel Vibes", "Throwback", "House"];

export const BOOKING_PACKAGES = [
  {
    name: "Club Set",
    price: "From KES 15,000",
    duration: "2 hrs",
    features: ["High-energy club mix", "MC hype + shout-outs", "Own laptop + controller", "Promo post on socials"],
    tag: "Most booked",
  },
  {
    name: "Private Party",
    price: "From KES 25,000",
    duration: "4 hrs",
    features: ["Weddings, birthdays, ruracios", "All-genre open format", "Requests on the night", "Sound check + setup"],
    tag: "Best value",
  },
  {
    name: "Corporate & Festival",
    price: "From KES 50,000",
    duration: "Full day",
    features: ["Stage-ready festival set", "Brand mentions + MC", "Early setup + soundcheck", "Aftermovie + recap mix"],
    tag: "Premium",
  },
];

export const NAV_LINKS = [
  { label: "Mixes", href: "/mixes" },
  { label: "Events", href: "/events" },
  { label: "Shop", href: "/shop" },
  { label: "Fan Zone", href: "/fan-zone" },
  { label: "Stories", href: "/stories" },
  { label: "About", href: "/about" },
  { label: "Links", href: "/links" },
];

export function whatsappLink(message: string) {
  return `https://wa.me/${DJ.phoneIntl}?text=${encodeURIComponent(message)}`;
}
