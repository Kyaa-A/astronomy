import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Celestial Atlas — Explore the universe up close",
  description:
    "Explore the Sun, planets, and Moon through immersive procedural 3D models, scientific data, interactive features, and guided astronomy lessons.",
  applicationName: "Celestial Atlas",
  authors: [{ name: "Asnari" }],
  creator: "Asnari",
  keywords: ["astronomy", "solar system", "3D planets", "space science", "interactive learning", "celestial objects"],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Celestial Atlas",
    title: "Celestial Atlas — Explore the universe up close",
    description: "An immersive digital observatory for exploring our Solar System.",
  },
  twitter: {
    card: "summary",
    title: "Celestial Atlas — Explore the universe up close",
    description: "An immersive digital observatory for exploring our Solar System.",
  },
};

export const viewport: Viewport = {
  themeColor: "#060817",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${serif.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
