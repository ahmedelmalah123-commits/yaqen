import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAudioStore } from '../src/store/useAudioStore';
import { formatBytes } from '../src/lib/offlineAudio';

describe('Advanced Audio System & Cross-Platform Engine', () => {
  beforeEach(() => {
    useAudioStore.setState({
      source: null,
      status: 'idle',
      currentTime: 0,
      duration: 0,
      playbackRate: 1,
      repeatMode: 'none',
      sleepTimerEndsAt: null,
      selectedSleepMinutes: null,
      sleepTimerEndOfSurah: false,
      queue: [],
      listeningHistory: [],
      savedPlaylists: [],
      isCarModeOpen: false,
      isDiagnosticsOpen: false,
      isMiniPlayerOpen: false,
      lowDataMode: false,
      autoContinue: true,
      networkStatus: 'online',
    });
  });

  it('supports expanded playback rates up to 2x', () => {
    const store = useAudioStore.getState();
    const rates = [0.75, 1, 1.25, 1.5, 1.75, 2];
    for (const rate of rates) {
      store.setPlaybackRate(rate);
      expect(useAudioStore.getState().playbackRate).toBe(rate);
    }
  });

  it('supports sleep timer presets and end-of-surah mode', () => {
    const store = useAudioStore.getState();

    // 45 min preset
    store.setSleepTimerMinutes(45);
    expect(useAudioStore.getState().selectedSleepMinutes).toBe(45);
    expect(useAudioStore.getState().sleepTimerEndOfSurah).toBe(false);

    // End of surah toggle
    store.setSleepTimerEndOfSurah(true);
    expect(useAudioStore.getState().sleepTimerEndOfSurah).toBe(true);
    expect(useAudioStore.getState().selectedSleepMinutes).toBeNull();
    expect(useAudioStore.getState().sleepTimerEndsAt).toBeNull();

    // Reset
    store.setSleepTimerMinutes(null);
    expect(useAudioStore.getState().sleepTimerEndOfSurah).toBe(false);
    expect(useAudioStore.getState().selectedSleepMinutes).toBeNull();
  });

  it('manages personal listening queue, enqueueNext, and reordering', () => {
    const store = useAudioStore.getState();

    const track1 = {
      id: 'q1',
      label: 'سورة البقرة',
      subtitle: 'العفاسي',
      source: {
        kind: 'surah-stream' as const,
        surahNumber: 2,
        surahName: 'البقرة',
        reciterId: 'ar.alafasy',
        reciterName: 'العفاسي',
        streamUrl: 'https://cdn.mp3quran.net/002.mp3',
        totalAyahs: 286,
      },
    };

    const track2 = {
      id: 'q2',
      label: 'سورة آل عمران',
      subtitle: 'المنشاوي',
      source: {
        kind: 'surah-stream' as const,
        surahNumber: 3,
        surahName: 'آل عمران',
        reciterId: 'ar.minshawi',
        reciterName: 'المنشاوي',
        streamUrl: 'https://cdn.mp3quran.net/003.mp3',
        totalAyahs: 200,
      },
    };

    store.enqueueTrack(track1);
    store.enqueueTrack(track2);
    expect(useAudioStore.getState().queue).toHaveLength(2);
    expect(useAudioStore.getState().queue[0].id).toBe('q1');

    // Reorder: move track2 to top
    store.reorderQueue(1, 0);
    expect(useAudioStore.getState().queue[0].id).toBe('q2');

    // Play next from queue
    const played = store.playNextFromQueue();
    expect(played).toBe(true);
    expect(useAudioStore.getState().source?.kind).toBe('surah-stream');
    expect(useAudioStore.getState().queue).toHaveLength(1);
    expect(useAudioStore.getState().queue[0].id).toBe('q1');
  });

  it('records listening history and keeps recent sessions', () => {
    const store = useAudioStore.getState();

    store.recordListeningHistory({
      surahNumber: 1,
      surahName: 'الفاتحة',
      reciterId: 'ar.alafasy',
      reciterName: 'العفاسي',
      position: 15,
      duration: 60,
      completed: false,
    });

    const history = useAudioStore.getState().listeningHistory;
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe('ar.alafasy_1');
    expect(history[0].surahName).toBe('الفاتحة');
  });

  it('formats offline byte sizes cleanly in Arabic', () => {
    expect(formatBytes(0)).toBe('0 ميغابايت');
    expect(formatBytes(15 * 1024 * 1024)).toBe('15.0 ميغابايت');
    expect(formatBytes(2.5 * 1024 * 1024 * 1024)).toBe('2.5 غيغابايت');
  });

  it('toggles Car Mode, Mini Player, and Diagnostics state cleanly', () => {
    const store = useAudioStore.getState();

    expect(useAudioStore.getState().isCarModeOpen).toBe(false);
    store.setCarModeOpen(true);
    expect(useAudioStore.getState().isCarModeOpen).toBe(true);
    store.setCarModeOpen(false);
    expect(useAudioStore.getState().isCarModeOpen).toBe(false);

    store.setDiagnosticsOpen(true);
    expect(useAudioStore.getState().isDiagnosticsOpen).toBe(true);

    store.setMiniPlayerOpen(true);
    expect(useAudioStore.getState().isMiniPlayerOpen).toBe(true);
  });
});

