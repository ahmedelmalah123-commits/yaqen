import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ExternalLink,
  Minimize2,
  Maximize2,
  Car,
  Activity,
  X,
} from 'lucide-react';
import { useAudioStore } from '../../store/useAudioStore';
import { stripSurahPrefix } from '../../lib/arabicSearch';

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const total = Math.floor(sec);
  const mins = Math.floor(total / 60);
  const secs = String(total % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

export const DesktopMiniPlayer: React.FC = () => {
  const source = useAudioStore((s) => s.source);
  const status = useAudioStore((s) => s.status);
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const volume = useAudioStore((s) => s.volume);
  const muted = useAudioStore((s) => s.muted);
  const isMiniPlayerOpen = useAudioStore((s) => s.isMiniPlayerOpen);
  const isDocumentPipActive = useAudioStore((s) => s.isDocumentPipActive);

  const togglePlayPause = useAudioStore((s) => s.togglePlayPause);
  const nextTrack = useAudioStore((s) => s.nextTrack);
  const prevTrack = useAudioStore((s) => s.prevTrack);
  const requestSeek = useAudioStore((s) => s.requestSeek);
  const setVolume = useAudioStore((s) => s.setVolume);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const setMiniPlayerOpen = useAudioStore((s) => s.setMiniPlayerOpen);
  const setCarModeOpen = useAudioStore((s) => s.setCarModeOpen);
  const setDiagnosticsOpen = useAudioStore((s) => s.setDiagnosticsOpen);
  const setDocumentPipActive = useAudioStore((s) => s.setDocumentPipActive);

  const [isHovered, setIsHovered] = useState(false);
  const pipWindowRef = useRef<Window | null>(null);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form fields
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        // Seek backward 5s in RTL
        requestSeek(Math.max(0, currentTime - 5));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        // Seek forward 5s in RTL
        requestSeek(Math.min(duration || currentTime + 5, currentTime + 5));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.05));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.05));
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'n' || e.key === 'N') {
        nextTrack();
      } else if (e.key === 'p' || e.key === 'P') {
        prevTrack();
      } else if (e.key === 'c' || e.key === 'C') {
        setCarModeOpen(true);
      } else if (e.key === 'd' || e.key === 'D') {
        setDiagnosticsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, currentTime, duration, requestSeek, volume, setVolume, toggleMute, nextTrack, prevTrack, setCarModeOpen, setDiagnosticsOpen]);

  // Document Picture-in-Picture API (Chromium 116+)
  const handleOpenDocumentPip = async () => {
    if (!('documentPictureInPicture' in window)) {
      alert('ميزة النافذة العائمة فوق التطبيقات (Document Picture-in-Picture) مدعومة في متصفح Chrome أو Edge الحديثين.');
      return;
    }

    try {
      // @ts-expect-error - Document Picture-in-Picture API standard
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 380,
        height: 260,
      });
      pipWindowRef.current = pipWindow;
      setDocumentPipActive(true);

      // Copy stylesheets
      Array.from(document.styleSheets).forEach((sheet) => {
        try {
          if (sheet.href) {
            const link = pipWindow.document.createElement('link');
            link.rel = 'stylesheet';
            link.href = sheet.href;
            pipWindow.document.head.appendChild(link);
          } else if (sheet.cssRules) {
            const style = pipWindow.document.createElement('style');
            Array.from(sheet.cssRules).forEach((rule) => {
              style.appendChild(pipWindow.document.createTextNode(rule.cssText));
            });
            pipWindow.document.head.appendChild(style);
          }
        } catch {
          // ignore CORS stylesheets
        }
      });

      pipWindow.document.body.className = document.body.className;
      pipWindow.document.body.dir = 'rtl';
      pipWindow.document.title = 'مشغل يقين القرآني العائم';

      pipWindow.addEventListener('pagehide', () => {
        setDocumentPipActive(false);
        pipWindowRef.current = null;
      });
    } catch (err) {
      console.error('Failed to open Picture-in-Picture window:', err);
    }
  };

  if (!source || (!isMiniPlayerOpen && !isHovered)) return null;

  const isPlaying = status === 'playing';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const title =
    source.kind === 'surah-stream'
      ? `سورة ${stripSurahPrefix(source.surahName)}`
      : source.stationName;
  const subtitle =
    source.kind === 'surah-stream'
      ? source.reciterName
      : source.stationType;

  return (
    <div
      role="region"
      aria-label="مشغل سطح المكتب المصغر"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hidden md:flex fixed bottom-24 left-6 z-40 w-80 glass-card rounded-3xl p-4 shadow-raised-lg border border-[var(--border-tactile)] flex-col gap-3 font-tajawal text-ink select-none transition-all duration-200"
      dir="rtl"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span className="flex items-center gap-1.5 font-bold text-glow text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>مشغل سطح المكتب</span>
        </span>

        <div className="flex items-center gap-1">
          {'documentPictureInPicture' in window && (
            <button
              type="button"
              onClick={handleOpenDocumentPip}
              title="نافذة عائمة فوق التطبيقات (Picture-in-Picture)"
              className="p-1 rounded-lg hover:bg-recessed text-ink-muted hover:text-ink transition-colors"
            >
              <ExternalLink size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setCarModeOpen(true)}
            title="وضع القيادة (Car Mode)"
            className="p-1 rounded-lg hover:bg-recessed text-ink-muted hover:text-ink transition-colors"
          >
            <Car size={14} />
          </button>
          <button
            type="button"
            onClick={() => setDiagnosticsOpen(true)}
            title="فحص جودة البث (Diagnostics)"
            className="p-1 rounded-lg hover:bg-recessed text-ink-muted hover:text-ink transition-colors"
          >
            <Activity size={14} />
          </button>
          <button
            type="button"
            onClick={() => setMiniPlayerOpen(false)}
            title="إغلاق المشغل المصغر"
            className="p-1 rounded-lg hover:bg-recessed text-ink-muted hover:text-ink transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Main Track Row with Audio Artwork */}
      <div className="flex items-center gap-3">
        <img
          src="/audio-artwork-128.png"
          alt="شعار يقين الصوتي"
          className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-sm border border-white/10"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-black font-cairo truncate text-ink">
            {title}
          </h4>
          <p className="text-xs text-ink-secondary truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Progress Bar & Time */}
      <div className="flex flex-col gap-1">
        <div
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          onClick={(e) => {
            if (duration <= 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            // RTL calculation: right edge is 0%
            const clickPos = rect.right - e.clientX;
            const pct = Math.max(0, Math.min(1, clickPos / rect.width));
            requestSeek(pct * duration);
          }}
          className="w-full h-1.5 rounded-full bg-recessed cursor-pointer relative overflow-hidden group"
        >
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-ink-muted font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Player Transport Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={toggleMute}
          title={muted ? 'إلغاء الكتم' : 'كتم الصوت'}
          className="p-1.5 rounded-full text-ink-secondary hover:text-ink"
        >
          {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={nextTrack}
            title="السابق (N)"
            className="p-2 rounded-full tactile-pill text-ink hover:text-glow active:scale-95 transition-all"
          >
            <SkipBack size={16} />
          </button>
          <button
            type="button"
            onClick={togglePlayPause}
            title="تشغيل / إيقاف (مسافة)"
            className="p-3 rounded-full bg-ink text-stage hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
          </button>
          <button
            type="button"
            onClick={prevTrack}
            title="التالي (P)"
            className="p-2 rounded-full tactile-pill text-ink hover:text-glow active:scale-95 transition-all"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <span className="text-[10px] font-mono text-ink-muted">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};

export default DesktopMiniPlayer;

