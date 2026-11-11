import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getReciterById, getSurahAudioUrl } from '../lib/data/recitersData';
import { getSurahMeta } from '../features/quran/surahMetadata';
import { stripSurahPrefix } from '../lib/arabicSearch';

export type RepeatMode = 'none' | 'ayah' | 'surah';

export interface LastReadingSession {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahIndex: number;
  reciterId: string;
  updatedAt: string;
}

export type ActiveSource =
  | {
      kind: 'surah-stream';
      surahNumber: number;
      surahName: string;
      reciterId: string;
      reciterName: string;
      streamUrl: string;
      totalAyahs: number;
      clipAyahNumber?: number;
      clipStartSeconds?: number;
      clipEndSeconds?: number;
    }
  | {
      kind: 'radio';
      stationId: string;
      stationName: string;
      stationType: string;
      streamUrl: string;
    };

export type RestorableSource = Exclude<ActiveSource, { kind: 'radio' }>;

export interface SavedPlaybackState {
  source: RestorableSource;
  currentTime: number;
  duration: number;
  updatedAt: string;
}

export interface QueuedTrack {
  id: string;
  label: string;
  subtitle: string;
  source: ActiveSource;
}

export function getAllowedRepeatModes(
  sourceOrKind?: ActiveSource | ActiveSource['kind'] | null
): RepeatMode[] {
  if (!sourceOrKind) return ['none', 'surah'];
  if (typeof sourceOrKind === 'string') {
    if (sourceOrKind === 'radio') return ['none'];
    return ['none', 'surah'];
  }
  if (sourceOrKind.kind === 'radio') return ['none'];
  if (sourceOrKind.clipAyahNumber !== undefined) return ['none', 'ayah'];
  return ['none', 'surah'];
}

export function normalizeRepeatMode(
  mode: RepeatMode,
  sourceOrKind?: ActiveSource | ActiveSource['kind'] | null
): RepeatMode {
  const allowed = getAllowedRepeatModes(sourceOrKind);
  return allowed.includes(mode) ? mode : 'none';
}

function isValidPersistedStreamSource(candidate: unknown): candidate is RestorableSource {
  if (!candidate || typeof candidate !== 'object') return false;
  const src = candidate as Partial<RestorableSource>;
  return (
    src.kind === 'surah-stream' &&
    typeof src.surahNumber === 'number' &&
    src.surahNumber >= 1 &&
    src.surahNumber <= 114 &&
    typeof src.streamUrl === 'string' &&
    src.streamUrl.startsWith('http')
  );
}

function buildSavedPlayback(
  source: ActiveSource | null,
  currentTime: number,
  duration: number
): SavedPlaybackState | null {
  if (!source || source.kind === 'radio') return null;
  const safeTime = Number.isFinite(currentTime) && currentTime >= 0 ? currentTime : 0;
  const safeDuration = Number.isFinite(duration) && duration >= 0 ? duration : 0;
  return {
    source: { ...source },
    currentTime: safeTime,
    duration: safeDuration,
    updatedAt: new Date().toISOString(),
  };
}

interface AudioState {
  source: ActiveSource | null;
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error';
  errorMessage: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  repeatMode: RepeatMode;
  sleepTimerEndsAt: number | null;
  selectedSleepMinutes: number | null;
  isExpanded: boolean;
  seekRequest: number | null;
  pendingRestoreTime: number | null;
  playRequestToken: number;
  queue: QueuedTrack[];
  lastSession: LastReadingSession | null;
  savedPlayback: SavedPlaybackState | null;

  playSurahStream: (payload: {
    surahNumber: number;
    surahName: string;
    reciterId: string;
    reciterName: string;
    streamUrl: string;
    totalAyahs: number;
    startSeconds?: number;
    clipAyahNumber?: number;
    clipStartSeconds?: number;
    clipEndSeconds?: number;
  }) => void;
  seekAndPlaySurahStream: (seconds: number) => void;
  playRadio: (payload: {
    stationId: string;
    stationName: string;
    stationType: string;
    streamUrl: string;
  }) => void;
  togglePlayPause: () => void;
  pause: () => void;
  stop: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  requestSeek: (seconds: number) => void;
  clearSeekRequest: () => void;
  clearPendingRestoreTime: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  cycleRepeatMode: () => void;
  setSleepTimerMinutes: (minutes: number | null) => void;
  setExpanded: (expanded: boolean) => void;
  enqueueTrack: (item: QueuedTrack) => void;
  removeQueueItem: (id: string) => void;
  clearQueue: () => void;
  playNextFromQueue: () => boolean;
  setRuntimeState: (
    patch: Partial<Pick<AudioState, 'status' | 'errorMessage' | 'currentTime' | 'duration'>>
  ) => void;
  persistPlaybackProgress: (currentTime: number, duration: number) => void;
  recordReadingPosition: (session: LastReadingSession) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      source: null,
      status: 'idle',
      errorMessage: null,
      currentTime: 0,
      duration: 0,
      volume: 1,
      muted: false,
      playbackRate: 1,
      repeatMode: 'none',
      sleepTimerEndsAt: null,
      selectedSleepMinutes: null,
      isExpanded: false,
      seekRequest: null,
      pendingRestoreTime: null,
      playRequestToken: 0,
      queue: [],
      lastSession: null,
      savedPlayback: null,

