// Central place for all outward links + shared copy, so the site is easy to retune.
export const SITE = {
  brand: "SANS",
  domain: "sanslicekilis.com",

  // The live product: a Telegram tap-to-earn mini app.
  botUrl: "https://t.me/sanslicekilisbot",
  // Deep-links that open the Mini App DIRECTLY on the right screen (no bot-chat
  // stop, no scroll bounce): ?startapp=oyna → game, ?startapp=buy → wallet/presale.
  playUrl: "https://t.me/sanslicekilisbot?startapp=oyna",
  buyUrl: "https://t.me/sanslicekilisbot?startapp=buy",
  gameUrl: "https://sans-tap-earn.vercel.app",

  // Community / socials
  telegram: "https://t.me/sanslicekilisduyuru",
  twitter: "https://twitter.com/sansliofficial",
  instagram: "https://instagram.com/sanslicekilisofficial",
  youtube: "https://www.youtube.com/@SansliCekilisOfficial",
  whitepaper: "/sans-token-whitepaper.pdf",

  // Token
  chain: "TON",
  totalSupply: "1B",
  symbol: "SANS",

  // Presale terms (no fabricated "raised" numbers — join routes to Telegram)
  presale: {
    price: "$0.0005",
    listing: "$0.001",
    minBuy: "5 USDT",
    bonus: "+50%",
  },
} as const;
