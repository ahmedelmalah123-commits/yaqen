import React, { useEffect, useRef } from 'react';
import { useAudioStore } from '../../store/useAudioStore';

function getActiveTrackUrl(source: ReturnType<typeof useAudioStore.getState>['source']): string | null {
  if (!source) return null;
  return source.streamUrl || null;
}

function applyEffectiveRate(
  audio: HTMLAudioElement,
  sourceKind: string | undefined,
  rate: number
) {
  const effective = sourceKind === 'radio' ? 1 : rate;
  audio.defaultPlaybackRate = effective;
  audio.playbackRate = effective;
}

/**
 * Singleton background audio engine mounted once at root level.
 * Plays continuous full-surah streams and live radio broadcasts, preserving
 * playback rate, position restore, optional timed clip bounds, and MediaSession controls.
 */
export const AudioEngine: React.FC = () => {
  const source = useAudioStore((s) => s.source);
  const status = useAudioStore((s) => s.status);
  const volume = useAudioStore((s) => s.volume);
  const muted = useAudioStore((s) => s.muted);
  const playbackRate = useAudioStore((s) => s.playbackRate);
  const repeatMode = useAudioStore((s) => s.repeatMode);
  const sleepTimerEndsAt = useAudioStore((s) => s.sleepTimerEndsAt);
  const seekRequest = useAudioStore((s) => s.seekRequest);
  const playRequestToken = useAudioStore((s) => s.playRequestToken);

  const setRuntimeState = useAudioStore((s) => s.setRuntimeState);
  const clearSeekRequest = useAudioStore((s) => s.clearSeekRequest);
  const nextTrack = useAudioStore((s) => s.nextTrack);
  const prevTrack = useAudioStore((s) => s.prevTrack);
  const togglePlayPause = useAudioStore((s) => s.togglePlayPause);
  const pause = useAudioStore((s) => s.pause);
  const setSleepTimerMinutes = useAudioStore((s) => s.setSleepTimerMinutes);

  const primaryRef = useRef<HTMLAudioElement | null>(null);
  const currentLoadedUrlRef = useRef<string | null>(null);
  const lastSavedTickRef = useRef<number>(0);
  const statusRef = useRef(status);
  statusRef.current = status;

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
      syncRateFromStore();
      setRuntimeState({ status: 'playing', errorMessage: null });
    };

    const handleCanPlay = () => {
      syncRateFromStore();
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

      const nowMs = Date.now();
      if (nowMs - lastSavedTickRef.current >= 1500) {
        lastSavedTickRef.current = nowMs;
        latest.persistPlaybackProgress(nowTime, nowDuration);
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
    };

    const handlePauseEvent = () => {
      flushProgress();
    };

    const handleError = () => {
      if (!primary.getAttribute('src')) return;
      setRuntimeState({
        status: 'error',
        errorMessage: 'تعذر تحميل البث الصوتي من المصدر الحالي. جرب مصدراً أو قارئاً آخر.',
      });
    };

    const handleEnded = () => {
      const latest = useAudioStore.getState();

      if (latest.repeatMode === 'ayah' && latest.source?.kind === 'surah-stream' && latest.source.clipStartSeconds !== undefined) {
        primary.currentTime = latest.source.clipStartSeconds;
        syncRateFromStore();
        primary.play().catch(() => {});
        return;
      }

      if (latest.repeatMode === 'surah' && latest.source?.kind === 'surah-stream') {
        primary.currentTime = 0;
        syncRateFromStore();
        primary.play().catch(() => {});
        return;
      }

      if (!latest.playNextFromQueue()) {
        setRuntimeState({ status: 'paused', currentTime: 0 });
      }
    };

    primary.addEventListener('playing', handlePlaying);
    primary.addEventListener('canplay', handleCanPlay);
    primary.addEventListener('waiting', handleWaiting);
    primary.addEventListener('timeupdate', handleTimeUpdate);
    primary.addEventListener('loadedmetadata', handleLoadedMetadata);
    primary.addEventListener('pause', handlePauseEvent);
    primary.addEventListener('error', handleError);
    primary.addEventListener('ended', handleEnded);
    window.addEventListener('beforeunload', flushProgress);

    return () => {
      flushProgress();
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
      window.removeEventListener('beforeunload', flushProgress);
    };
  }, [setRuntimeState]);

  // Load track when URL changes & drive play/pause state
  useEffect(() => {
    const audio = primaryRef.current;
    if (!audio) return;

    const url = getActiveTrackUrl(source);
    if (!url) {
      audio.pause();
      audio.removeAttribute('src');
      currentLoadedUrlRef.current = null;
      return;
    }

    if (currentLoadedUrlRef.current !== url) {
      currentLoadedUrlRef.current = url;
      audio.src = url;
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
  }, [source, playRequestToken, status, playbackRate, volume, muted, setRuntimeState]);

  // Apply volume, mute, and playbackRate immediately whenever preferences change
  useEffect(() => {
    const audio = primaryRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
    applyEffectiveRate(audio, source?.kind, playbackRate);
  }, [volume, muted, playbackRate, source?.kind]);

  // Handle explicit seek requests
  useEffect(() => {
    const audio = primaryRef.current;
    if (!audio || seekRequest === null) return;
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const clamped = Math.min(seekRequest, audio.duration);
      audio.currentTime = clamped;
      useAudioStore.getState().persistPlaybackProgress(clamped, audio.duration);
    }
    clearSeekRequest();
  }, [seekRequest, clearSeekRequest]);

  // Sleep timer countdown enforcement
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

  // Sync MediaSession metadata & OS media keys
  useEffect(() => {
    if (!('mediaSession' in navigator) || !source) return undefined;

    let title = 'منصة يقين';
    let artist = 'القرآن الكريم';

    if (source.kind === 'surah-stream') {
      title =
        source.clipAyahNumber !== undefined
          ? `سورة ${source.surahName} — آية ${source.clipAyahNumber}`
          : `سورة ${source.surahName}`;
      artist = source.reciterName;
    } else if (source.kind === 'radio') {
      title = source.stationName;
      artist = `بث مباشر — ${source.stationType}`;
    }

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        album: 'منصة يقين الإسلامية',
        artwork: [{ src: '/logo.png', sizes: '512x512', type: 'image/png' }],
      });
      navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
    } catch {
      // Ignore MediaSession failures on unsupported webviews
    }

    return undefined;
  }, [source, status, repeatMode, togglePlayPause, pause, prevTrack, nextTrack]);

  return null;
};

export default AudioEngine;
