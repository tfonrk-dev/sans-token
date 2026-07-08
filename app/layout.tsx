import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SANS — Feed the Wolf. Earn $SANS on TON.",
  description:
    "A Telegram tap-to-earn game on TON. Feed the wolf, earn $SANS, watch ads for 2× boosts, climb 10 tiers, and connect your TON wallet. Play free in Telegram.",
  metadataBase: new URL("https://sanslicekilis.com"),
  openGraph: {
    title: "SANS — Feed the Wolf. Earn $SANS on TON.",
    description:
      "Telegram tap-to-earn on TON. Feed the wolf, earn $SANS, watch ads for 2× boosts, climb 10 tiers.",
    url: "https://sanslicekilis.com",
    siteName: "SANS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SANS — Feed the Wolf. Earn $SANS on TON.",
    description: "Telegram tap-to-earn on TON. Play free, earn $SANS.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body bg-ink-950 antialiased">{children}</body>
    </html>
  );
}
