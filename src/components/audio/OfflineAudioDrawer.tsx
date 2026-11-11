import React, { useEffect, useState } from 'react';
import {
  Download,
  Trash2,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Play,
  X,
  RefreshCw,
  Loader2,
  WifiOff,
} from 'lucide-react';
import { useAudioStore } from '../../store/useAudioStore';
import {
  listOfflineSurahs,
  deleteOfflineSurah,
  downloadSurahAudio,
  clearAllOfflineAudio,
  getStorageUsageEstimate,
  formatBytes,
  OfflineSurahRecord,
} from '../../lib/offlineAudio';
import { stripSurahPrefix } from '../../lib/arabicSearch';

export const OfflineAudioDrawer: React.FC = () => {
  const isOfflineDrawerOpen = useAudioStore((s) => s.isOfflineDrawerOpen);
  const setOfflineDrawerOpen = useAudioStore((s) => s.setOfflineDrawerOpen);
  const source = useAudioStore((s) => s.source);
  const playSurahStream = useAudioStore((s) => s.playSurahStream);

  const [downloads, setDownloads] = useState<OfflineSurahRecord[]>([]);
  const [storage, setStorage] = useState<{ usedBytes: number; quotaBytes: number; percentage: number }>({
    usedBytes: 0,
    quotaBytes: 0,
    percentage: 0,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const refreshList = async () => {
    try {
      const list = await listOfflineSurahs();
      setDownloads(list);
      const st = await getStorageUsageEstimate();
      setStorage(st);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (isOfflineDrawerOpen) {
      refreshList();
    }
  }, [isOfflineDrawerOpen]);

  const handleDownloadCurrent = async () => {
    if (!source || source.kind !== 'surah-stream') return;
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadMessage(null);

    try {
      await downloadSurahAudio({
        surahNumber: source.surahNumber,
        surahName: source.surahName,
        reciterId: source.reciterId,
        reciterName: source.reciterName,
        streamUrl: source.streamUrl,
        onProgress: (pct) => setDownloadProgress(pct),
      });
      setDownloadMessage('تم تحميل السورة بنجاح في الذاكرة المحلية.');
      await refreshList();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر تحميل الملف الصوتي.';
      setDownloadMessage(msg);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async (reciterId: string, surahNumber: number) => {
    await deleteOfflineSurah(reciterId, surahNumber);
    await refreshList();
  };

  const handleClearAll = async () => {
    if (window.confirm('هل أنت متأكد من حذف جميع السور المحملة بدون إنترنت؟')) {
      await clearAllOfflineAudio();
      await refreshList();
    }
  };

  if (!isOfflineDrawerOpen) return null;

  const currentIsDownloaded =
    source?.kind === 'surah-stream' &&
    downloads.some(
      (d) => d.surahNumber === source.surahNumber && d.reciterId === source.reciterId
    );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="إدارة الاستماع بدون إنترنت"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
      onClick={() => setOfflineDrawerOpen(false)}
      dir="rtl"
    >
      <div
        className="w-full max-w-md h-full bg-stage border-r border-[var(--border-tactile)] p-5 flex flex-col gap-4 shadow-2xl overflow-y-auto font-tajawal text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-tactile)]">
          <div className="flex items-center gap-2">
            <HardDrive size={20} className="text-glow" />
            <h3 className="text-lg font-black font-cairo">التلاوات المحملة (بدون إنترنت)</h3>
          </div>
          <button
            type="button"
            onClick={() => setOfflineDrawerOpen(false)}
            className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-muted hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {/* Offline Notice */}
        {!navigator.onLine && (
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <WifiOff size={16} className="shrink-0" />
            <span>أنت في وضع عدم الاتصال حالياً. يمكنك تشغيل السور المحفوظة أدناه بكل سلاسة.</span>
          </div>
        )}

        {/* Storage Stats Bar */}
        <div className="recessed-well p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ink-secondary">المساحة المستخدمة بالهاتف:</span>
            <span className="font-mono font-bold text-glow">{formatBytes(storage.usedBytes)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/20 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.max(1, storage.percentage)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-ink-muted">
            <span>{downloads.length} سورة محفوظة</span>
            {downloads.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-red-400 hover:text-red-300 underline font-semibold"
              >
                مسح الكل
              </button>
            )}
          </div>
        </div>

        {/* Current Playing Surah Download Action */}
        {source?.kind === 'surah-stream' && (
          <div className="glass-card p-4 rounded-2xl flex flex-col gap-2 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-emerald-500 font-bold block">السورة المشغلة حالياً</span>
                <span className="text-sm font-black font-cairo text-ink">
                  سورة {stripSurahPrefix(source.surahName)} — {source.reciterName}
                </span>
              </div>
              {currentIsDownloaded ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <CheckCircle2 size={16} />
                  <span>محفوظة</span>
                </span>
              ) : null}
            </div>

            {!currentIsDownloaded && (
              <button
                type="button"
                onClick={handleDownloadCurrent}
                disabled={isDownloading}
                className="tactile-pill py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-glow hover:bg-emerald-500/20 active:scale-95 transition-all disabled:opacity-60"
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>جاري التنزيل ({downloadProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    <span>حفظ السورة للاستماع بدون إنترنت</span>
                  </>
                )}
              </button>
            )}

            {isDownloading && (
              <div className="w-full h-1.5 rounded-full bg-black/20 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-150"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            )}

            {downloadMessage && (
              <p className="text-[11px] text-ink-secondary mt-1">{downloadMessage}</p>
            )}
          </div>
        )}

        {/* Downloaded Surahs List */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
          <span className="text-xs font-bold text-ink-muted">السور المحفوظة على هذا الجهاز</span>

          {downloads.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-ink-muted gap-2">
              <Download size={32} className="opacity-40" />
              <p className="text-xs">لم تقم بحفظ أي سورة للاستماع بدون إنترنت بعد.</p>
              <p className="text-[11px] text-ink-muted">
                شغّل أي سورة واضغط على زر الحفظ لتتمكن من سماعها في أي وقت دون اتصال.
              </p>
            </div>
          ) : (
            downloads.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-stage border border-[var(--border-tactile)] flex items-center justify-between gap-3 hover:border-emerald-500/40 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black font-cairo truncate text-ink">
                    سورة {stripSurahPrefix(item.surahName)}
                  </h4>
                  <p className="text-[11px] text-ink-secondary truncate">
                    {item.reciterName} · {formatBytes(item.fileSizeBytes)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      playSurahStream({
                        surahNumber: item.surahNumber,
                        surahName: item.surahName,
                        reciterId: item.reciterId,
                        reciterName: item.reciterName,
                        streamUrl: item.streamUrl,
                        totalAyahs: 114,
                      });
                      setOfflineDrawerOpen(false);
                    }}
                    title="تشغيل السورة"
                    className="p-2 rounded-xl tactile-pill text-emerald-500 hover:text-emerald-400 active:scale-95"
                  >
                    <Play size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.reciterId, item.surahNumber)}
                    title="حذف من الجهاز"
                    className="p-2 rounded-xl hover:bg-red-500/10 text-ink-muted hover:text-red-400 active:scale-95"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineAudioDrawer;

