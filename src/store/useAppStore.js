import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'ar',
      tourOpen: false,
      reciter: 'ar.alafasy',
      isYaqeenModeActive: false,
      quranFontSize: 34,
      isFocusMode: false,
      bookmarksDrawerOpen: false,

      setReciter: (identifier) => set({ reciter: identifier }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setLanguage: (lang) => set({ language: lang }),
      setTourOpen: (open) => set({ tourOpen: open }),
      setYaqeenModeActive: (active) => set({ isYaqeenModeActive: active }),
      setQuranFontSize: (size) =>
        set({ quranFontSize: Math.min(60, Math.max(24, Number(size) || 34)) }),
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
      setFocusMode: (active) => set({ isFocusMode: active }),
      setBookmarksDrawerOpen: (open) => set({ bookmarksDrawerOpen: open }),
    }),
    {
      name: 'yaqeen-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        tourOpen: state.tourOpen,
        reciter: state.reciter,
        quranFontSize: state.quranFontSize,
      }),
    }
  )
)
