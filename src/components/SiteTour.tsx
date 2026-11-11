import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Headphones,
  Search,
  Sparkles,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  Film,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { ModalDialog } from './ui/OverlayPrimitives';
import { toArabicDigits } from '../lib/arabicSearch';

const TOUR_STEPS = [
  {
    icon: BookOpen,
    title: 'القرآن أولاً ومحور التجربة',
    description:
      'تم تصميم يقين ليكون القرآن الكريم محور التجربة. يمكنك في الواجهة الرئيسية الاختيار بين قراءة المصحف، الاستماع لتلاوات ١٩ قارئاً، أو فتح الإذاعات المباشرة بلا تشويش.',
  },
  {
    icon: SlidersHorizontal,
    title: 'المصحف بالرسم العثماني وتخصيص القراءة',
    description:
      'قراءة بالخط العثماني الأصيل المحفوظ محلياً مع التفسير الميسر لكل آية، مع إمكانية تعديل حجم الخط وتباعد الأسطر والتبديل بين الوضع النهاري الكريمي والليلي الفحمي.',
  },
  {
    icon: Headphones,
    title: 'المشغل الصوتي العام ومؤقت النوم',
    description:
      'استمع للتلاوات والإذاعات عبر مشغل صوتي عائم يرافقك أثناء تصفحك لكافة أقسام المنصة، مع إمكانية ضبط مؤقت النوم، التحكم بالسرعة، وحفظ موضع الاستماع.',
  },
  {
    icon: Film,
    title: 'واحة المعرفة والقصص والسيرة',
    description:
      'بوابة موحدة تجمع ٨٨ حلقة مرئية موثقة لقصص القرآن، محطات السيرة النبوية الشريفة المصورة، وسير الصحابة الكرام مع العِبر والدروس المستفادة.',
  },
  {
    icon: ShieldCheck,
    title: 'حصن المسلم والأذكار الدائمة',
    description:
      'الرقية الشرعية وأذكار الصباح والمساء مع عداد تسبيح تفاعلي يحفظ مرات قراءتك تلقائياً في ذاكرة جهازك لتبقى متصلاً بالذكر في كل وقت.',
  },
  {
    icon: Download,
    title: 'بحث ذكي (Ctrl+K) وتثبيت التطبيق (PWA)',
    description:
      'ابحث عن أي آية أو سورة أو قارئ بسهولة، وثبت يقين كتطبيق مستقل على هاتفك (آيفون وأندرويد) أو حاسوبك للاستمتاع بتجربة سريعة خالية من أشرطة المتصفح.',
  },
];

interface SiteTourProps {
  open: boolean;
  onClose: () => void;
}

export const SiteTour: React.FC<SiteTourProps> = ({ open, onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const current = TOUR_STEPS[step];
  const Icon = current.icon;
  const isLast = step === TOUR_STEPS.length - 1;

  const handleFinish = () => {
    try {
      window.localStorage.setItem('yaqeen_tour_seen', '1');
      window.localStorage.setItem('yaqeen_onboarding_completed', 'true');
    } catch {
      // Ignore storage error
    }
    onClose();
  };

  return (
    <ModalDialog
      open={open}
      onClose={handleFinish}
      title="جولة سريعة في منصة يقين"
      subtitle={`الخطوة ${toArabicDigits(step + 1)} من ${toArabicDigits(TOUR_STEPS.length)}`}
      maxWidthClass="max-w-lg"
    >
      <div className="flex flex-col gap-5 p-2 font-tajawal text-ink" dir="rtl">
        <div className="recessed-box p-6 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl tactile-pill flex items-center justify-center text-glow">
            <Icon size={26} />
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold font-cairo text-ink">
            {current.title}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-ink-secondary">
            {current.description}
          </p>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5">
          {TOUR_STEPS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setStep(idx)}
              aria-label={`الخطوة ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                idx === step ? 'w-7 amber-glow-dot' : 'w-2 bg-ink-muted/30'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="tactile-pill px-4 py-2 text-xs font-bold text-ink-secondary hover:text-ink disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowRight size={14} />
            <span>السابق</span>
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="text-xs font-bold text-ink-muted hover:text-ink transition-colors"
          >
            تخطي الجولة
          </button>

          <button
            type="button"
            onClick={() => (isLast ? handleFinish() : setStep((s) => s + 1))}
            className="tactile-pill active-ayah-glow px-5 py-2 text-xs font-extrabold text-glow flex items-center gap-1.5"
          >
            <span>{isLast ? 'ابدأ الآن' : 'التالي'}</span>
            {!isLast && <ArrowLeft size={14} />}
          </button>
        </div>
      </div>
    </ModalDialog>
  );
};

export default SiteTour;
