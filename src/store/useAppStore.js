import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeReciterId } from '../lib/data/recitersData';

export const DEFAULT_READING_SETTINGS = {
  quranFontSize: 32,
  quranFontFamily: 'uthmanic',
  quranLineHeight: 2.25,
  quranWordSpacing: 3,
  readingSurface: 'auto',
  readingWidth: 'comfortable',
  readingViewMode: 'mushaf',
  showWaqfMarks: true,
};

export const useAppStore = create(
  persist(
    (set) => ({
      theme: 'light',
      language: 'ar',
      tourOpen: false,
      reciter: 'ar.alafasy',
      isYaqeenModeActive: false,
      isBookmarksDrawerOpen: false,
      isSettingsDrawerOpen: false,
      isMobileNavOpen: false,
      ...DEFAULT_READING_SETTINGS,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setLanguage: (language) => set({ language }),
      setTourOpen: (open) => set({ tourOpen: open }),
      setReciter: (reciter) => set({ reciter: normalizeReciterId(reciter) }),
      setQuranFontSize: (size) =>
        set({
          quranFontSize: Math.min(56, Math.max(22, Number(size) || DEFAULT_READING_SETTINGS.quranFontSize)),
        }),
      setQuranFontFamily: (quranFontFamily) => set({ quranFontFamily }),
      setQuranLineHeight: (quranLineHeight) =>
        set({
          quranLineHeight: Math.min(2.8, Math.max(1.75, Number(quranLineHeight) || DEFAULT_READING_SETTINGS.quranLineHeight)),
        }),
      setQuranWordSpacing: (quranWordSpacing) =>
        set({
          quranWordSpacing: Math.min(12, Math.max(0, Number(quranWordSpacing) || 0)),
        }),
      setReadingSurface: (readingSurface) => set({ readingSurface }),
      setReadingWidth: (readingWidth) => set({ readingWidth }),
      setReadingViewMode: (readingViewMode) => set({ readingViewMode }),
      setShowWaqfMarks: (showWaqfMarks) => set({ showWaqfMarks }),
      resetReadingSettings: () => set({ ...DEFAULT_READING_SETTINGS }),

      setYaqeenModeActive: (active) => set({ isYaqeenModeActive: active }),
      setBookmarksDrawerOpen: (open) => set({ isBookmarksDrawerOpen: open }),
      setSettingsDrawerOpen: (open) => set({ isSettingsDrawerOpen: open }),
      setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
    }),
    {
      name: 'yaqeen-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.reciter) {
          state.reciter = normalizeReciterId(state.reciter);
        }
      },
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        reciter: state.reciter,
        quranFontSize: state.quranFontSize,
        quranFontFamily: state.quranFontFamily,
        quranLineHeight: state.quranLineHeight,
        quranWordSpacing: state.quranWordSpacing,
        readingSurface: state.readingSurface,
        readingWidth: state.readingWidth,
        readingViewMode: state.readingViewMode,
        showWaqfMarks: state.showWaqfMarks,
      }),
    }
  )
);
