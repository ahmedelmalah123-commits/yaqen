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

      setReciter: (identifier) => set({ reciter: identifier }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setLanguage: (lang) => set({ language: lang }),
      setTourOpen: (open) => set({ tourOpen: open }),
      setYaqeenModeActive: (active) => set({ isYaqeenModeActive: active }),
    }),
    {
      name: 'yaqeen-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        language: state.language,
        tourOpen: state.tourOpen,
        reciter: state.reciter,
      })
    }
  )
)
