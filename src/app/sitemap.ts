import type { MetadataRoute } from "next";

const BASE = "https://deesandezz.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["/", "/mixes", "/events", "/shop", "/checkout", "/book", "/fan-zone", "/about", "/stories", "/gallery", "/support", "/contact", "/links", "/vip"];
  return [
    ...staticRoutes.map((r) => ({
      url: `${BASE}${r}`,
      lastModified: now,
      changeFrequency: (r === "/" ? "daily" : "weekly") as "daily" | "weekly",
      priority: r === "/" ? 1 : r.startsWith("/mixes") || r.startsWith("/events") ? 0.9 : 0.7,
    })),
  ];
}
