import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#2B2527",
        paper: "#EEEAE2",
        rust: "#6E4656",
        moss: "#442633",
        sand: "#DEDAD3",
        mist: "#F7F4EE",
        stone: "#C8BFB9",
        citron: "#CCD8E3",
        petrol: "#442633",
        clay: "#BB6654",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.28em",
        caps: "0.22em",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        frame: "92rem",
      },
    },
  },
  plugins: [],
};

export default config;
