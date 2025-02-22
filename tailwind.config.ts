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
          200: "#1443E8",
          300: "#66A0FF",
        },
        yellow: {
          DEFAULT: "#F4CE12",
        },
        light: {
          100: "#F6F6FC",
          200: "#F6DDDD",
          300: "#8C8C8C",
          400: "#F3F3F3",
          500: "#FFFFFFBF",
          600: "#F8F9FE",
        },
        gray: {
          100: "#333333",
          200: "#C2C3D5",
          300: "#EEEFF4",
        },
        black: {
          100: "#212121"
        }
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
        gradientLine:
          "linear-gradient(to right, rgba(66, 133, 244, 0) 0%, rgba(66, 133, 244, 0.4) 50%, rgba(66, 133, 244, 0) 100%)",
        gradientStar: "background: linear-gradient(to right, #F4CE12 50%, #C2C3D5 50%);"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
