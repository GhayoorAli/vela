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
        ink: "#0C0B0A",
        paper: "#F3EEE6",
        rust: "#B54A32",
        moss: "#2C3830",
        sand: "#E6DFD3",
        mist: "#FAF7F2",
        stone: "#C9C2B6",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
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
