import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import MonetagAds from "@/components/MonetagAds";

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
  title: "SANS — Kurdu Besle, TON'da $SANS Kazan",
  description:
    "Telegram'da ücretsiz tap-to-earn oyunu. Kurdu besle, $SANS kazan, reklam izleyip 30 dk 2× kazanç al, 10 seviye atla, TON cüzdanını bağla. Ön satış açık.",
  metadataBase: new URL("https://sanslicekilis.com"),
  openGraph: {
    title: "SANS — Kurdu Besle, TON'da $SANS Kazan",
    description:
      "Telegram'da ücretsiz tap-to-earn. Kurdu besle, $SANS kazan, reklam izle 2× kazanç al, 10 seviye atla.",
    url: "https://sanslicekilis.com",
    siteName: "SANS",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SANS — Kurdu Besle, TON'da $SANS Kazan",
    description: "Telegram'da ücretsiz oyna, TON'da $SANS kazan.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="font-body antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('sans-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();",
          }}
        />
        {children}
        <MonetagAds />
      </body>
    </html>
  );
}
