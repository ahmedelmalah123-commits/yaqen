import React, { useEffect, useRef } from 'react';
import { useAudioStore } from '../../store/useAudioStore';
import { getOfflineAudioUrl } from '../../lib/offlineAudio';

function applyEffectiveRate(
  audio: HTMLAudioElement,
  sourceKind: string | undefined,
  rate: number
) {
  const effective = sourceKind === 'radio' ? 1 : rate;
  audio.defaultPlaybackRate = effective;
  audio.playbackRate = effective;
}

const MEDIA_ARTWORK = [
  { src: '/audio-artwork-96.png', sizes: '96x96', type: 'image/png' },
  { src: '/audio-artwork-128.png', sizes: '128x128', type: 'image/png' },
  { src: '/audio-artwork-192.png', sizes: '192x192', type: 'image/png' },
  { src: '/audio-artwork-256.png', sizes: '256x256', type: 'image/png' },
  { src: '/audio-artwork-384.png', sizes: '384x384', type: 'image/png' },
  { src: '/audio-artwork-512.png', sizes: '512x512', type: 'image/png' },
  { src: '/audio-artwork-1024.png', sizes: '1024x1024', type: 'image/png' },
];

/**
 * Singleton authoritative audio engine mounted once at root level.
 * Features:
 * - Real Media Session API (lock screen, Bluetooth, headphones, SMTC, Touch Bar, car displays)
 * - Transparent offline CacheStorage playback fallback
 * - Exponential backoff network retry
 * - Battery & visibility throttling
 * - Sleep timer "End of Surah" and preset minutes
 */
