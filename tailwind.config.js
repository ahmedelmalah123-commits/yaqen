/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C69C6D", // Rich Gold
        secondary: "#0B1120", // Deep Midnight Navy
        accent: "#D4AF37", // Vibrant Gold
        dark: {
          bg: "#0B1120",
          surface: "#111827",
          border: "#1F2937"
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
