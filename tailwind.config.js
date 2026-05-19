/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yaqeen: { light: '#e8f5e9', DEFAULT: '#4caf50', dark: '#2e7d32' },
        primary: "#C69C6D", // Rich Gold
        secondary: "#022c22", // Deep Emerald
        accent: "#D4AF37", // Vibrant Gold
        dark: {
          bg: "#022c22",
          surface: "#064e3b",
          border: "#065f46"
        }
      },
      fontFamily: {
        tajawal: ["Tajawal", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        reem: ["'Cairo'", "sans-serif"],
        marhey: ["'Marhey'", "cursive"],
        amiri: ["'Amiri Quran'", "'Amiri'", "serif"],
        playpen: ["'Playpen Sans Arabic'", "cursive"],
      },
    },
  },
  plugins: [],
}
