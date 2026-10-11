import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PlayerProvider } from "@/components/player";
import { CartProvider } from "@/components/shop";
import { Navbar, Footer, FloatingButtons } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Deej Sandezz — Nairobi's Golden Turntable | Mixes, Events, Merch & Bookings",
  description:
    "Official home of Deej Sandezz: free mixes & downloads, event tickets, merch, bookings, fan zone and stories. Afrobeats • Amapiano • Gengetone • Dancehall. Nairobi, Kenya.",
  keywords: ["Deej Sandezz", "DJ Kenya", "Nairobi DJ", "Afrobeats mix", "Amapiano mix", "Gengetone", "DJ bookings Kenya", "event tickets Nairobi", "DJ merch"],
  openGraph: {
    title: "Deej Sandezz — Golden Turntable",
    description: "Free mixes, event tickets, merch & bookings. Nairobi's golden turntable.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>

        <meta name="theme-color" content="#FFC400" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#060606] text-[#f5f2e8] antialiased">
        <CartProvider>
          <PlayerProvider>
            <Navbar />
            <div className="pt-[104px] md:pt-[132px]">{children}</div>
            <FloatingButtons />
            <Footer />
          </PlayerProvider>
        </CartProvider>
      </body>
    </html>
  );
}
