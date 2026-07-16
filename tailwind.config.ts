import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Required for manual dark mode toggle
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
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
