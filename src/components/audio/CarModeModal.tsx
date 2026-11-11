import React, { useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  X,
  Radio as RadioIcon,
  Volume2,
} from 'lucide-react';
import { useAudioStore } from '../../store/useAudioStore';
import { stripSurahPrefix } from '../../lib/arabicSearch';

function formatCarTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = String(total % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

export const CarModeModal: React.FC = () => {
  const isCarModeOpen = useAudioStore((s) => s.isCarModeOpen);
  const setCarModeOpen = useAudioStore((s) => s.setCarModeOpen);
  const source = useAudioStore((s) => s.source);
  const status = useAudioStore((s) => s.status);
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);

  const togglePlayPause = useAudioStore((s) => s.togglePlayPause);
  const nextTrack = useAudioStore((s) => s.nextTrack);
  const prevTrack = useAudioStore((s) => s.prevTrack);
  const requestSeek = useAudioStore((s) => s.requestSeek);

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Request Screen Wake Lock when Car Mode is active to keep phone display on
  useEffect(() => {
    if (!isCarModeOpen) {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
      return undefined;
    }

    async function requestLock() {
      if ('wakeLock' in navigator && navigator.wakeLock.request) {
        try {
          const lock = await navigator.wakeLock.request('screen');
          wakeLockRef.current = lock;
        } catch {
          // Wake lock unavailable or denied
        }
      }
    }

    requestLock();

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [isCarModeOpen]);

  if (!isCarModeOpen) return null;

  const isPlaying = status === 'playing';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const title =
    source?.kind === 'surah-stream'
      ? `سورة ${stripSurahPrefix(source.surahName)}`
      : source?.kind === 'radio'
      ? source.stationName
      : 'لا يوجد تلاوة نشطة';

  const subtitle =
    source?.kind === 'surah-stream'
      ? `القارئ ${source.reciterName}`
      : source?.kind === 'radio'
      ? source.stationType
      : 'اختر سورة أو إذاعة للبدء';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="وضع القيادة والسيارة"
      className="fixed inset-0 z-50 bg-[#070A08] text-white flex flex-col justify-between p-6 sm:p-10 select-none font-tajawal"
      dir="rtl"
    >
      {/* Top Bar: Brand, Exit Button */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <img
            src="/audio-artwork-96.png"
            alt="يقين"
            className="w-10 h-10 rounded-xl border border-white/15"
          />
          <div>
            <span className="text-xs font-bold text-emerald-400 tracking-wider block">
              وضع القيادة الآمن
            </span>
            <span className="text-sm text-zinc-400">تحكم مبسط وأزرار مكبرة</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCarModeOpen(false)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-base transition-all"
        >
          <X size={20} />
          <span>خروج</span>
        </button>
      </div>

      {/* Middle Section: Big Calligraphy Artwork + Track Info */}
      <div className="flex flex-col items-center justify-center text-center my-auto gap-4">
        <div className="relative">
          <img
            src="/audio-artwork-512.png"
            alt="شعار يقين الصوتي"
            className="w-36 h-36 sm:w-48 sm:h-48 rounded-3xl shadow-2xl border-2 border-emerald-500/30 object-cover"
          />
          {isPlaying && (
            <span className="absolute -bottom-2 -left-2 px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-black animate-pulse">
              تشغيل مباشر
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 max-w-xl">
          <h2 className="text-2xl sm:text-4xl font-black font-cairo text-white leading-tight">
            {title}
          </h2>
          <p className="text-lg sm:text-2xl font-semibold text-emerald-400">
            {subtitle}
          </p>
        </div>

        {/* Progress Bar & Big Digits */}
        {duration > 0 && (
          <div className="w-full max-w-xl flex flex-col gap-2 mt-2">
            <div className="w-full h-3 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-base font-mono text-zinc-400 font-bold">
              <span>{formatCarTime(currentTime)}</span>
              <span>{formatCarTime(duration)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls: Huge 72px+ touch targets */}
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        {/* Quick 15s Rewind / Forward */}
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => requestSeek(Math.max(0, currentTime - 15))}
            aria-label="تقديم 15 ثانية"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-zinc-300 font-bold text-sm"
          >
            <RotateCcw size={18} />
            <span>-١٥ث</span>
          </button>
          <button
            type="button"
            onClick={() => requestSeek(Math.min(duration || currentTime + 15, currentTime + 15))}
            aria-label="تأخير 15 ثانية"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-zinc-300 font-bold text-sm"
          >
            <RotateCw size={18} />
            <span>+١٥ث</span>
          </button>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <button
            type="button"
            onClick={nextTrack}
            aria-label="السورة السابقة"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all shadow-lg"
          >
            <SkipBack size={36} />
          </button>

          <button
            type="button"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 flex items-center justify-center text-black transition-all shadow-2xl"
          >
            {isPlaying ? (
              <Pause size={48} className="text-black" />
            ) : (
              <Play size={48} className="translate-x-1 text-black" />
            )}
          </button>

          <button
            type="button"
            onClick={prevTrack}
            aria-label="السورة التالية"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all shadow-lg"
          >
            <SkipForward size={36} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarModeModal;

