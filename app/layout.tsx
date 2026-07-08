import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
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
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
