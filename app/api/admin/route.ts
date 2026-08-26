import { NextResponse } from "next/server";

// Proxy for the game's admin API so sanslicekilis.com/admin can show the live
// player/wallet/referral data on this (branded) domain without CORS. The panel
// (browser) sends the ADMIN_KEY as an x-admin-key header to THIS route, which
// forwards it server-to-server to the game. No key is stored here.
const GAME_ADMIN = "https://sans-tap-earn.vercel.app/api/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const key = req.headers.get("x-admin-key") || new URL(req.url).searchParams.get("key") || "";
  if (!key) return NextResponse.json({ error: "no_key" }, { status: 400 });
  try {
    const r = await fetch(GAME_ADMIN, { headers: { "x-admin-key": key }, cache: "no-store" });
    const body = await r.text();
    return new NextResponse(body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") || "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "upstream_unreachable" }, { status: 502 });
  }
}
