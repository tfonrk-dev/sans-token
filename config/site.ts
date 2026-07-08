// Central place for all outward links + shared copy, so the site is easy to retune.
export const SITE = {
  brand: "SANS",
  domain: "sanslicekilis.com",

  // The live product: a Telegram tap-to-earn mini app.
  botUrl: "https://t.me/sanslicekilisbot",
  gameUrl: "https://sans-tap-earn.vercel.app",

  // Community / socials
  telegram: "https://t.me/sanslicekilisduyuru",
  twitter: "https://twitter.com/sanslioffical",
  instagram: "https://instagram.com/sanslicekilisofficial",
  whitepaper: "/sans-token-whitepaper.pdf",

  // Token
  chain: "TON",
  totalSupply: "1B",
  symbol: "SANS",

  // Presale terms (no fabricated "raised" numbers — join routes to Telegram)
  presale: {
    price: "$0.012",
    listing: "$0.024",
    minBuy: "10 USDT",
    bonus: "+50%",
  },
} as const;
