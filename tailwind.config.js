/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        stage: 'var(--bg-stage)',
        elevated: 'var(--bg-elevated)',
        recessed: 'var(--bg-recessed)',
        ink: 'var(--ink-primary)',
        'ink-secondary': 'var(--ink-secondary)',
        'ink-muted': 'var(--ink-muted)',
        glow: 'var(--accent-glow)',
        'glow-soft': 'var(--glow-soft)',
        'glow-border': 'var(--glow-border)',
        accent: {
          gold: '#D97706',
          'gold-light': '#F59E0B',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'Tajawal', 'sans-serif'],
        tajawal: ['Tajawal', 'Cairo', 'sans-serif'],
        amiri: ['"Amiri Quran"', 'Amiri', 'serif'],
        uthmanic: ['"UthmanicHafs"', '"Amiri Quran"', 'Amiri', '"Noto Naskh Arabic"', 'serif'],
        naskh: ['"Noto Naskh Arabic"', 'Amiri', 'serif'],
        readex: ['Tajawal', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        raised: 'var(--shadow-raised)',
        'raised-sm': 'var(--shadow-raised-sm)',
        recessed: 'var(--shadow-recessed)',
      },
      borderRadius: {
        stage: '28px',
        card: '22px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
