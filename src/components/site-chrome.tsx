"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu, X, Play, Ticket, ShoppingBag, CalendarCheck,
  Phone, Mail, MapPin, ChevronRight, Flame,
} from "lucide-react";
import { DJ, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCart } from "./shop";
import { YoutubeIcon, InstagramIcon, FacebookIcon, XIcon, TiktokIcon } from "./icons";

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt="Deej Sandezz"
        width={size}
        height={size}
        className="shrink-0 rounded-full border-[3px] border-gold-500 bg-black object-cover shadow-[0_0_25px_rgba(255,196,0,0.35)] transition group-hover:shadow-[0_0_35px_rgba(255,196,0,0.6)]"
      />
      <span className="leading-none">
        <span className="font-display block text-xl tracking-wide text-white sm:text-2xl">
          DEEJ <span className="gold-gradient-text">SANDEZZ</span>
        </span>
        <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-500/90">
          Golden Turntable
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { count, setDrawer } = useCart();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] border-b border-gold-500/20 bg-black/90 backdrop-blur-xl">
        <div className="hidden items-center justify-between gap-4 px-4 py-1.5 text-[11px] font-medium text-zinc-400 md:flex lg:px-8">
          <p className="flex items-center gap-4">
            <a href={DJ.phoneHref} className="flex items-center gap-1.5 hover:text-gold-300"><Phone size={12} className="text-gold-500" /> {DJ.phoneDisplay}</a>
            <a href={`mailto:${DJ.email}`} className="flex items-center gap-1.5 hover:text-gold-300"><Mail size={12} className="text-gold-500" /> {DJ.email}</a>
          </p>
          <p className="flex items-center gap-1.5 text-gold-300">
            <Flame size={12} /> Next up: Golden Turntable Live — grab early-bird tickets!
            <Link href="/events" className="ml-2 font-bold underline underline-offset-2 hover:text-gold-200">Get tickets</Link>
          </p>
        </div>
        <header className={cn("transition-all", scrolled ? "py-2" : "py-3")}>
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
            <Logo size={scrolled ? 40 : 46} />
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    pathname === l.href || pathname.startsWith(l.href + "/")
                      ? "bg-gold-500/15 text-gold-300"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/mixes" className="gold-btn hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black sm:flex">
                <Play size={15} fill="currentColor" /> LISTEN FREE
              </Link>
              <Link href="/book" className="hidden items-center gap-2 rounded-full border border-gold-500/50 px-5 py-2.5 text-sm font-bold text-gold-300 transition hover:bg-gold-500/10 md:flex">
                <CalendarCheck size={15} /> Book Me
              </Link>
              <button onClick={() => setDrawer(true)} className="relative rounded-full border border-white/10 p-2.5 text-zinc-200 transition hover:border-gold-500/50 hover:text-gold-300" aria-label="Cart">
                <ShoppingBag size={18} />
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[10px] font-black text-black">{count}</span>
                )}
              </button>
              <button onClick={() => setOpen(!open)} className="rounded-full border border-white/10 p-2.5 text-white lg:hidden" aria-label="Menu">
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {open && (
        <div className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}
      <div className={cn("fixed right-0 top-0 z-[58] flex h-dvh w-[85%] max-w-sm flex-col border-l border-gold-500/25 bg-[#0c0c0e] p-6 pt-24 transition-transform duration-300 lg:hidden", open ? "translate-x-0" : "translate-x-full")}>
        <nav className="flex flex-col gap-1">
          <Link href="/" className="rounded-xl px-4 py-3 text-lg font-bold hover:bg-white/5">Home</Link>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={cn("flex items-center justify-between rounded-xl px-4 py-3 text-lg font-bold hover:bg-white/5", pathname.startsWith(l.href) && "bg-gold-500/10 text-gold-300")}>
              {l.label} <ChevronRight size={18} className="text-zinc-600" />
            </Link>
          ))}
          <Link href="/book" className="flex items-center justify-between rounded-xl px-4 py-3 text-lg font-bold hover:bg-white/5">Book the DJ <ChevronRight size={18} className="text-zinc-600" /></Link>
          <Link href="/contact" className="flex items-center justify-between rounded-xl px-4 py-3 text-lg font-bold hover:bg-white/5">Contact <ChevronRight size={18} className="text-zinc-600" /></Link>
        </nav>
        <div className="mt-auto space-y-3">
          <Link href="/mixes" className="gold-btn flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-black"><Play size={16} fill="currentColor" /> LISTEN FREE</Link>
          <div className="flex items-center justify-center gap-3 text-zinc-400">
            <a href="https://www.youtube.com/@deesandezz" target="_blank" rel="noreferrer" aria-label="YouTube"><YoutubeIcon size={20} /></a>
            <a href="https://www.instagram.com/deej_sandezz" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon size={20} /></a>
            <a href="https://www.facebook.com/deejsandezz" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon size={20} /></a>
            <a href="https://x.com/deejsandezz" target="_blank" rel="noreferrer" aria-label="X"><XIcon size={20} /></a>
            <a href="https://www.tiktok.com/@deej.sandezz" target="_blank" rel="noreferrer" aria-label="TikTok"><TiktokIcon size={20} /></a>
          </div>
        </div>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-0 border-t border-gold-500/20 bg-[#08080a]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
              Nairobi&apos;s golden turntable. Mixes, events, merch and unforgettable nights — powered by the fans, for the fans.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { icon: YoutubeIcon, href: "https://www.youtube.com/@deesandezz", label: "YouTube" },
                { icon: InstagramIcon, href: "https://www.instagram.com/deej_sandezz", label: "Instagram" },
                { icon: FacebookIcon, href: "https://www.facebook.com/deejsandezz", label: "Facebook" },
                { icon: XIcon, href: "https://x.com/deejsandezz", label: "X" },
                { icon: TiktokIcon, href: "https://www.tiktok.com/@deej.sandezz", label: "TikTok" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-gold-500 hover:bg-gold-500 hover:text-black">
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="font-display text-lg tracking-wide text-gold-400">EXPLORE</p>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
              {[["Latest Mixes", "/mixes"], ["Upcoming Events", "/events"], ["Merch Shop", "/shop"], ["Fan Zone", "/fan-zone"], ["My Story", "/about"], ["All Links", "/links"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="transition hover:text-gold-300">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-lg tracking-wide text-gold-400">WORK WITH ME</p>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
              {[["Book the DJ", "/book"], ["Buy Tickets", "/events"], ["Order Merch", "/shop"], ["VIP Membership", "/vip"], ["Tip / Support", "/support"], ["Contact", "/contact"], ["Admin", "/admin"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="transition hover:text-gold-300">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-lg tracking-wide text-gold-400">TALK TO ME</p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li><a href={DJ.phoneHref} className="flex items-center gap-2 hover:text-gold-300"><Phone size={15} className="text-gold-500" /> {DJ.phoneDisplay}</a></li>
              <li><a href={`mailto:${DJ.email}`} className="flex items-center gap-2 break-all hover:text-gold-300"><Mail size={15} className="text-gold-500" /> {DJ.email}</a></li>
              <li className="flex items-center gap-2"><MapPin size={15} className="text-gold-500" /> {DJ.location}</li>
              <li><a href={`https://wa.me/${DJ.phoneIntl}`} target="_blank" rel="noreferrer" className="gold-btn mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black"><Ticket size={14} /> WHATSAPP ME</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Deej Sandezz. All rights reserved. Made with 🔊 in Nairobi.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" /> Zero-budget. 100% heart. Powered by fans.
          </p>
        </div>
      </div>
      <div className="h-24" />
    </footer>
  );
}

export function FloatingButtons() {
  return (
    <div className="fixed bottom-24 right-4 z-[70] flex flex-col gap-3 sm:bottom-28 sm:right-6">
      <a
        href={`https://wa.me/${DJ.phoneIntl}?text=${encodeURIComponent("Hi Deej Sandezz! ⚡")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="grid h-13 w-13 place-items-center rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_10px_30px_rgba(37,211,102,0.5)] transition hover:scale-110"
      >
        <Phone size={20} />
      </a>
      <Link
        href="/book"
        aria-label="Book"
        className="gold-btn grid place-items-center rounded-full p-3.5 animate-pulse-glow"
      >
        <CalendarCheck size={20} />
      </Link>
    </div>
  );
}
