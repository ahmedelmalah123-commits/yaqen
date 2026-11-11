import React from 'react';
import { Mic2, Volume2, BookOpen, Copy, Check } from 'lucide-react';
import { SideDrawer } from '../../components/ui/OverlayPrimitives';
import { reciterGroups, getReciterById } from '../../lib/data/recitersData';
import { stripSurahPrefix, toArabicDigits } from '../../lib/arabicSearch';

interface StudyPanelsContentProps {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  tafsirText: string;
  currentReciterId: string;
  onSelectReciter: (id: string) => void;
}

export const StudyPanelsContent: React.FC<StudyPanelsContentProps> = ({
  surahNumber,
  surahName,
  ayahNumber,
  ayahText,
  tafsirText,
  currentReciterId,
  onSelectReciter,
}) => {
  const [copied, setCopied] = React.useState(false);
  const currentReciter = getReciterById(currentReciterId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `﴿${ayahText}﴾ [سورة ${stripSurahPrefix(surahName)}: ${ayahNumber}]\n\nالتفسير الميسر: ${tafsirText}`
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !tafsirText) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(tafsirText);
    u.lang = 'ar-SA';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col gap-5 font-tajawal" dir="rtl">
      {/* Live Tafsir Block */}
      <section className="tactile-card p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-ink-muted block">
              التفسير الميسر
            </span>
            <h2 className="text-base font-extrabold font-cairo text-ink">
              سورة {stripSurahPrefix(surahName)} · آية {toArabicDigits(ayahNumber)}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSpeak}
              title="قراءة التفسير صوتياً"
              aria-label="قراءة التفسير صوتياً"
              className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow"
            >
              <Volume2 size={15} />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              title="نسخ الآية والتفسير"
              aria-label="نسخ الآية والتفسير"
              className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow"
            >
              {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
            </button>
          </div>
        </div>

        <p className="font-uthmanic text-lg leading-[2] text-ink recessed-box p-3 select-text">
          {ayahText}
        </p>

        <p className="text-sm leading-relaxed text-ink-secondary select-text">
          {tafsirText || 'التفسير غير متوفر مؤقتاً لهذه الآية.'}
        </p>

        {surahNumber === 1 && (
          <span className="text-[11px] text-ink-muted flex items-center gap-1">
            <BookOpen size={12} /> نص المصحف ثابت بالرسم العثماني الموثق
          </span>
        )}
      </section>

      {/* Reciter Selector Block */}
      <section className="tactile-card p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-ink-muted block">القارئ المختار</span>
            <h3 className="text-sm font-extrabold font-cairo text-ink flex items-center gap-1.5">
              <Mic2 size={14} className="text-glow" />
              <span>{currentReciter.name}</span>
            </h3>
          </div>
          <span className="recessed-well px-2.5 py-1 text-[10px] font-bold text-ink-secondary">
            {currentReciter.timingMoshafId ? 'سورة كاملة · مزامنة' : 'تلاوة سورة كاملة'}
          </span>
        </div>

        <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto no-scrollbar">
          {reciterGroups.map((grp) => (
            <div key={grp.group} className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-ink-muted px-1">
                {grp.group}
              </span>
              {grp.reciters.map((rec) => {
                const active = rec.id === currentReciter.id;
                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => onSelectReciter(rec.id)}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-all ${
                      active
                        ? 'active-ayah-glow text-glow'
                        : 'recessed-box text-ink-secondary hover:text-ink'
                    }`}
                  >
                    <span className="truncate">{rec.name}</span>
                    <span className="text-[10px] opacity-75 shrink-0">
                      {rec.timingMoshafId ? 'مزامنة' : 'سورة كاملة'}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

interface StudyPanelsDrawerProps extends StudyPanelsContentProps {
  open: boolean;
  onClose: () => void;
}

export const StudyPanelsDrawer: React.FC<StudyPanelsDrawerProps> = ({
  open,
  onClose,
  ...contentProps
}) => (
  <SideDrawer
    open={open}
    onClose={onClose}
    title="وضع الدراسة والتدبر"
    subtitle="التفسير الميسر واختيار القارئ"
  >
    <StudyPanelsContent {...contentProps} />
  </SideDrawer>
);

export default StudyPanelsDrawer;

