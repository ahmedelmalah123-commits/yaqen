/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        stage: 'var(--bg-stage)',
        elevated: 'var(--bg-elevated)',
        recessed: 'var(--bg-recessed)',
        ink: {
          DEFAULT: 'var(--ink-primary)',
          primary: 'var(--ink-primary)',
          secondary: 'var(--ink-secondary)',
          muted: 'var(--ink-muted)',
        },
        glow: {
          DEFAULT: 'var(--accent-glow)',
          soft: 'var(--accent-glow-soft)',
          border: 'var(--accent-glow-border)',
        },
        yaqeen: {
          light: 'var(--bg-elevated)',
          DEFAULT: 'var(--accent-glow)',
          dark: 'var(--bg-recessed)',
        },
        primary: 'var(--accent-glow)',
        secondary: 'var(--ink-primary)',
        accent: 'var(--accent-glow)',
        dark: {
          bg: 'var(--bg-canvas)',
          surface: 'var(--bg-stage)',
          border: 'var(--glass-border)',
        },
      },
      boxShadow: {
        raised: 'var(--shadow-raised)',
        'raised-sm': 'var(--shadow-raised-sm)',
        inset: 'var(--shadow-inset)',
        'inset-deep': 'var(--shadow-inset-deep)',
        glow: 'var(--accent-glow-shadow)',
      },
      fontFamily: {
        tajawal: ["'Tajawal'", "sans-serif"],
        poppins: ["'Poppins'", "sans-serif"],
        cairo: ["'Cairo'", "sans-serif"],
        reem: ["'Cairo'", "'Tajawal'", "sans-serif"],
        marhey: ["'Marhey'", "cursive"],
        amiri: ["'Amiri Quran'", "'Amiri'", "serif"],
        uthmanic: ["'UthmanicHafs'", "'Amiri Quran'", "'Amiri'", "serif"],
        playpen: ["'Playpen Sans Arabic'", "cursive"],
        ibm: ["'IBM Plex Sans Arabic'", "'Tajawal'", "sans-serif"],
        kufi: ["'Noto Kufi Arabic'", "'Cairo'", "sans-serif"],
        readex: ["'Readex Pro'", "'Tajawal'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
