"use client";
import Script from "next/script";

// Monetag website ads (Multitag / banner tag).
//
// Loads the Monetag tag ONLY when a zone is configured, so the marketing site never
// breaks if ads aren't set up yet. Both values come from your Monetag dashboard after
// you add sanslicekilis.com as a "Site" and create a zone (Multitag recommended):
//
//   NEXT_PUBLIC_MONETAG_SITE_ZONE  -> the numeric Zone ID (e.g. 1234567)
//   NEXT_PUBLIC_MONETAG_SITE_SRC   -> the script domain from the snippet
//                                     (e.g. //fpyf8.com/tag.min.js)
//
// See SETUP-ADS.md for a step-by-step guide.
const ZONE = process.env.NEXT_PUBLIC_MONETAG_SITE_ZONE;
const RAW_SRC = process.env.NEXT_PUBLIC_MONETAG_SITE_SRC;

export default function MonetagAds() {
  if (!ZONE || !RAW_SRC) return null;
  // Accept "fpyf8.com/tag.min.js", "//fpyf8.com/tag.min.js" or a full https URL.
  const src = RAW_SRC.startsWith("http") || RAW_SRC.startsWith("//") ? RAW_SRC : `//${RAW_SRC}`;
  return (
    <Script
      id="monetag-tag"
      src={src}
      data-zone={ZONE}
      data-cfasync="false"
      strategy="afterInteractive"
    />
  );
}
