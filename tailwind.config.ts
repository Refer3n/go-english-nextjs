import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "Nunito-sans": ["Nunito-Sans", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#2C2D84",
        },
        red: {
          DEFAULT: "#FF0000",
        },
        blue: {
          100: "#89A3FF",
        },
        yellow: {
          DEFAULT: "#F4CE12",
        },
        light: {
          100: "#F6F6FC",
        },
      },
      screens: {
        xs: "480px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        pattern: "url('/images/pattern.webp')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
