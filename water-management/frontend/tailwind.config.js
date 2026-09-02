/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#0A0F0D", 900: "#121A17", 800: "#1B2622", 700: "#293832", 600: "#3C4E46" },
        paper: { 50: "#FAF9F5", 100: "#F3F1EA", 200: "#E9E5D9" },
        moss: { 50: "#EEF4F0", 100: "#D9E8DF", 300: "#8FB9A3", 500: "#4F9377", 600: "#3D7A63", 700: "#2F614E", 800: "#254B3D" },
        clay: { 100: "#F3E3D3", 400: "#D69257", 500: "#C97B3E", 600: "#AD6531" },
        rose: { 100: "#F2DDD8", 500: "#B3543F", 600: "#984433" },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      borderRadius: { "2xl": "1.25rem", "3xl": "1.75rem" },
    },
  },
  plugins: [],
};