      playSurahStream: (payload) => {
        const startSec =
          payload.startSeconds !== undefined &&
          Number.isFinite(payload.startSeconds) &&
          payload.startSeconds > 0
            ? payload.startSeconds
            : 0;

        const nextSource: RestorableSource = {
          kind: 'surah-stream',
          surahNumber: payload.surahNumber,
          surahName: payload.surahName,
          reciterId: payload.reciterId,
          reciterName: payload.reciterName,
          streamUrl: payload.streamUrl,
          totalAyahs: payload.totalAyahs,
          ...(payload.clipAyahNumber !== undefined
            ? {
                clipAyahNumber: payload.clipAyahNumber,
                clipStartSeconds: payload.clipStartSeconds ?? startSec,
                clipEndSeconds: payload.clipEndSeconds,
              }
            : {}),
        };

        set((state) => ({
          source: nextSource,
          status: 'loading',
          errorMessage: null,
          currentTime: startSec,
          duration: 0,
          seekRequest: null,
          pendingRestoreTime: startSec > 0 ? startSec : null,
          repeatMode: normalizeRepeatMode(state.repeatMode, nextSource),
          playRequestToken: state.playRequestToken + 1,
          savedPlayback: buildSavedPlayback(nextSource, startSec, 0),
          lastSession: {
            surahNumber: payload.surahNumber,
            surahName: payload.surahName,
            ayahNumber: payload.clipAyahNumber ?? 1,
            ayahIndex: Math.max(0, (payload.clipAyahNumber ?? 1) - 1),
            reciterId: payload.reciterId,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      seekAndPlaySurahStream: (seconds) => {
        const targetSec = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
        set((state) => {
          if (!state.source || state.source.kind !== 'surah-stream') return state;
          const hasDuration = Number.isFinite(state.duration) && state.duration > 0;
          return {
            status: hasDuration ? 'playing' : 'loading',
            errorMessage: null,
            currentTime: targetSec,
            seekRequest: hasDuration ? targetSec : null,
            pendingRestoreTime: hasDuration ? null : targetSec,
            playRequestToken: state.playRequestToken + 1,
            savedPlayback: buildSavedPlayback(state.source, targetSec, state.duration),
          };
        });
      },

      playRadio: (payload) =>
        set((state) => ({
          source: {
            kind: 'radio',
            ...payload,
          },
          status: 'loading',
          errorMessage: null,
          currentTime: 0,
          duration: 0,
          seekRequest: null,
          pendingRestoreTime: null,
          repeatMode: 'none',
          savedPlayback: null,
          playRequestToken: state.playRequestToken + 1,
        })),

      togglePlayPause: () => {
        const { source, status, playRequestToken } = get();
        if (!source) return;
        if (status === 'playing' || status === 'loading') {
          set({ status: 'paused' });
        } else {
          set({ status: 'playing', errorMessage: null, playRequestToken: playRequestToken + 1 });
        }
      },

      pause: () => set({ status: 'paused' }),

      stop: () =>
        set({
          source: null,
          status: 'idle',
          errorMessage: null,
          currentTime: 0,
          duration: 0,
          isExpanded: false,
          seekRequest: null,
          pendingRestoreTime: null,
          savedPlayback: null,
          sleepTimerEndsAt: null,
          selectedSleepMinutes: null,
        }),

      nextTrack: () => {
        const state = get();
        if (!state.source) return;

        if (state.playNextFromQueue()) {
          return;
        }

        if (state.source.kind === 'surah-stream') {
          const nextNum = state.source.surahNumber + 1;
          if (nextNum <= 114) {
            const meta = getSurahMeta(nextNum);
            const reciter = getReciterById(state.source.reciterId);
            const streamUrl = getSurahAudioUrl(reciter.id, nextNum);
            if (streamUrl) {
              state.playSurahStream({
                surahNumber: nextNum,
                surahName: stripSurahPrefix(meta?.name || `سورة ${nextNum}`),
                reciterId: reciter.id,
                reciterName: reciter.name,
                streamUrl,
                totalAyahs: meta?.numberOfAyahs || 0,
              });
              return;
            }
          }
          set({ status: 'paused', currentTime: 0, pendingRestoreTime: null });
        }
      },

      prevTrack: () => {
        const state = get();
        if (!state.source || state.source.kind !== 'surah-stream') return;

        if (state.source.clipStartSeconds !== undefined) {
          state.seekAndPlaySurahStream(state.source.clipStartSeconds);
          return;
        }

        const prevNum = state.source.surahNumber - 1;
        if (prevNum >= 1) {
          const meta = getSurahMeta(prevNum);
          const reciter = getReciterById(state.source.reciterId);
          const streamUrl = getSurahAudioUrl(reciter.id, prevNum);
          if (streamUrl) {
            state.playSurahStream({
              surahNumber: prevNum,
              surahName: stripSurahPrefix(meta?.name || `سورة ${prevNum}`),
              reciterId: reciter.id,
              reciterName: reciter.name,
              streamUrl,
              totalAyahs: meta?.numberOfAyahs || 0,
            });
            return;
          }
        }

        state.requestSeek(0);
      },

      requestSeek: (seconds) => set({ seekRequest: Math.max(0, seconds) }),
      clearSeekRequest: () => set({ seekRequest: null }),
      clearPendingRestoreTime: () => set({ pendingRestoreTime: null }),

      setVolume: (volume) =>
        set({ volume: Math.max(0, Math.min(1, volume)), muted: volume === 0 }),

      toggleMute: () => set((state) => ({ muted: !state.muted })),

      setPlaybackRate: (playbackRate) => set({ playbackRate }),

      cycleRepeatMode: () =>
        set((state) => {
          const allowed = getAllowedRepeatModes(state.source);
          if (allowed.length <= 1) {
            return { repeatMode: 'none' };
          }
          const idx = allowed.indexOf(state.repeatMode);
          const nextMode = idx >= 0 ? allowed[(idx + 1) % allowed.length] : allowed[0];
          return { repeatMode: nextMode };
        }),

      setSleepTimerMinutes: (minutes) =>
        set({
          sleepTimerEndsAt:
            minutes && minutes > 0 ? Date.now() + minutes * 60_000 : null,
          selectedSleepMinutes: minutes && minutes > 0 ? minutes : null,
        }),

      setExpanded: (isExpanded) => set({ isExpanded }),

      enqueueTrack: (item) =>
        set((state) => {
          if (item.source.kind !== 'surah-stream' && item.source.kind !== 'radio') {
            return state;
          }
          if (state.queue.some((q) => q.id === item.id)) return state;
          return { queue: [...state.queue, item] };
        }),

      removeQueueItem: (id) =>
        set((state) => ({ queue: state.queue.filter((item) => item.id !== id) })),

      clearQueue: () => set({ queue: [] }),

      playNextFromQueue: () => {
        const state = get();
        if (state.queue.length === 0) return false;
        const [nextItem, ...rest] = state.queue;
        set({
          source: nextItem.source,
          queue: rest,
          status: 'loading',
          errorMessage: null,
          currentTime: 0,
          duration: 0,
          seekRequest: null,
          pendingRestoreTime: null,
          repeatMode: normalizeRepeatMode(state.repeatMode, nextItem.source),
          savedPlayback: buildSavedPlayback(nextItem.source, 0, 0),
          playRequestToken: state.playRequestToken + 1,
        });
        return true;
      },

      setRuntimeState: (patch) => set(patch),

      persistPlaybackProgress: (currentTime, duration) =>
        set((state) => {
          if (!state.source || state.source.kind === 'radio' || state.pendingRestoreTime !== null) {
            return state;
          }
          return {
            currentTime,
            duration,
            savedPlayback: buildSavedPlayback(state.source, currentTime, duration),
          };
        }),

      recordReadingPosition: (lastSession) => set({ lastSession }),
    }),
    {
      name: 'yaqeen-audio-storage',
      partialize: (state) => ({
        volume: state.volume,
        muted: state.muted,
        playbackRate: state.playbackRate,
        repeatMode: state.repeatMode,
        lastSession: state.lastSession,
        savedPlayback: state.savedPlayback,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState || {}) as Partial<AudioState>;
        const saved = persisted.savedPlayback ?? null;
        if (saved && isValidPersistedStreamSource(saved.source)) {
          const restoredTime =
            Number.isFinite(saved.currentTime) && saved.currentTime > 0 ? saved.currentTime : 0;
          return {
            ...currentState,
            ...persisted,
            source: saved.source,
            status: 'paused',
            errorMessage: null,
            currentTime: restoredTime,
            duration: Number.isFinite(saved.duration) && saved.duration > 0 ? saved.duration : 0,
            pendingRestoreTime: restoredTime > 0 ? restoredTime : null,
            repeatMode: normalizeRepeatMode(
              persisted.repeatMode ?? currentState.repeatMode,
              saved.source
            ),
          };
        }
        return {
          ...currentState,
          volume: persisted.volume ?? currentState.volume,
          muted: persisted.muted ?? currentState.muted,
          playbackRate: persisted.playbackRate ?? currentState.playbackRate,
          repeatMode: normalizeRepeatMode(persisted.repeatMode ?? 'none', null),
          lastSession: persisted.lastSession ?? null,
          savedPlayback: null,
        };
      },
    }
  )
);
