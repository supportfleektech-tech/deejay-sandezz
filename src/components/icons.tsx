"use client";

type P = { size?: number; className?: string };

function base(size = 18) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
  };
}

export const YoutubeIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" /></svg>
);

export const InstagramIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

export const FacebookIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07Z" /></svg>
);

export const XIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" /></svg>
);

export const TiktokIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-5.96 6.83 6.82 6.82 0 0 0 10.86 5.5A6.82 6.82 0 0 0 15.7 19V8.08a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.88-.51Z" /></svg>
);

export const WhatsappIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.08 1.76-.72 2-1.42.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.34Zm-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.37l-.36-.22-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88Zm8.42-18.3A11.82 11.82 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.47-8.41Z" /></svg>
);

export const MixcloudIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3C7 3 3 7 3 12s4 9 9 9c1.5 0 2.9-.35 4.1-1M21 12a9 9 0 0 0-9-9" /><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" /></svg>
);

export const SoundcloudIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 13v3M5 10v6M8 8v8M11 6v10M14 9v5M17 7v7M20 10v4M22 11v2" /></svg>
);

export const SpotifyIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0Zm5.52 17.34a.75.75 0 0 1-1.03.25c-2.83-1.73-6.39-2.12-10.58-1.16a.75.75 0 0 1-.34-1.46c4.54-1.04 8.48-.59 11.7 1.34.35.21.47.68.25 1.03Zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.24-1.98-8.18-2.55-12.01-1.4a.94.94 0 1 1-.54-1.8c4.35-1.32 9.73-.68 13.53 1.6.44.27.58.85.31 1.29Zm.13-3.41C15.24 8.4 8.82 8.27 5.1 9.4a1.13 1.13 0 1 1-.65-2.16c4.24-1.29 11.28-1.13 15.74 1.35a1.13 1.13 0 0 1-1.07 1.99Z" /></svg>
);

export const LinktreeIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
);

export function SocialIcon({ icon, size = 18, className }: { icon: string; size?: number; className?: string }) {
  switch (icon) {
    case "youtube": return <YoutubeIcon size={size} className={className} />;
    case "instagram": return <InstagramIcon size={size} className={className} />;
    case "facebook": return <FacebookIcon size={size} className={className} />;
    case "x": return <XIcon size={size} className={className} />;
    case "tiktok": return <TiktokIcon size={size} className={className} />;
    case "whatsapp": return <WhatsappIcon size={size} className={className} />;
    case "mixcloud": return <MixcloudIcon size={size} className={className} />;
    case "soundcloud": return <SoundcloudIcon size={size} className={className} />;
    case "spotify": return <SpotifyIcon size={size} className={className} />;
    default: return <LinktreeIcon size={size} className={className} />;
  }
}
