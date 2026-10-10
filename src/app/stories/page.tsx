"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { GlowBackground, Marquee, SectionHeading } from "@/components/visuals";
import { timeAgo } from "@/lib/utils";

type Story = { id: number; title: string; slug: string; excerpt?: string | null; imageUrl?: string | null; category?: string | null; readMinutes?: number | null; publishedAt?: string | null; featured?: boolean | null };

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  useEffect(() => {
    fetch("/api/stories").then((r) => r.json()).then((j) => setStories(j.stories ?? [])).catch(() => {});
  }, []);
  const featured = stories.find((s) => s.featured);
  const rest = stories.filter((s) => s !== featured);

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-500">Blog & stories</p>
          <h1 className="font-display mt-2 text-4xl text-white sm:text-6xl">STORIES FROM <span className="gold-gradient-text">THE DECKS</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">My journey, DJ tips, event recaps and zero-budget lessons. Real talk, no gatekeeping.</p>
        </div>
      </GlowBackground>
      <Marquee items={["New story every Tuesday", "DJ tips & tricks", "Event recaps", "Zero-budget lessons"]} />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {featured && (
          <Link href={`/stories/${featured.slug}`} className="glass card-hover group grid overflow-hidden rounded-[2rem] lg:grid-cols-2">
            <div className="relative min-h-[260px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.imageUrl || "/images/about-dj.jpg"} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute left-4 top-4 rounded-full bg-gold-500 px-3.5 py-1.5 text-xs font-black text-black">FEATURED</span>
            </div>
            <div className="p-6 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gold-500">{featured.category} • {timeAgo(featured.publishedAt)}</p>
              <h2 className="font-display mt-2 text-2xl leading-tight text-white sm:text-4xl">{featured.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base line-clamp-3">{featured.excerpt}</p>
              <p className="mt-4 flex items-center gap-2 text-sm font-bold text-gold-300">Read story <ArrowUpRight size={16} /></p>
            </div>
          </Link>
        )}
        <div className="mt-10">
          <SectionHeading kicker="All stories" title="KEEP READING" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((s) => (
              <Link key={s.id} href={`/stories/${s.slug}`} className="glass card-hover group overflow-hidden rounded-3xl">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.imageUrl || "/images/about-dj.jpg"} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-gold-300 backdrop-blur">{s.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold leading-snug text-white line-clamp-2">{s.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-2">{s.excerpt}</p>
                  <p className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                    <span>{timeAgo(s.publishedAt)}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {s.readMinutes ?? 4} min read</span>
                  </p>
                </div>
              </Link>
            ))}
            {stories.length === 0 && [0, 1, 2].map((i) => <div key={i} className="glass h-80 animate-pulse rounded-3xl" />)}
          </div>
        </div>
      </section>
    </main>
  );
}
