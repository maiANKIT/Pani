/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgba(255, 255, 255, 0.06)",
        "surface-border": "rgba(255, 255, 255, 0.12)",
        primary: {
          DEFAULT: "#38bdf8",
          dark: "#0ea5e9",
        },
        accent: "#22d3ee",
        success: "#34d399",
        danger: "#f87171",
        warning: "#fbbf24",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};