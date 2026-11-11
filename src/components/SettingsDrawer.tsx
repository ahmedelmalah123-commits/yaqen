import React from 'react';
import { RotateCcw, Sun, Moon, Type, BookOpen, AlignJustify } from 'lucide-react';
import { SideDrawer } from './ui/OverlayPrimitives';
import { useAppStore } from '../store/useAppStore';
import { toArabicDigits } from '../lib/arabicSearch';

const FONT_OPTIONS = [
  { id: 'uthmanic', label: 'العثماني (حفص)', sampleClass: 'font-uthmanic' },
  { id: 'amiri', label: 'الأميري القرآني', sampleClass: 'font-amiri' },
  { id: 'naskh', label: 'النسخ الواضح', sampleClass: 'font-naskh' },
];

const SURFACE_OPTIONS = [
  { id: 'auto', label: 'تلقائي (المظهر العام)' },
  { id: 'cream', label: 'ورق كريمي هادئ' },
  { id: 'paper', label: 'صحيفة مصحف دافئة' },
  { id: 'night', label: 'ورق ليلي داكن' },
];

const WIDTH_OPTIONS = [
  { id: 'comfortable', label: 'متوسط مريح' },
  { id: 'mushaf', label: 'عمود مصحف' },
  { id: 'wide', label: 'عرض واسع' },
];

const VIEW_MODE_OPTIONS = [
  { id: 'mushaf', label: 'صفحات المصحف' },
  { id: 'continuous', label: 'آيات متتالية' },
  { id: 'cards', label: 'بطاقات وتفسير' },
];