export const AudioEngine: React.FC = () => {
  const source = useAudioStore((s) => s.source);
  const status = useAudioStore((s) => s.status);
  const volume = useAudioStore((s) => s.volume);
  const muted = useAudioStore((s) => s.muted);
  const playbackRate = useAudioStore((s) => s.playbackRate);
  const repeatMode = useAudioStore((s) => s.repeatMode);
  const sleepTimerEndsAt = useAudioStore((s) => s.sleepTimerEndsAt);
  const sleepTimerEndOfSurah = useAudioStore((s) => s.sleepTimerEndOfSurah);
  const seekRequest = useAudioStore((s) => s.seekRequest);
  const playRequestToken = useAudioStore((s) => s.playRequestToken);
  const autoContinue = useAudioStore((s) => s.autoContinue);

  const setRuntimeState = useAudioStore((s) => s.setRuntimeState);
  const clearSeekRequest = useAudioStore((s) => s.clearSeekRequest);
  const nextTrack = useAudioStore((s) => s.nextTrack);
  const prevTrack = useAudioStore((s) => s.prevTrack);
  const togglePlayPause = useAudioStore((s) => s.togglePlayPause);
  const pause = useAudioStore((s) => s.pause);
  const setSleepTimerMinutes = useAudioStore((s) => s.setSleepTimerMinutes);
  const setSleepTimerEndOfSurah = useAudioStore((s) => s.setSleepTimerEndOfSurah);
  const setNetworkStatus = useAudioStore((s) => s.setNetworkStatus);
  const incrementRetryCount = useAudioStore((s) => s.incrementRetryCount);
  const resetRetryCount = useAudioStore((s) => s.resetRetryCount);
  const requestSeek = useAudioStore((s) => s.requestSeek);

  const primaryRef = useRef<HTMLAudioElement | null>(null);
  const currentLoadedUrlRef = useRef<string | null>(null);
  const lastSavedTickRef = useRef<number>(0);
  const statusRef = useRef(status);
  statusRef.current = status;
  const retryTimeoutRef = useRef<number | null>(null);

  // Sync MediaSession position state accurately
  const syncMediaSessionPosition = (audio: HTMLAudioElement) => {
    if (!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return;
    try {
      const pos = audio.currentTime;
      const dur = audio.duration;
      if (Number.isFinite(dur) && dur > 0 && Number.isFinite(pos) && pos >= 0 && pos <= dur) {
        navigator.mediaSession.setPositionState({
          duration: dur,
          playbackRate: audio.playbackRate || 1,
          position: Math.min(pos, dur),
        });
      }
    } catch {
      // Ignore unsupported or out-of-range position calls
    }
  };

  useEffect(() => {
    const primary = new Audio();
    primary.preload = 'metadata';
    primaryRef.current = primary;

    const flushProgress = () => {
      const latest = useAudioStore.getState();
      if (latest.source && latest.source.kind !== 'radio' && latest.pendingRestoreTime === null) {
        const dur = Number.isFinite(primary.duration) ? primary.duration : latest.duration;
        latest.persistPlaybackProgress(primary.currentTime || 0, dur);
      }
    };

    const syncRateFromStore = () => {
      const latest = useAudioStore.getState();
      applyEffectiveRate(primary, latest.source?.kind, latest.playbackRate);
    };

    const handlePlaying = () => {
      resetRetryCount();
      syncRateFromStore();
      setRuntimeState({ status: 'playing', errorMessage: null });
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
      syncMediaSessionPosition(primary);
    };

    const handleCanPlay = () => {
      syncRateFromStore();
      syncMediaSessionPosition(primary);
    };

    const handleWaiting = () => {
      if (statusRef.current !== 'paused' && statusRef.current !== 'idle') {
        setRuntimeState({ status: 'loading' });
      }
    };

    const handleTimeUpdate = () => {
      const latest = useAudioStore.getState();
      if (latest.pendingRestoreTime !== null) return;

      const nowTime = primary.currentTime || 0;
      const nowDuration = Number.isFinite(primary.duration) ? primary.duration : 0;

      // Handle clip boundaries for ayah / daily clip
      if (
        latest.source?.kind === 'surah-stream' &&
        latest.source.clipEndSeconds !== undefined &&
        nowTime >= latest.source.clipEndSeconds
      ) {
        const clipStart = latest.source.clipStartSeconds ?? 0;
        if (latest.repeatMode === 'ayah') {
          primary.currentTime = clipStart;
          syncRateFromStore();
          setRuntimeState({ currentTime: clipStart, duration: nowDuration });
          return;
        }
        primary.pause();
        primary.currentTime = clipStart;
        latest.pause();
        setRuntimeState({ currentTime: clipStart, duration: nowDuration });
        return;
      }

      setRuntimeState({
        currentTime: nowTime,
        duration: nowDuration,
      });

      // Throttle progress persistence (1.5s foreground, 3s when tab is hidden to save battery)
      const throttleInterval = document.visibilityState === 'hidden' ? 3000 : 1500;
      const nowMs = Date.now();
      if (nowMs - lastSavedTickRef.current >= throttleInterval) {
        lastSavedTickRef.current = nowMs;
        latest.persistPlaybackProgress(nowTime, nowDuration);
        syncMediaSessionPosition(primary);
      }
    };

    const applyPendingSeekIfReady = () => {
      const latest = useAudioStore.getState();
      const dur = Number.isFinite(primary.duration) ? primary.duration : 0;
      syncRateFromStore();

      if (latest.pendingRestoreTime !== null && dur > 0) {
        const clamped = Math.min(latest.pendingRestoreTime, Math.max(0, dur - 0.25));
        primary.currentTime = clamped;
        latest.clearPendingRestoreTime();
        setRuntimeState({ currentTime: clamped, duration: dur });
        syncMediaSessionPosition(primary);
        return true;
      }

      if (latest.pendingRestoreTime !== null && dur === 0) {
        latest.clearPendingRestoreTime();
      }
      return false;
    };

    const handleLoadedMetadata = () => {
      if (applyPendingSeekIfReady()) return;
      const dur = Number.isFinite(primary.duration) ? primary.duration : 0;
      setRuntimeState({ duration: dur });
      syncMediaSessionPosition(primary);
    };

    const handlePauseEvent = () => {
      flushProgress();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    };

    const handleError = () => {
      if (!primary.getAttribute('src')) return;
      const latest = useAudioStore.getState();

      // Check online state & attempt exponential backoff retry up to 3 times
      if (!navigator.onLine) {
        setNetworkStatus('offline');
        setRuntimeState({
          status: 'error',
          errorMessage: 'انقطع الاتصال بالإنترنت. يرجى التحقق من الشبكة أو تشغيل السور المحملة بدون إنترنت.',
        });
        return;
      }

      if (latest.retryCount < 3) {
        incrementRetryCount();
        setNetworkStatus('reconnecting');
        const delay = Math.pow(2, latest.retryCount) * 1000;
        retryTimeoutRef.current = window.setTimeout(() => {
          if (primary && primary.getAttribute('src')) {
            const savedTime = primary.currentTime || 0;
            primary.load();
            primary.currentTime = savedTime;
            primary.play().catch(() => {});
          }
        }, delay);
        return;
      }

      setRuntimeState({
        status: 'error',
        errorMessage: 'تعذر تحميل البث الصوتي من المصدر الحالي. جرب قارئاً آخر أو تحقق من اتصالك.',
      });
    };

    const handleEnded = () => {
      const latest = useAudioStore.getState();

      // Sleep timer end-of-surah
      if (latest.sleepTimerEndOfSurah) {
        setSleepTimerEndOfSurah(false);
        setRuntimeState({ status: 'paused', currentTime: 0 });
        return;
      }

      // Repeat Ayah
      if (
        latest.repeatMode === 'ayah' &&
        latest.source?.kind === 'surah-stream' &&
        latest.source.clipStartSeconds !== undefined
      ) {
        primary.currentTime = latest.source.clipStartSeconds;
        syncRateFromStore();
        primary.play().catch(() => {});
        return;
      }

      // Repeat Surah
      if (latest.repeatMode === 'surah' && latest.source?.kind === 'surah-stream') {
        primary.currentTime = 0;
        syncRateFromStore();
        primary.play().catch(() => {});
        return;
      }

      // Next in queue
      if (latest.playNextFromQueue()) {
        return;
      }

      // Auto continue to next surah
      if (latest.autoContinue && latest.source?.kind === 'surah-stream') {
        nextTrack();
        return;
      }

      setRuntimeState({ status: 'paused', currentTime: 0 });
    };

    // Network online/offline event listeners
    const handleOnline = () => {
      setNetworkStatus('online');
      const latest = useAudioStore.getState();
      if (latest.status === 'error' && primaryRef.current && primaryRef.current.getAttribute('src')) {
        primaryRef.current.load();
        latest.togglePlayPause();
      }
    };
    const handleOffline = () => {
      setNetworkStatus('offline');
    };

    primary.addEventListener('playing', handlePlaying);
    primary.addEventListener('canplay', handleCanPlay);
    primary.addEventListener('waiting', handleWaiting);
    primary.addEventListener('timeupdate', handleTimeUpdate);
    primary.addEventListener('loadedmetadata', handleLoadedMetadata);
    primary.addEventListener('pause', handlePauseEvent);
    primary.addEventListener('error', handleError);
    primary.addEventListener('ended', handleEnded);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeunload', flushProgress);

    return () => {
      flushProgress();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      primary.pause();
      primary.removeAttribute('src');
      primary.removeEventListener('playing', handlePlaying);
      primary.removeEventListener('canplay', handleCanPlay);
      primary.removeEventListener('waiting', handleWaiting);
      primary.removeEventListener('timeupdate', handleTimeUpdate);
      primary.removeEventListener('loadedmetadata', handleLoadedMetadata);
      primary.removeEventListener('pause', handlePauseEvent);
      primary.removeEventListener('error', handleError);
      primary.removeEventListener('ended', handleEnded);

      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', flushProgress);
    };
  }, [setRuntimeState, nextTrack, resetRetryCount, incrementRetryCount, setNetworkStatus, setSleepTimerEndOfSurah]);

  // Load track: check offline CacheStorage first, otherwise stream from network
  useEffect(() => {
    let isCancelled = false;
    const audio = primaryRef.current;
    if (!audio) return;

    if (!source) {
      audio.pause();
      audio.removeAttribute('src');
      currentLoadedUrlRef.current = null;
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'none';
      }
      return;
    }

    async function resolveAndLoad() {
      let finalUrl = source?.streamUrl || '';

      // Check offline cached audio
      if (source?.kind === 'surah-stream') {
        const offlineUrl = await getOfflineAudioUrl(source.reciterId, source.surahNumber);
        if (offlineUrl && !isCancelled) {
          finalUrl = offlineUrl;
        }
      }

      if (isCancelled || !audio) return;

      if (currentLoadedUrlRef.current !== finalUrl) {
        currentLoadedUrlRef.current = finalUrl;
        audio.src = finalUrl;
        applyEffectiveRate(audio, source?.kind, playbackRate);
        audio.volume = muted ? 0 : volume;
        audio.load();
      } else if (
        useAudioStore.getState().pendingRestoreTime !== null &&
        Number.isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        const target = useAudioStore.getState().pendingRestoreTime!;
        const clamped = Math.min(target, Math.max(0, audio.duration - 0.25));
        audio.currentTime = clamped;
        useAudioStore.getState().clearPendingRestoreTime();
        setRuntimeState({ currentTime: clamped, duration: audio.duration });
      }

      if (status === 'loading' || status === 'playing') {
        applyEffectiveRate(audio, source?.kind, playbackRate);
        audio.play().catch(() => {
          setRuntimeState({ status: 'paused' });
        });
      } else if (status === 'paused') {
        audio.pause();
      }
    }

    resolveAndLoad();

    return () => {
      isCancelled = true;
    };
  }, [source, playRequestToken, status, playbackRate, volume, muted, setRuntimeState]);

  // Apply volume, mute, and playbackRate immediately
  useEffect(() => {
    const audio = primaryRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
    applyEffectiveRate(audio, source?.kind, playbackRate);
    syncMediaSessionPosition(audio);
  }, [volume, muted, playbackRate, source?.kind]);

  // Handle explicit seek requests
  useEffect(() => {
    const audio = primaryRef.current;
    if (!audio || seekRequest === null) return;
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const clamped = Math.min(seekRequest, audio.duration);
      audio.currentTime = clamped;
      useAudioStore.getState().persistPlaybackProgress(clamped, audio.duration);
      syncMediaSessionPosition(audio);
    }
    clearSeekRequest();
  }, [seekRequest, clearSeekRequest]);

  // Sleep timer preset countdown
  useEffect(() => {
    if (!sleepTimerEndsAt) return undefined;
    const id = window.setInterval(() => {
      if (Date.now() >= sleepTimerEndsAt) {
        pause();
        setSleepTimerMinutes(null);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [sleepTimerEndsAt, pause, setSleepTimerMinutes]);

  // Comprehensive System Lock Screen & OS Media Session controls
  useEffect(() => {
    if (!('mediaSession' in navigator) || !source) return undefined;

    let title = 'منصة يقين';
    let artist = 'القرآن الكريم';
    let album = 'منصة يقين — المصحف الشريف بالرسم العثماني';

    if (source.kind === 'surah-stream') {
      title =
        source.clipAyahNumber !== undefined
          ? `سورة ${source.surahName} — آية ${source.clipAyahNumber}`
          : `سورة ${source.surahName}`;
      artist = `القارئ الشيخ ${source.reciterName}`;
      album = 'القرآن الكريم تلاوة كاملة — يقين';
    } else if (source.kind === 'radio') {
      title = source.stationName;
      artist = `بث إذاعي مباشر — ${source.stationType}`;
      album = 'إذاعات القرآن الكريم — يقين';
    }

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        album,
        artwork: MEDIA_ARTWORK,
      });

      navigator.mediaSession.playbackState = status === 'playing' ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('stop', () => useAudioStore.getState().stop());

      // Seek backward 10 seconds
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const offset = details.seekOffset || 10;
        const cur = primaryRef.current?.currentTime || 0;
        requestSeek(Math.max(0, cur - offset));
      });

      // Seek forward 10 seconds
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const offset = details.seekOffset || 10;
        const cur = primaryRef.current?.currentTime || 0;
        const dur = primaryRef.current?.duration || cur + offset;
        requestSeek(Math.min(dur, cur + offset));
      });

      // SeekTo specific point on timeline
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && Number.isFinite(details.seekTime)) {
          requestSeek(details.seekTime);
        }
      });
    } catch {
      // Ignore MediaSession failures on legacy or unsupported environments
    }

    return undefined;
  }, [source, status, repeatMode, togglePlayPause, pause, prevTrack, nextTrack, requestSeek]);

  return null;
};

export default AudioEngine;
