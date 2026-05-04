import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      language: 'ar',
      tourOpen: false,
      user: null, // Track Supabase user session
      audioState: {
        isPlaying: false,
        surah: null,
        ayahs: [],
        currentIndex: 0,
        reciter: 'ar.alafasy',
        isRadio: false,
      },
      audioOptions: {
        loop: false,
        shuffle: false,
      },
      sleepTimer: null,
      playbackHistory: [],
      playlists: [],
      playbackRate: 1,
      loopMode: 'off',
      loopCount: 1,
      equalizer: {
        enabled: false,
        bass: 0,
        mid: 0,
        treble: 0
      },

      setUser: (user) => set({ user }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setLanguage: (lang) => set({ language: lang }),
      setTourOpen: (open) => set({ tourOpen: open }),

      addToHistory: (surahName, index) => set((state) => {
        const entry = { id: surahName, text: surahName, ayah: index, time: Date.now() };
        return { playbackHistory: [entry, ...state.playbackHistory.filter(i => i.id !== surahName)].slice(0, 10) };
      }),

      setAudioState: (state) => set((prev) => ({
        audioState: { ...prev.audioState, ...state }
      })),

      toggleAudioOption: (option, value) => set((prev) => ({
        audioOptions: { 
          ...prev.audioOptions, 
          [option]: value !== undefined ? value : !prev.audioOptions[option] 
        }
      })),

      playSurah: (surahObject, ayahsArray, startIndex = 0) => {
        get().addToHistory(surahObject.name, startIndex);
        set({ audioState: {
          isPlaying: true,
          surah: surahObject,
          ayahs: ayahsArray,
          currentIndex: startIndex,
          reciter: get().audioState.reciter,
          isRadio: false
        }});
      },

      playRadio: (stationName, streamUrl) => {
        set({ audioState: {
          isPlaying: true,
          surah: { number: 0, name: stationName },
          ayahs: [{ text: "بث مباشر", audio: streamUrl }],
          currentIndex: 0,
          reciter: get().audioState.reciter,
          isRadio: true
        }});
      },

      playTrack: (title, trackUrl) => {
        set({ audioState: {
          isPlaying: true,
          surah: { number: -1, name: title },
          ayahs: [{ text: "استماع المادة التاريخية", audio: trackUrl }],
          currentIndex: 0,
          reciter: get().audioState.reciter,
          isRadio: true
        }});
      },

      nextAyah: () => set((state) => {
        const { currentIndex, ayahs } = state.audioState;
        if (currentIndex < ayahs.length - 1) {
          return { audioState: { ...state.audioState, currentIndex: currentIndex + 1, isPlaying: true } }
        } else {
          return { audioState: { ...state.audioState, isPlaying: false, currentIndex: 0 } }
        }
      }),
      
      setReciter: (identifier) => set((state) => ({
        audioState: { ...state.audioState, reciter: identifier }
      })),

      setPlaybackRate: (rate) => set({ playbackRate: rate }),
      setLoopMode: (mode) => set({ loopMode: mode }),
      setLoopCount: (count) => set({ loopCount: count }),
      setEqualizer: (eq) => set((state) => ({ 
        equalizer: { ...state.equalizer, ...eq } 
      })),

      setSleepTimer: (minutes) => set({ sleepTimer: minutes })
    }),
    {
      name: 'yaqeen-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        language: state.language,
        audioState: {
          isPlaying: false, // Don't auto-play on refresh
          surah: state.audioState.surah,
          ayahs: state.audioState.ayahs,
          currentIndex: state.audioState.currentIndex,
          reciter: state.audioState.reciter,
          isRadio: state.audioState.isRadio
        },
        audioOptions: state.audioOptions,
        playbackHistory: state.playbackHistory,
        playlists: state.playlists,
        playbackRate: state.playbackRate,
        loopMode: state.loopMode,
        loopCount: state.loopCount,
        equalizer: state.equalizer,
        sleepTimer: state.sleepTimer
      })
    }
  )
)