export const SettingsDrawer: React.FC = () => {
  const open = useAppStore((s) => s.isSettingsDrawerOpen);
  const setOpen = useAppStore((s) => s.setSettingsDrawerOpen);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const quranFontSize = useAppStore((s) => s.quranFontSize);
  const setQuranFontSize = useAppStore((s) => s.setQuranFontSize);
  const quranFontFamily = useAppStore((s) => s.quranFontFamily);
  const setQuranFontFamily = useAppStore((s) => s.setQuranFontFamily);
  const quranLineHeight = useAppStore((s) => s.quranLineHeight);
  const setQuranLineHeight = useAppStore((s) => s.setQuranLineHeight);
  const quranWordSpacing = useAppStore((s) => s.quranWordSpacing);
  const setQuranWordSpacing = useAppStore((s) => s.setQuranWordSpacing);
  const readingSurface = useAppStore((s) => s.readingSurface);
  const setReadingSurface = useAppStore((s) => s.setReadingSurface);
  const readingWidth = useAppStore((s) => s.readingWidth);
  const setReadingWidth = useAppStore((s) => s.setReadingWidth);
  const readingViewMode = useAppStore((s) => s.readingViewMode);
  const setReadingViewMode = useAppStore((s) => s.setReadingViewMode);
  const showWaqfMarks = useAppStore((s) => s.showWaqfMarks);
  const setShowWaqfMarks = useAppStore((s) => s.setShowWaqfMarks);
  const resetReadingSettings = useAppStore((s) => s.resetReadingSettings);

  return (
    <SideDrawer
      open={open}
      onClose={() => setOpen(false)}
      title="تخصيص القراءة والمظهر"
      subtitle="اضبط خط المصحف وسطحه بما يناسب راحتك البصرية"
      headerActions={
        <button
          type="button"
          onClick={resetReadingSettings}
          title="إعادة للافتراضي"
          className="tactile-pill px-3 py-1.5 text-xs font-bold text-ink-secondary hover:text-glow flex items-center gap-1.5"
        >
          <RotateCcw size={13} />
          <span>افتراضي</span>
        </button>
      }
    >
      <div className="flex flex-col gap-5 py-1 font-tajawal">
        {/* Global Theme Mode */}
        <section className="flex flex-col gap-2">
          <span className="text-xs font-bold text-ink-muted">المظهر العام</span>
          <div className="recessed-well p-1.5 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                theme === 'light' ? 'tactile-pill text-glow' : 'text-ink-secondary'
              }`}
            >
              <Sun size={14} />
              <span>الوضع النهاري (افتح)</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                theme === 'dark' ? 'tactile-pill text-glow' : 'text-ink-secondary'
              }`}
            >
              <Moon size={14} />
              <span>الوضع الليلي</span>
            </button>
          </div>
        </section>

        {/* Quran Font Selection */}
        <section className="flex flex-col gap-2">
          <span className="text-xs font-bold text-ink-muted flex items-center gap-1.5">
            <Type size={13} />
            خط القرآن الكريم
          </span>
          <div className="grid grid-cols-1 gap-2">
            {FONT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setQuranFontFamily(opt.id)}
                className={`p-3 rounded-2xl text-right flex items-center justify-between gap-2 transition-all ${
                  quranFontFamily === opt.id
                    ? 'tactile-card active-ayah-glow text-ink font-extrabold'
                    : 'recessed-box text-ink-secondary hover:text-ink'
                }`}
              >
                <span className="text-xs font-cairo">{opt.label}</span>
                <span className={`${opt.sampleClass} text-xl text-ink`}>
                  بِسْمِ ٱللَّهِ
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Live Font Size Slider */}
        <section className="tactile-card p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-ink-secondary">حجم خط الآيات</span>
            <span className="font-mono text-glow">{toArabicDigits(quranFontSize)} px</span>
          </div>
          <input
            type="range"
            min={22}
            max={56}
            step={1}
            value={quranFontSize}
            onChange={(e) => setQuranFontSize(Number(e.target.value))}
            aria-label="حجم خط الآيات"
            className="w-full accent-[var(--accent-glow)] cursor-pointer"
          />

          <div className="flex items-center justify-between text-xs font-bold pt-1">
            <span className="text-ink-secondary">تباعد الأسطر</span>
            <span className="font-mono text-glow">{quranLineHeight.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={1.75}
            max={2.8}
            step={0.05}
            value={quranLineHeight}
            onChange={(e) => setQuranLineHeight(Number(e.target.value))}
            aria-label="تباعد الأسطر"
            className="w-full accent-[var(--accent-glow)] cursor-pointer"
          />

          <div className="flex items-center justify-between text-xs font-bold pt-1">
            <span className="text-ink-secondary">تباعد الكلمات</span>
            <span className="font-mono text-glow">{toArabicDigits(quranWordSpacing)} px</span>
          </div>
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={quranWordSpacing}
            onChange={(e) => setQuranWordSpacing(Number(e.target.value))}
            aria-label="تباعد الكلمات"
            className="w-full accent-[var(--accent-glow)] cursor-pointer"
          />
        </section>

        {/* Reading Surface Preset */}
        <section className="flex flex-col gap-2">
          <span className="text-xs font-bold text-ink-muted flex items-center gap-1.5">
            <BookOpen size={13} />
            خلفية صفحة المصحف
          </span>
          <div className="grid grid-cols-2 gap-2">
            {SURFACE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setReadingSurface(opt.id)}
                className={`p-2.5 rounded-2xl text-xs font-bold transition-all ${
                  readingSurface === opt.id
                    ? 'tactile-pill active-ayah-glow text-glow'
                    : 'recessed-box text-ink-secondary hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Layout Width & Default View Mode */}
        <section className="flex flex-col gap-2">
          <span className="text-xs font-bold text-ink-muted flex items-center gap-1.5">
            <AlignJustify size={13} />
            عرض القراءة الافتراضي
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {VIEW_MODE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setReadingViewMode(opt.id)}
                className={`p-2 rounded-xl text-[11px] font-bold transition-all ${
                  readingViewMode === opt.id
                    ? 'tactile-pill active-ayah-glow text-glow'
                    : 'recessed-box text-ink-secondary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <span className="text-xs font-bold text-ink-muted">اتساع عمود النص</span>
          <div className="grid grid-cols-3 gap-1.5">
            {WIDTH_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setReadingWidth(opt.id)}
                className={`p-2 rounded-xl text-[11px] font-bold transition-all ${
                  readingWidth === opt.id
                    ? 'tactile-pill active-ayah-glow text-glow'
                    : 'recessed-box text-ink-secondary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Ayah End Symbols Toggle */}
        <label className="recessed-box p-3.5 flex items-center justify-between gap-3 cursor-pointer">
          <span className="text-xs font-bold text-ink">
            إظهار فواصل وزخارف أرقام الآيات
          </span>
          <input
            type="checkbox"
            checked={showWaqfMarks}
            onChange={(e) => setShowWaqfMarks(e.target.checked)}
            className="w-4 h-4 accent-[var(--accent-glow)] cursor-pointer"
          />
        </label>
      </div>
    </SideDrawer>
  );
};

export default SettingsDrawer;

