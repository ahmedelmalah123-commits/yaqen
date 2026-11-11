import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Moon,
  ChevronUp,
  ChevronDown,
  X,
  ListMusic,
  Loader2,
  Radio as RadioIcon,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import {
  useAudioStore,
  getAllowedRepeatModes,
  normalizeRepeatMode,
} from '../../store/useAudioStore';
import { stripSurahPrefix, toArabicDigits } from '../../lib/arabicSearch';

function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = String(total % 60).padStart(2, '0');
  if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${secs}`;
  return `${mins}:${secs}`;
}

export const GlobalAudioPlayer: React.FC = () => {
  const source = useAudioStore((s) => s.source);
  const status = useAudioStore((s) => s.status);
  const errorMessage = useAudioStore((s) => s.errorMessage);
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const volume = useAudioStore((s) => s.volume);
  const muted = useAudioStore((s) => s.muted);
  const playbackRate = useAudioStore((s) => s.playbackRate);
  const repeatMode = useAudioStore((s) => s.repeatMode);
  const sleepTimerEndsAt = useAudioStore((s) => s.sleepTimerEndsAt);
  const selectedSleepMinutes = useAudioStore((s) => s.selectedSleepMinutes);
  const pendingRestoreTime = useAudioStore((s) => s.pendingRestoreTime);
  const isExpanded = useAudioStore((s) => s.isExpanded);
  const queue = useAudioStore((s) => s.queue);

  const togglePlayPause = useAudioStore((s) => s.togglePlayPause);
  const stop = useAudioStore((s) => s.stop);
  const nextTrack = useAudioStore((s) => s.nextTrack);
  const prevTrack = useAudioStore((s) => s.prevTrack);
  const requestSeek = useAudioStore((s) => s.requestSeek);
  const setVolume = useAudioStore((s) => s.setVolume);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const setPlaybackRate = useAudioStore((s) => s.setPlaybackRate);
  const cycleRepeatMode = useAudioStore((s) => s.cycleRepeatMode);
  const setSleepTimerMinutes = useAudioStore((s) => s.setSleepTimerMinutes);
  const setExpanded = useAudioStore((s) => s.setExpanded);
  const removeQueueItem = useAudioStore((s) => s.removeQueueItem);
  const clearQueue = useAudioStore((s) => s.clearQueue);

  const [sleepRemainingMin, setSleepRemainingMin] = useState<number | null>(null);

  useEffect(() => {
    if (!sleepTimerEndsAt) {
      setSleepRemainingMin(null);
      return undefined;
    }
    const update = () => {
      const rem = Math.max(1, Math.ceil((sleepTimerEndsAt - Date.now()) / 60_000));
      setSleepRemainingMin(rem);
    };
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, [sleepTimerEndsAt]);

  if (!source) return null;

  const isRadio = source.kind === 'radio';
  const isSurahStream = source.kind === 'surah-stream';
  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const allowedRepeats = getAllowedRepeatModes(source);
  const effectiveRepeat = normalizeRepeatMode(repeatMode, source);

  let primaryTitle = '';
  let secondaryTitle = '';
  let linkTo = '/quran';

  if (source.kind === 'surah-stream') {
    primaryTitle =
      source.clipAyahNumber !== undefined
        ? `سورة ${stripSurahPrefix(source.surahName)} · آية ${toArabicDigits(source.clipAyahNumber)}`
        : `سورة ${stripSurahPrefix(source.surahName)}`;
    secondaryTitle =
      source.clipAyahNumber !== undefined
        ? `${source.reciterName} · مقطع من التلاوة الكاملة`
        : `${source.reciterName} · تلاوة كاملة`;
    linkTo =
      source.clipAyahNumber !== undefined
        ? `/surah/${source.surahNumber}?ayah=${source.clipAyahNumber}`
        : `/surah/${source.surahNumber}`;
  } else if (source.kind === 'radio') {
    primaryTitle = source.stationName;
    secondaryTitle = `بث مباشر · ${source.stationType}`;
    linkTo = `/radio?station=${source.stationId}`;
  }

  const isClip =
    isSurahStream &&
    source.clipStartSeconds !== undefined &&
    source.clipEndSeconds !== undefined;
  const clipDuration = isClip
    ? Math.max(0, source.clipEndSeconds! - source.clipStartSeconds!)
    : duration;
  const clipCurrentTime = isClip
    ? Math.max(0, Math.min(currentTime - source.clipStartSeconds!, clipDuration))
    : currentTime;

  const displayCurrentTime = isClip ? clipCurrentTime : currentTime;
  const displayDuration = isClip ? clipDuration : duration;

  if (!isRadio && status === 'paused' && currentTime > 0) {
    secondaryTitle = `${secondaryTitle} · ${
      pendingRestoreTime !== null ? 'الزمن المحفوظ' : 'توقف عند'
    } ${formatAudioTime(displayCurrentTime)}`;
  }

  const progressPercent =
    !isRadio && displayDuration > 0
      ? Math.min(100, (displayCurrentTime / displayDuration) * 100)
      : 0;

  const disablePrev = isSurahStream ? source.surahNumber <= 1 && source.clipStartSeconds === undefined : true;
  const disableNext = isSurahStream
    ? source.surahNumber >= 114 && queue.length === 0
    : queue.length === 0;

  return (
    <div
      aria-label="المشغل الصوتي العام"
      className="fixed bottom-[76px] lg:bottom-4 left-3 right-3 lg:left-24 lg:right-[268px] z-40 pointer-events-none"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto pointer-events-auto glass-card rounded-[24px] p-3 sm:px-4 sm:py-3 flex flex-col gap-3">
        {/* Expanded Controls Drawer inside Player */}
        {isExpanded && (
          <div className="pb-3 border-b border-[var(--glass-border-subtle)] flex flex-col gap-3">
            {status === 'error' && errorMessage && (
              <div className="recessed-box px-3.5 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 flex items-center justify-between gap-2">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="tactile-pill px-3 py-1 text-[11px] font-bold text-ink hover:text-glow flex items-center gap-1 shrink-0"
                >
                  <RotateCcw size={12} />
                  <span>إعادة المحاولة</span>
                </button>
              </div>
            )}

            {/* Seek Timeline */}
            {!isRadio && (
              <div className="flex items-center gap-3 text-xs font-mono text-ink-secondary" dir="ltr">
                <span className="w-14 text-right">{formatAudioTime(displayCurrentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={displayDuration > 0 ? displayDuration : 100}
                  step={0.5}
                  value={displayDuration > 0 ? Math.min(displayCurrentTime, displayDuration) : 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (isClip) {
                      requestSeek(source.clipStartSeconds! + Math.min(val, clipDuration));
                    } else {
                      requestSeek(val);
                    }
                  }}
                  aria-label="التمرير الزمني للتلاوة"
                  className="flex-1 accent-[var(--accent-glow)] cursor-pointer h-1.5"
                />
                <span className="w-14 text-left">{formatAudioTime(displayDuration)}</span>
              </div>
            )}

            {/* Speed, Repeat, Sleep, Volume */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Speed controls */}
                {!isRadio && (
                  <div className="recessed-well p-1 flex items-center gap-1">
                    {[0.75, 1, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setPlaybackRate(rate)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                          playbackRate === rate
                            ? 'tactile-pill text-glow'
                            : 'text-ink-secondary hover:text-ink'
                        }`}
                        title={`سرعة التلاوة ${rate}x`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}

                {/* Repeat toggle (hidden on live streams & scoped per playback mode) */}
                {allowedRepeats.length > 1 && (
                  <button
                    type="button"
                    onClick={cycleRepeatMode}
                    aria-label="تبديل وضع التكرار"
                    className={`tactile-pill px-3 py-1.5 text-[11px] font-bold flex items-center gap-1.5 ${
                      effectiveRepeat !== 'none'
                        ? 'active-ayah-glow text-glow'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                    title={
                      source.kind === 'surah-stream' && source.clipAyahNumber !== undefined
                        ? 'متاح: بلا تكرار أو تكرار المقطع'
                        : 'متاح: بلا تكرار أو تكرار السورة'
                    }
                  >
                    {effectiveRepeat === 'ayah' ? <Repeat1 size={14} /> : <Repeat size={14} />}
                    <span>
                      {effectiveRepeat === 'none'
                        ? 'بلا تكرار'
                        : effectiveRepeat === 'ayah'
                        ? 'تكرار الآية'
                        : 'تكرار السورة'}
                    </span>
                  </button>
                )}

                {/* Sleep timer presets */}
                <div className="recessed-well p-1 flex items-center gap-1" role="group" aria-label="مؤقت النوم">
                  <span className="px-2 text-[11px] text-ink-muted flex items-center gap-1">
                    <Moon size={12} />
                    {sleepRemainingMin ? `${toArabicDigits(sleepRemainingMin)}د` : 'مؤقت'}
                  </span>
                  {[null, 15, 30, 60].map((mins) => {
                    const isActive =
                      mins === null
                        ? !sleepTimerEndsAt
                        : Boolean(sleepTimerEndsAt) && selectedSleepMinutes === mins;
                    return (
                      <button
                        key={String(mins)}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setSleepTimerMinutes(mins)}
                        className={`px-2 py-1 rounded-full text-[11px] font-bold transition-all ${
                          isActive
                            ? mins === null
                              ? 'tactile-pill text-ink'
                              : 'tactile-pill active-ayah-glow text-glow'
                            : 'text-ink-secondary hover:text-ink'
                        }`}
                      >
                        {mins === null ? 'إيقاف' : `${toArabicDigits(mins)}د`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 min-w-[140px]" dir="ltr">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? 'إلغاء الكتم' : 'كتم الصوت'}
                  className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
                >
                  {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  aria-label="مستوى الصوت"
                  className="w-24 accent-[var(--accent-glow)] cursor-pointer h-1.5"
                />
              </div>
            </div>

            {/* Active Queue */}
            {queue.length > 0 && (
              <div className="recessed-box p-2.5 flex flex-col gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between text-[11px] font-bold text-ink-muted px-1">
                  <span className="flex items-center gap-1">
                    <ListMusic size={13} className="text-glow" />
                    قائمة الانتظار ({toArabicDigits(queue.length)})
                  </span>
                  <button
                    type="button"
                    onClick={clearQueue}
                    className="hover:text-red-500 transition-colors"
                  >
                    مسح القائمة
                  </button>
                </div>
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 px-2 py-1 rounded-xl bg-elevated/60 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-ink truncate block">{item.label}</span>
                      <span className="text-[10px] text-ink-muted truncate block">{item.subtitle}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQueueItem(item.id)}
                      aria-label="إزالة من القائمة"
                      className="text-ink-muted hover:text-red-500 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compact Control Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Active Track Info */}
          <Link to={linkTo} className="flex items-center gap-3 min-w-0 group flex-1">
            <div className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center shrink-0 text-glow relative">
              {isRadio ? <RadioIcon size={17} /> : <ListMusic size={17} />}
              {isPlaying && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full amber-glow-dot animate-pulse" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold font-cairo text-ink group-hover:text-glow transition-colors truncate">
                  {primaryTitle}
                </span>
                {isRadio && (
                  <span className="px-2 py-0.5 rounded-full bg-glow-soft text-glow text-[10px] font-bold shrink-0">
                    مباشر
                  </span>
                )}
              </div>
              <span className="text-[11px] text-ink-secondary truncate block">
                {status === 'error' ? 'خطأ في التشغيل' : secondaryTitle}
              </span>
            </div>
          </Link>

          {/* Transport Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isSurahStream && (
              <button
                type="button"
                onClick={prevTrack}
                disabled={disablePrev}
                aria-label="السورة السابقة"
                title="السورة السابقة"
                className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <SkipForward size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              className={`w-10 h-10 rounded-full tactile-pill flex items-center justify-center transition-all ${
                isPlaying ? 'active-ayah-glow text-glow' : 'text-ink hover:text-glow'
              }`}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin text-glow" />
              ) : isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" />
              )}
            </button>

            {(isSurahStream || queue.length > 0) && (
              <button
                type="button"
                onClick={nextTrack}
                disabled={disableNext}
                aria-label={queue.length > 0 ? 'التالي في قائمة الانتظار' : 'السورة التالية'}
                title={queue.length > 0 ? 'التالي' : 'السورة التالية'}
                className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <SkipBack size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={() => setExpanded(!isExpanded)}
              aria-label={isExpanded ? 'تصغير المشغل' : 'توسيع المشغل'}
              className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
            >
              {isExpanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
            </button>

            <button
              type="button"
              onClick={stop}
              aria-label="إغلاق المشغل"
              className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-red-500"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Thin compact progress line when collapsed */}
        {!isExpanded && !isRadio && duration > 0 && (
          <div className="recessed-well h-1 overflow-hidden">
            <div
              className="h-full amber-glow-dot transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalAudioPlayer;
