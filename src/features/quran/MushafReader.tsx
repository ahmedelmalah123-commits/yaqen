import React, { useState } from 'react';
import {
  Play,
  Pause,
  Bookmark,
  Copy,
  Check,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ListPlus,
  Mic2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { stripBismillah, stripSurahPrefix, toArabicDigits } from '../../lib/arabicSearch';
import type { QuranAyah, SurahSummary } from './quranApi';

const FONT_CLASS_MAP: Record<string, string> = {
  uthmanic: 'font-uthmanic',
  amiri: 'font-amiri',
  naskh: 'font-naskh',
};

const WIDTH_CLASS_MAP: Record<string, string> = {
  mushaf: 'max-w-2xl mx-auto',
  comfortable: 'max-w-4xl mx-auto',
  wide: 'max-w-full',
};

const SURFACE_CLASS_MAP: Record<string, string> = {
  auto: 'tactile-card',
  cream: 'mushaf-surface-cream rounded-[22px] border border-[var(--border-tactile)] shadow-raised-sm',
  paper: 'mushaf-surface-paper rounded-[22px] border border-[var(--border-tactile)] shadow-raised-sm',
  night: 'mushaf-surface-night rounded-[22px] border border-[var(--border-tactile)] shadow-raised-sm',
};

interface MushafReaderProps {
  surah: SurahSummary & { ayahs: QuranAyah[] };
  tafsirAyahs?: Array<{ numberInSurah: number; text: string }> | null;
  viewMode: string;
  timingAvailable?: boolean;
  selectedAyahIndex: number;
  activePlayingIndex: number | null;
  isSurahPlaying: boolean;
  onSelectAyah: (index: number) => void;
  onPlayAyah: (index: number) => void;
  onOpenStudyForAyah: (index: number) => void;
  onEnqueueAyah: (index: number) => void;
  isBookmarked: (ayahNum: number) => boolean;
  onToggleBookmark: (ayah: QuranAyah, cleanText: string) => void;
  pageNumbers: number[];
  activePage: number;
  onChangePage: (page: number) => void;
  activeAyahRef: React.RefObject<HTMLElement>;
}

export const MushafReader: React.FC<MushafReaderProps> = ({
  surah,
  tafsirAyahs,
  viewMode,
  timingAvailable = false,
  selectedAyahIndex,
  activePlayingIndex,
  isSurahPlaying,
  onSelectAyah,
  onPlayAyah,
  onOpenStudyForAyah,
  onEnqueueAyah,
  isBookmarked,
  onToggleBookmark,
  pageNumbers,
  activePage,
  onChangePage,
  activeAyahRef,
}) => {
  const quranFontSize = useAppStore((s) => s.quranFontSize);
  const quranFontFamily = useAppStore((s) => s.quranFontFamily);
  const quranLineHeight = useAppStore((s) => s.quranLineHeight);
  const quranWordSpacing = useAppStore((s) => s.quranWordSpacing);
  const readingSurface = useAppStore((s) => s.readingSurface);
  const readingWidth = useAppStore((s) => s.readingWidth);
  const showWaqfMarks = useAppStore((s) => s.showWaqfMarks);

  const [copiedAyahNum, setCopiedAyahNum] = useState<number | null>(null);

  const fontClass = FONT_CLASS_MAP[quranFontFamily] || 'font-uthmanic';
  const widthClass = WIDTH_CLASS_MAP[readingWidth] || WIDTH_CLASS_MAP.comfortable;
  const surfaceClass = SURFACE_CLASS_MAP[readingSurface] || SURFACE_CLASS_MAP.auto;

  const handleCopyAyah = async (ayah: QuranAyah, cleanText: string) => {
    const formatted = `﴿${cleanText}﴾ [سورة ${stripSurahPrefix(surah.name)}: ${ayah.numberInSurah}]`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedAyahNum(ayah.numberInSurah);
      window.setTimeout(() => setCopiedAyahNum(null), 1800);
    } catch {
      // Clipboard fallback ignored safely
    }
  };

  const handleSpeakTafsir = (text: string) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  const pageAyahs =
    viewMode === 'mushaf'
      ? surah.ayahs
          .map((ayah, idx) => ({ ayah, idx }))
          .filter(({ ayah }) => (ayah.page || 1) === activePage)
      : surah.ayahs.map((ayah, idx) => ({ ayah, idx }));

  const selectedAyah = surah.ayahs[selectedAyahIndex] || surah.ayahs[0];
  const selectedCleanText = selectedAyah
    ? stripBismillah(selectedAyah.text, surah.number, selectedAyahIndex === 0)
    : '';

  const pageIdx = pageNumbers.indexOf(activePage);
  const prevPage = pageIdx > 0 ? pageNumbers[pageIdx - 1] : null;
  const nextPage =
    pageIdx >= 0 && pageIdx < pageNumbers.length - 1 ? pageNumbers[pageIdx + 1] : null;

  return (
    <div className={`${widthClass} flex flex-col gap-4 transition-all`} dir="rtl">
      {/* Bismillah Banner (Surah != 1 && != 9) */}
      {surah.number !== 1 && surah.number !== 9 && (
        <div className="recessed-box py-4 px-6 text-center font-uthmanic text-2xl sm:text-3xl text-ink quran-text-render">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      )}

      {/* Contextual Action Pill Bar for Currently Focused Ayah (Mushaf & Continuous Modes) */}
      {viewMode !== 'cards' && selectedAyah && (
        <div className="sticky top-2 z-20 glass-card rounded-full px-3 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full amber-glow-dot" />
            <span className="text-xs font-extrabold text-ink">
              الآية {toArabicDigits(selectedAyah.numberInSurah)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              disabled={!timingAvailable}
              onClick={() => onPlayAyah(selectedAyahIndex)}
              title={
                timingAvailable
                  ? 'تشغيل السورة ابتداءً من هذه الآية'
                  : 'مزامنة وتوقيت الآيات غير متاح لهذا القارئ؛ استخدم زر استمع للسورة'
              }
              className="tactile-pill px-3 py-1.5 text-xs font-bold text-ink hover:text-glow disabled:opacity-45 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isSurahPlaying && activePlayingIndex === selectedAyahIndex ? (
                <Pause size={13} fill="currentColor" className="text-glow" />
              ) : (
                <Play size={13} fill="currentColor" className="text-glow" />
              )}
              <span>
                {!timingAvailable
                  ? 'التوقيت غير متاح'
                  : isSurahPlaying && activePlayingIndex === selectedAyahIndex
                  ? 'إيقاف'
                  : 'تشغيل من الآية'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onOpenStudyForAyah(selectedAyahIndex)}
              className="tactile-pill px-3 py-1.5 text-xs font-bold text-ink-secondary hover:text-glow flex items-center gap-1.5"
            >
              <BookOpen size={13} />
              <span>التفسير</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopyAyah(selectedAyah, selectedCleanText)}
              className="tactile-pill px-3 py-1.5 text-xs font-bold text-ink-secondary hover:text-glow flex items-center gap-1.5"
            >
              {copiedAyahNum === selectedAyah.numberInSurah ? (
                <Check size={13} className="text-emerald-600" />
              ) : (
                <Copy size={13} />
              )}
              <span>{copiedAyahNum === selectedAyah.numberInSurah ? 'نُسخت' : 'نسخ'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(selectedAyah, selectedCleanText)}
              className={`w-8 h-8 rounded-full tactile-pill flex items-center justify-center ${
                isBookmarked(selectedAyah.numberInSurah)
                  ? 'text-glow'
                  : 'text-ink-secondary hover:text-glow'
              }`}
              title="حفظ الآية"
              aria-label="حفظ أو إزالة الآية من المحفوظات"
            >
              <Bookmark
                size={14}
                className={isBookmarked(selectedAyah.numberInSurah) ? 'fill-current' : ''}
              />
            </button>

            <button
              type="button"
              onClick={() => onEnqueueAyah(selectedAyahIndex)}
              className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow"
              title="إضافة السورة كاملة إلى قائمة الانتظار"
              aria-label="إضافة السورة كاملة إلى قائمة الانتظار"
            >
              <ListPlus size={14} />
            </button>
          </div>
        </div>
      )}

      {!timingAvailable && (
        <div className="recessed-box px-4 py-2 text-[11px] text-ink-secondary flex items-center justify-between gap-2">
          <span>
            تعمل التلاوة كملف سورة كاملة متواصل، ومزامنة التظليل أو البدء من آية محددة غير متوفرين لهذا القارئ.
          </span>
        </div>
      )}

      {/* Reading Modes */}
      {viewMode !== 'cards' ? (
        <article className={`${surfaceClass} p-5 sm:p-9 md:p-11`} aria-label="نص السورة">
          <div
            className={`${fontClass} quran-text-render text-justify select-text`}
            style={{
              fontSize: `${quranFontSize}px`,
              lineHeight: quranLineHeight,
              wordSpacing: `${quranWordSpacing}px`,
            }}
          >
            {pageAyahs.map(({ ayah, idx }) => {
              const cleanText = stripBismillah(ayah.text, surah.number, idx === 0);
              const isPlayingHere = isSurahPlaying && activePlayingIndex === idx;
              const isFocused = selectedAyahIndex === idx;

              return (
                <span
                  key={ayah.number}
                  ref={isFocused ? (activeAyahRef as React.RefObject<HTMLSpanElement>) : undefined}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectAyah(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectAyah(idx);
                    }
                  }}
                  aria-label={`الآية ${ayah.numberInSurah}`}
                  className={`inline cursor-pointer rounded-xl px-1.5 py-0.5 mx-0.5 border transition-colors ${
                    isPlayingHere
                      ? 'active-ayah-glow'
                      : isFocused
                      ? 'border-glow-border bg-glow-soft/50'
                      : 'border-transparent hover:bg-recessed/45'
                  }`}
                >
                  {cleanText}
                  {showWaqfMarks ? (
                    <span
                      className={`inline-block mx-1.5 font-cairo font-bold whitespace-nowrap align-middle ${
                        isPlayingHere || isFocused ? 'text-glow' : 'opacity-65'
                      }`}
                      style={{ fontSize: `${Math.max(15, quranFontSize * 0.56)}px` }}
                    >
                      ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                    </span>
                  ) : (
                    <span className="mx-1.5 text-xs font-mono opacity-55 align-middle">
                      ({toArabicDigits(ayah.numberInSurah)})
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          {/* Mushaf Page Pagination Controls */}
          {viewMode === 'mushaf' && pageNumbers.length > 1 && (
            <div className="mt-8 pt-4 border-t border-[var(--glass-border-subtle)] flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={!prevPage}
                onClick={() => prevPage && onChangePage(prevPage)}
                className="tactile-pill px-4 py-2 text-xs font-bold text-ink hover:text-glow disabled:opacity-35 flex items-center gap-1.5"
              >
                <ChevronRight size={15} />
                <span>الصفحة السابقة</span>
              </button>

              <span className="recessed-well px-4 py-1.5 text-xs font-bold text-ink-secondary">
                صفحة المصحف: <strong className="font-mono text-glow">{toArabicDigits(activePage)}</strong>
              </span>

              <button
                type="button"
                disabled={!nextPage}
                onClick={() => nextPage && onChangePage(nextPage)}
                className="tactile-pill px-4 py-2 text-xs font-bold text-ink hover:text-glow disabled:opacity-35 flex items-center gap-1.5"
              >
                <span>الصفحة التالية</span>
                <ChevronLeft size={15} />
              </button>
            </div>
          )}
        </article>
      ) : (
        /* Cards & Tafsir Study View */
        <div className="flex flex-col gap-4">
          {surah.ayahs.map((ayah, idx) => {
            const cleanText = stripBismillah(ayah.text, surah.number, idx === 0);
            const isPlayingHere = isSurahPlaying && activePlayingIndex === idx;
            const isFocused = selectedAyahIndex === idx;
            const bookmarked = isBookmarked(ayah.numberInSurah);
            const tafsirText =
              tafsirAyahs?.[idx]?.text || 'التفسير الميسر غير متوفر مؤقتاً لهذه الآية.';

            return (
              <article
                key={ayah.number}
                ref={isFocused ? (activeAyahRef as React.RefObject<HTMLElement>) : undefined}
                onClick={() => onSelectAyah(idx)}
                className={`${surfaceClass} p-5 sm:p-7 flex flex-col gap-4 transition-all ${
                  isPlayingHere ? 'active-ayah-glow' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-ink-muted">
                  <span className="recessed-well px-3 py-1 font-bold text-glow">
                    الآية {toArabicDigits(ayah.numberInSurah)} · ص {toArabicDigits(ayah.page)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyAyah(ayah, cleanText);
                      }}
                      className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow"
                      title="نسخ الآية"
                    >
                      {copiedAyahNum === ayah.numberInSurah ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(ayah, cleanText);
                      }}
                      className={`w-8 h-8 rounded-full tactile-pill flex items-center justify-center ${
                        bookmarked ? 'text-glow' : 'text-ink-secondary hover:text-glow'
                      }`}
                      title="حفظ الآية"
                    >
                      <Bookmark size={14} className={bookmarked ? 'fill-current' : ''} />
                    </button>
                  </div>
                </div>

                <p
                  className={`${fontClass} quran-text-render text-right select-text`}
                  style={{
                    fontSize: `${quranFontSize}px`,
                    lineHeight: quranLineHeight,
                    wordSpacing: `${quranWordSpacing}px`,
                  }}
                >
                  {cleanText}
                  <span
                    className="mx-2 font-cairo font-bold text-glow"
                    style={{ fontSize: `${Math.max(16, quranFontSize * 0.56)}px` }}
                  >
                    ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                  </span>
                </p>

                <div className="recessed-box p-4 flex items-start justify-between gap-3">
                  <p className="text-sm sm:text-base leading-relaxed text-ink-secondary flex-1">
                    {tafsirText}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakTafsir(tafsirText);
                    }}
                    title="استمع للتفسير الميسر"
                    aria-label="استمع للتفسير الميسر"
                    className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow shrink-0"
                  >
                    <Mic2 size={15} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!timingAvailable}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayAyah(idx);
                    }}
                    title={
                      timingAvailable
                        ? 'تشغيل السورة ابتداءً من هذه الآية'
                        : 'التوقيت غير متوفر لهذا القارئ؛ استمع للسورة كاملة من الأعلى'
                    }
                    className={`tactile-pill px-4 py-2 text-xs font-bold flex items-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed ${
                      isPlayingHere ? 'active-ayah-glow text-glow' : 'text-ink hover:text-glow'
                    }`}
                  >
                    {isPlayingHere ? (
                      <Pause size={14} fill="currentColor" />
                    ) : (
                      <Play size={14} fill="currentColor" />
                    )}
                    <span>
                      {!timingAvailable
                        ? 'التوقيت غير متاح'
                        : isPlayingHere
                        ? 'إيقاف'
                        : 'تشغيل من الآية'}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MushafReader;

