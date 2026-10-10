"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { GlowBackground, ShareButtons } from "@/components/visuals";
import { NewsletterForm } from "@/components/forms";
import { timeAgo } from "@/lib/utils";

type Story = { id: number; title: string; slug: string; excerpt?: string | null; content?: string | null; imageUrl?: string | null; category?: string | null; readMinutes?: number | null; publishedAt?: string | null };

export default function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [story, setStory] = useState<Story | null>(null);
  const [more, setMore] = useState<Story[]>([]);

  useEffect(() => {
    fetch(`/api/stories?slug=${slug}`).then((r) => r.json()).then((j) => setStory(j.story ?? null)).catch(() => {});
    fetch("/api/stories").then((r) => r.json()).then((j) => setMore((j.stories ?? []).filter((s: Story) => s.slug !== slug).slice(0, 2))).catch(() => {});
  }, [slug]);

  if (!story)
    return (
      <main className="mx-auto max-w-4xl px-4 py-20"><div className="glass h-96 animate-pulse rounded-[2rem]" /></main>
    );

  return (
    <main className="min-h-screen">
      <GlowBackground>
        <div className="mx-auto max-w-4xl px-4 pb-12 pt-10">
          <Link href="/stories" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-gold-300"><ArrowLeft size={16} /> All stories</Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-gold-500">{story.category} • {timeAgo(story.publishedAt)} • <span className="inline-flex items-center gap-1"><Clock size={12} /> {story.readMinutes ?? 4} min</span></p>
          <h1 className="font-display mt-3 text-3xl leading-tight text-white sm:text-5xl">{story.title}</h1>
          <p className="mt-3 text-lg text-zinc-400">{story.excerpt}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.imageUrl || "/images/about-dj.jpg"} alt={story.title} className="mt-6 aspect-video w-full rounded-[2rem] border border-gold-500/20 object-cover" />
          <article className="prose-invert mt-8 space-y-5 text-[17px] leading-relaxed text-zinc-200">
            {(story.content ?? "").split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>
          <div className="mt-8 border-t border-white/10 pt-6">
            <ShareButtons title={story.title} path={`/stories/${story.slug}`} />
          </div>
          <div className="glass mt-8 rounded-3xl p-6">
            <p className="font-black text-white">Enjoyed this? Get the next story + free Friday mix 📩</p>
            <div className="mt-3"><NewsletterForm source="story" /></div>
          </div>
          {more.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {more.map((m) => (
                <Link key={m.id} href={`/stories/${m.slug}`} className="glass card-hover overflow-hidden rounded-3xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.imageUrl || "/images/about-dj.jpg"} alt={m.title} className="aspect-[16/8] w-full object-cover" />
                  <p className="p-4 font-bold text-white line-clamp-2">{m.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </GlowBackground>
    </main>
  );
}
