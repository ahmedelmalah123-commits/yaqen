/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // toggle via <html class="dark">
  theme: {
    extend: {
      // ─── COLOR PALETTE ───────────────────────────────────────
      colors: {
        // Backgrounds — dark mode first (app default)
        bg: {
          primary: '#0F0F0F', // near-black main bg
          secondary: '#1A1A1A', // cards, sheets
          tertiary: '#242424', // elevated surfaces, modals
          elevated: '#2E2E2E', // dropdowns, tooltips
        },
        // Gold accent — Quranify's signature warmth
        gold: {
          50: '#FFF8E7',
          100: '#FDEDB5',
          200: '#FBDB6E',
          300: '#F5C842',
          400: '#E8A800', // primary brand gold
          500: '#C98F00', // hover/active
          600: '#A07200',
          700: '#7A5500',
          800: '#533A00',
          900: '#2C1E00',
        },
        // Text scale
        text: {
          primary: '#F5F0E8', // warm off-white
          secondary: '#A89880', // muted arabic text
          tertiary: '#6B5D50', // placeholders, hints
          inverse: '#0F0F0F', // text on light backgrounds
        },
        // Semantic
        success: '#4CAF7D',
        error: '#E85D5D',
        // Light mode overrides (when !dark)
        surface: {
          light: '#FAFAF8',
          card: '#FFFFFF',
          border: '#E8E0D8',
        },
      },

      // ─── TYPOGRAPHY ──────────────────────────────────────────
      fontFamily: {
        // Latin UI — clean, modern
        sans: ['Geist', 'system-ui', 'sans-serif'],
        // Arabic Quran text — authoritative, beautiful
        arabic: ['Amiri Quran', 'Scheherazade New', 'serif'],
        // Arabic UI labels
        'arabic-ui': ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
        // Surah numbers
        mono: ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        'quran-sm': ['1.5rem', { lineHeight: '2.8rem', letterSpacing: '0.02em' }],
        'quran-md': ['1.875rem', { lineHeight: '3.2rem', letterSpacing: '0.02em' }],
        'quran-lg': ['2.25rem', { lineHeight: '3.8rem', letterSpacing: '0.02em' }],
        'quran-xl': ['2.75rem', { lineHeight: '4.5rem', letterSpacing: '0.02em' }],
      },

      // ─── SPACING & LAYOUT ────────────────────────────────────
      spacing: {
        'nav-height': '64px',
        'player-height': '80px',
        'bottom-bar': '72px',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },

      // ─── BORDER RADIUS ───────────────────────────────────────
      borderRadius: {
        card: '16px',
        pill: '9999px',
        sheet: '24px',
      },

      // ─── SHADOWS ─────────────────────────────────────────────
      boxShadow: {
        'card-dark': '0 2px 16px rgba(0,0,0,0.4)',
        player: '0 -8px 32px rgba(0,0,0,0.6)',
        'gold-glow': '0 0 20px rgba(232,168,0,0.25)',
        'gold-subtle': '0 0 8px rgba(232,168,0,0.12)',
      },

      // ─── ANIMATIONS ──────────────────────────────────────────
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(232,168,0,0.12)' },
          '50%': { boxShadow: '0 0 24px rgba(232,168,0,0.4)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'wave-1': 'wave 1.2s ease-in-out infinite',
        'wave-2': 'wave 1.2s ease-in-out infinite 0.1s',
        'wave-3': 'wave 1.2s ease-in-out infinite 0.2s',
        'wave-4': 'wave 1.2s ease-in-out infinite 0.3s',
      },

      // ─── TRANSITIONS ─────────────────────────────────────────
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [],
}
