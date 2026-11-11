import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Wifi,
  HardDrive,
  Radio,
  Clock,
  Volume2,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useAudioStore } from '../../store/useAudioStore';

export const AudioDiagnosticsModal: React.FC = () => {
  const isDiagnosticsOpen = useAudioStore((s) => s.isDiagnosticsOpen);
  const setDiagnosticsOpen = useAudioStore((s) => s.setDiagnosticsOpen);
  const source = useAudioStore((s) => s.source);
  const status = useAudioStore((s) => s.status);
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const playbackRate = useAudioStore((s) => s.playbackRate);
  const repeatMode = useAudioStore((s) => s.repeatMode);
  const networkStatus = useAudioStore((s) => s.networkStatus);
  const lowDataMode = useAudioStore((s) => s.lowDataMode);

  const [pingResult, setPingResult] = useState<{
    status: number | string;
    latencyMs: number;
    checkedAt: string;
  } | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  if (!isDiagnosticsOpen) return null;

  const handlePingStream = async () => {
    if (!source?.streamUrl) return;
    setIsPinging(true);
    const start = performance.now();
    try {
      const res = await fetch(source.streamUrl, { method: 'HEAD', mode: 'no-cors' });
      const latency = Math.round(performance.now() - start);
      setPingResult({
        status: res.status || 'OK (CORS Opaque)',
        latencyMs: latency,
        checkedAt: new Date().toLocaleTimeString('ar-EG'),
      });
    } catch (err: unknown) {
      const latency = Math.round(performance.now() - start);
      setPingResult({
        status: 'تعذر الاتصال بالمصدر الخارجي',
        latencyMs: latency,
        checkedAt: new Date().toLocaleTimeString('ar-EG'),
      });
    } finally {
      setIsPinging(false);
    }
  };

  const hasMediaSession = typeof window !== 'undefined' && 'mediaSession' in navigator;
  const hasCacheStorage = typeof window !== 'undefined' && 'caches' in window;
  const hasIndexedDB = typeof window !== 'undefined' && 'indexedDB' in window;
  const hasWakeLock = typeof window !== 'undefined' && 'wakeLock' in navigator;
  const hasDocPip = typeof window !== 'undefined' && 'documentPictureInPicture' in window;

  // @ts-expect-error - navigator.connection is experimental
  const conn = navigator.connection;
  const effectiveType = conn?.effectiveType || 'غير متاح';
  const downlink = conn?.downlink ? `${conn.downlink} Mbps` : 'غير متاح';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="لوحة فحص جودة وتشخيص الصوت"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setDiagnosticsOpen(false)}
      dir="rtl"
    >
      <div
        className="w-full max-w-xl max-h-[85vh] bg-stage border border-[var(--border-tactile)] rounded-3xl p-6 shadow-2xl flex flex-col gap-4 font-tajawal text-ink overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-tactile)]">
          <div className="flex items-center gap-2.5">
            <Activity size={22} className="text-glow animate-pulse" />
            <div>
              <h3 className="text-lg font-black font-cairo">فحص جودة البث والصوتيات</h3>
              <p className="text-[11px] text-ink-muted">معلومات تشخيصية مباشرة للمشغل واتصال النظام</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDiagnosticsOpen(false)}
            className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-muted hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Stream Health */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-muted">المصدر الصوتي النشط:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                status === 'playing'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : status === 'loading'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-zinc-500/20 text-zinc-400'
              }`}
            >
              حالة التشغيل: {status}
            </span>
          </div>

          {source ? (
            <div className="flex flex-col gap-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-sans font-bold text-ink">
                  {source.kind === 'surah-stream'
                    ? `سورة ${source.surahName} (${source.reciterName})`
                    : source.stationName}
                </span>
                <span className="text-[11px] text-ink-muted">النوع: {source.kind}</span>
              </div>
              <p className="text-[11px] text-ink-muted truncate" title={source.streamUrl}>
                الرابط: {source.streamUrl}
              </p>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span>الموضع: {Math.floor(currentTime)} ثانية / {Math.floor(duration)} ثانية</span>
                <span>السرعة: {playbackRate}x · التكرار: {repeatMode}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-ink-muted">لا يوجد تلاوة مشغلة حالياً.</p>
          )}

          {source && (
            <div className="pt-2 border-t border-[var(--border-tactile)] flex items-center justify-between">
              <button
                type="button"
                onClick={handlePingStream}
                disabled={isPinging}
                className="tactile-pill px-3 py-1.5 rounded-xl text-xs font-bold text-glow hover:bg-emerald-500/20 flex items-center gap-1.5"
              >
                <RotateCcw size={13} className={isPinging ? 'animate-spin' : ''} />
                <span>{isPinging ? 'جاري الفحص...' : 'فحص استجابة الرابط (Ping)'}</span>
              </button>

              {pingResult && (
                <div className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <span>زمن الاستجابة: {pingResult.latencyMs}ms</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Operating System & Browser Capabilities Matrix */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-stage border border-[var(--border-tactile)] flex items-center justify-between">
            <span>Media Session (شاشة القفل):</span>
            {hasMediaSession ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                <CheckCircle2 size={14} />
                <span>مدعوم</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-500 text-[11px]">
                <XCircle size={14} />
                <span>غير مدعوم</span>
              </span>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-stage border border-[var(--border-tactile)] flex items-center justify-between">
            <span>التخزين بدون إنترنت (Cache API):</span>
            {hasCacheStorage ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                <CheckCircle2 size={14} />
                <span>مدعوم</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-500 text-[11px]">
                <XCircle size={14} />
                <span>غير مدعوم</span>
              </span>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-stage border border-[var(--border-tactile)] flex items-center justify-between">
            <span>منع إغلاق الشاشة (WakeLock):</span>
            {hasWakeLock ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                <CheckCircle2 size={14} />
                <span>مدعوم</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-500 text-[11px]">
                <XCircle size={14} />
                <span>غير مدعوم</span>
              </span>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-stage border border-[var(--border-tactile)] flex items-center justify-between">
            <span>النافذة العائمة (Picture-in-Picture):</span>
            {hasDocPip ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                <CheckCircle2 size={14} />
                <span>مدعوم</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-500 text-[11px]">
                <XCircle size={14} />
                <span>فيديو PiP فقط</span>
              </span>
            )}
          </div>
        </div>

        {/* Network & Efficiency Stats */}
        <div className="recessed-well p-3.5 rounded-2xl flex flex-col gap-2 text-xs">
          <span className="font-bold text-ink">حالة الشبكة واستهلاك البيانات:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-ink-secondary">
            <div>
              <span>الاتصال بالإنترنت: </span>
              <strong className={navigator.onLine ? 'text-emerald-400' : 'text-red-400'}>
                {navigator.onLine ? 'متصل' : 'غير متصل'}
              </strong>
            </div>
            <div>
              <span>جودة الشبكة: </span>
              <strong className="text-ink font-mono">{effectiveType}</strong>
            </div>
            <div>
              <span>وضع توفير البيانات: </span>
              <strong className={lowDataMode ? 'text-amber-400' : 'text-ink'}>
                {lowDataMode ? 'مفعل' : 'معطل'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioDiagnosticsModal;

