/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Playful game palette (matches the SANS mini app)
        navy: "#27406b",
        slate: "#5a6b85",
        mute: "#8a9bb5",
        cream: "#fffdf7",
        sky: {
          50: "#f4faff",
          100: "#e6f3ff",
          200: "#c9e6ff",
          300: "#a3d3ff",
          400: "#79bcff",
        },
        sea: { DEFAULT: "#3b9dff", dark: "#2b7be0" },
        sun: { DEFAULT: "#ffc23d", dark: "#f0a000" },
        leaf: { DEFAULT: "#3fce7a", dark: "#27a85e" },
        berry: { DEFAULT: "#9a6bff", dark: "#7d4ae0" },
        coral: { DEFAULT: "#ff7a5c", dark: "#e23b3b" },
      },
      fontFamily: {
        display: ["var(--font-fredoka)", "ui-rounded", "system-ui"],
        body: ["var(--font-nunito)", "ui-sans-serif", "system-ui"],
      },
      backgroundImage: {
        "sky-fade": "linear-gradient(180deg, #cdeaff 0%, #eaf6ff 45%, #fffdf7 100%)",
        "sun-ray": "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(255,194,61,0.35), transparent)",
      },
      boxShadow: {
        pop: "0 6px 0 rgba(20,40,80,.12), 0 12px 26px rgba(20,40,80,.16)",
        "pop-sm": "0 4px 0 rgba(20,40,80,.10), 0 8px 16px rgba(20,40,80,.14)",
        sun: "0 6px 0 #d99b00, 0 10px 22px rgba(240,160,0,.35)",
        sea: "0 6px 0 #1f5aa8, 0 10px 22px rgba(43,123,224,.35)",
      },
      borderRadius: { chunk: "1.75rem" },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
        pulseSlow: "pulseSlow 3s ease-in-out infinite",
        wag: "wag 2.5s ease-in-out infinite",
      },
      keyframes: {
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        pulseSlow: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.6 } },
        wag: { "0%,100%": { transform: "rotate(-2deg)" }, "50%": { transform: "rotate(2deg)" } },
      },
    },
  },
  plugins: [],
};
