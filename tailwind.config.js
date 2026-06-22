/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05080C",
          900: "#070C12",
          850: "#0A1119",
          800: "#0E1722",
          700: "#16222F",
          600: "#1E303F",
          500: "#2A4356",
        },
        signal: {
          DEFAULT: "#2DE2C5",
          dim: "#1B9E8A",
          glow: "#7BFFE8",
        },
        amber: {
          signal: "#E2A02D",
        },
      },
      fontFamily: {
        display: ["var(--font-space)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(45,226,197,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,226,197,0.06) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(45,226,197,0.18), transparent)",
      },
      boxShadow: {
        signal: "0 0 0 1px rgba(45,226,197,0.25), 0 0 40px -8px rgba(45,226,197,0.35)",
      },
      animation: {
        scan: "scan 3s linear infinite",
        pulseSlow: "pulseSlow 3.5s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
};
