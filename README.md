# SANS Token — Landing Page

A dark, cyber-themed Web3 landing page built with **Next.js 14 (App Router)**, **React 18**, **Tailwind CSS**, and **lucide-react** icons.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  layout.tsx        — fonts, metadata
  page.tsx           — assembles all sections
  globals.css         — Tailwind base + a11y/focus styles
components/
  Navbar.tsx
  Hero.tsx
  PresaleWidget.tsx    — interactive USDT → SANS calculator
  ConnectWalletButton.tsx — Wagmi/Web3Modal-ready stub
  Tokenomics.tsx       — custom SVG donut chart
  Roadmap.tsx
  TrustBadges.tsx
  Footer.tsx
public/
  sans-token-whitepaper.pdf  — replace with your real PDF
```

## Wiring up real wallet connection (Wagmi + Web3Modal / Reown AppKit)

`components/ConnectWalletButton.tsx` currently uses local mock state so the
UI is fully functional out of the box. To connect it to a real wallet:

1. Install dependencies:
   ```bash
   npm i wagmi viem @web3modal/wagmi @tanstack/react-query
   ```
2. Create `config/wagmi.ts` with your project ID from
   [cloud.reown.com](https://cloud.reown.com) and your target chains
   (e.g. mainnet, Base, BNB Chain).
3. Wrap the app in `app/providers.tsx` with `<WagmiProvider>` and
   `<QueryClientProvider>`, then import that provider in `app/layout.tsx`.
4. In `ConnectWalletButton.tsx`, swap the `useState` mock for:
   ```ts
   import { useAccount, useConnect, useDisconnect } from "wagmi";
   const { address, isConnected } = useAccount();
   const { connect, connectors } = useConnect();
   ```
5. Replace `handleConnect` with `connect({ connector: connectors[0] })`, or
   open the Web3Modal directly via `useWeb3Modal().open()`.

The button's markup, states (idle / connecting / connected), and styling are
already structured to support this swap with no layout changes.

## Connecting the presale contract

`components/PresaleWidget.tsx` currently computes the USDT → SANS quote
client-side using a static `RATE` constant and static `RAISED` / `GOAL`
values. Once your presale contract is deployed:

- Replace `RAISED` with a live read from the contract (`useReadContract`).
- Replace the `handleConnect` buy action with a `useWriteContract` call to
  your presale contract's `buyTokens(amount)` function, gated behind a
  USDT `approve()` step.

## Customization

- Brand colors live in `tailwind.config.js` under `theme.extend.colors`
  (`ink` = backgrounds, `signal` = primary teal accent).
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (data/labels) —
  loaded via `next/font/google` in `app/layout.tsx`.
- Replace `public/sans-token-whitepaper.pdf` with your real whitepaper.
- Update social links in `components/Footer.tsx`.
