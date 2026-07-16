// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ubfsf: {
          gold: "#D4A017",
          yellow: "#F2B705",
          zinc: "#1A1A1A",
        },
        // CSS variable-based colors
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        subtle: "var(--text-subtle)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        card: "var(--card-bg)",
      },
      fontFamily: {
        sans: ["Open Sans", "ui-sans-serif", "system-ui"],
        serif: ["Montserrat", "ui-serif", "Georgia"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;