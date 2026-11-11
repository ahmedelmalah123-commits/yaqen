import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SlidersHorizontal,
  BookOpen,
  Sparkles,
  AlignJustify,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react';
import { SegmentedTabs } from '../../components/ui/Primitives';
import { stripSurahPrefix, toArabicDigits } from '../../lib/arabicSearch';
import { getJuzName } from './juzMetadata';
import type { SurahSummary } from './quranApi';

interface SurahHeaderProps {
  surah: SurahSummary;
  activeJuz: number;
  activeViewMode: string;
  onChangeViewMode: (mode: string) => void;
  totalAyahs: number;
  selectedAyahIndex: number;
  onJumpToAyah: (ayahIndex: number) => void;
  isSurahPlaying: boolean;
  onTogglePlaySurah: () => void;
  studyOpen: boolean;
  onToggleStudy: () => void;
  onOpenSettings: () => void;
  reciterName: string;
}

export const SurahHeader: React.FC<SurahHeaderProps> = ({
  surah,
  activeJuz,
  activeViewMode,
  onChangeViewMode,
  totalAyahs,
  selectedAyahIndex,
  onJumpToAyah,
  isSurahPlaying,
  onTogglePlaySurah,
  studyOpen,
  onToggleStudy,
  onOpenSettings,
  reciterName,
}) => {
  const prevSurah = surah.number > 1 ? surah.number - 1 : null;
  const nextSurah = surah.number < 114 ? surah.number + 1 : null;

  return (
    <header className="bento-stage p-4 sm:p-6 flex flex-col gap-4" dir="rtl">
      {/* Top Breadcrumb + Prev/Next Surah + Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Link
            to="/quran"
            className="tactile-pill px-3.5 py-2 text-xs font-bold text-ink-secondary hover:text-ink flex items-center gap-1.5"
          >
            <ArrowRight size={14} />
            <span>فهرس السور</span>
          </Link>

          <span className="text-xs font-semibold text-ink-muted hidden sm:inline">
            {String(surah.number).padStart(2, '0')} · الجزء {getJuzName(activeJuz)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {prevSurah && (
            <Link
              to={`/surah/${prevSurah}`}
              className="tactile-pill px-3 py-1.5 text-xs font-bold text-ink-secondary hover:text-ink flex items-center gap-1"
              title="السورة السابقة"
            >
              <ChevronRight size={14} />
              <span>السابقة</span>
            </Link>
          )}
          {nextSurah && (
            <Link
              to={`/surah/${nextSurah}`}
              className="tactile-pill px-3 py-1.5 text-xs font-bold text-ink-secondary hover:text-ink flex items-center gap-1"
              title="السورة التالية"
            >
              <span>التالية</span>
              <ChevronLeft size={14} />
            </Link>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            className="tactile-pill px-3.5 py-1.5 text-xs font-bold text-ink-secondary hover:text-glow flex items-center gap-1.5"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">تخصيص</span>
          </button>

          <button
            type="button"
            onClick={onToggleStudy}
            className={`tactile-pill px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 ${
              studyOpen ? 'active-ayah-glow text-glow' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            {studyOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            <span>التفسير والقارئ</span>
          </button>
        </div>
      </div>

      {/* Main Title Row + Surah Recitation Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black font-cairo text-ink leading-tight">
            سورة {stripSurahPrefix(surah.name)}
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1.5 font-medium">
            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} ·{' '}
            {toArabicDigits(totalAyahs)} آية · القارئ: <strong className="text-ink">{reciterName}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onTogglePlaySurah}
          className={`tactile-pill px-6 py-3 font-extrabold text-sm flex items-center justify-center gap-2.5 shrink-0 ${
            isSurahPlaying ? 'active-ayah-glow text-glow' : 'text-ink hover:text-glow'
          }`}
        >
          {isSurahPlaying ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          <span>{isSurahPlaying ? 'إيقاف التلاوة' : 'استمع للسورة'}</span>
        </button>
      </div>

      {/* View Switcher & Direct Ayah Jump */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <SegmentedTabs
          activeId={activeViewMode}
          onChange={onChangeViewMode}
          items={[
            { id: 'mushaf', label: 'المصحف', icon: BookOpen },
            { id: 'continuous', label: 'آيات متتالية', icon: AlignJustify },
            { id: 'cards', label: 'التفسير والبطاقات', icon: Sparkles },
          ]}
        />

        <label className="recessed-well px-3.5 py-1.5 flex items-center gap-2 text-xs font-bold text-ink-secondary">
          <span>الانتقال لآية:</span>
          <select
            aria-label="الانتقال إلى آية محددة"
            value={selectedAyahIndex}
            onChange={(e) => onJumpToAyah(Number(e.target.value))}
            className="bg-transparent font-mono text-ink outline-none cursor-pointer"
          >
            {Array.from({ length: totalAyahs }).map((_, idx) => (
              <option key={idx} value={idx} className="bg-elevated text-ink">
                {toArabicDigits(idx + 1)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
};

export default SurahHeader;

