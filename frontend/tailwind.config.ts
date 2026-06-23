import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#dde6ff",
          200: "#c3cffd",
          300: "#a0aff9",
          400: "#8087f2",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#3f37c9",
          800: "#2d27a0",
          900: "#1e1b4b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
