import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const TOUR_STEPS = [
  {
    targetId: 'tour-hero',
    title: 'أهلاً بك في يقين ✨',
    content: 'هذا هو الملاذ الذي يجمع لك العلم والجمال في مكان واحد. دعنا نأخذك في جولة سريعة.',
  },
  {
    targetId: 'tour-meditation',
    title: 'وضع التأمل المستمر 🌿',
    content: 'انتقل إلى رحلة روحانية بلا انقطاع، حيث تتوالى الآيات والخواطر في تصميم يريح النفس.',
  },
  {
    targetId: 'tour-features',
    title: 'أقسام متنوعة 📚',
    content: 'من القرآن الكريم إلى قصص الصحابة والسيرة النبوية، كل ما تحتاجه لتغذية روحك.',
  },
  {
    targetId: 'tour-daily-ayah',
    title: 'آية اليوم 📖',
    content: 'رسالة يومية متجددة تبدأ بها يومك ببركة ويقين، مع إمكانية الاستماع المباشر.',
  },
  {
    targetId: 'tour-amm-baraka',
    title: 'الشيخ عم بركة 💌',
    content: 'مرشدك الحكيم في يقين، يساندك في الأسئلة الدينية والسيرة وتدبر الآيات.',
  },
];

const POPUP_WIDTH = 330;
const POPUP_HEIGHT = 230;
const MARGIN = 16;

function calcPopupStyle(rect, vw, vh) {
  const highlight = {
    top: rect.top - 8,
    left: rect.left - 8,
    width: rect.width + 16,
    height: rect.height + 16,
  };

  let top, left;
  if (rect.bottom + MARGIN + POPUP_HEIGHT < vh) {
    top = rect.bottom + MARGIN;
  } else if (rect.top - MARGIN - POPUP_HEIGHT > 0) {
    top = rect.top - MARGIN - POPUP_HEIGHT;
  } else {
    top = Math.max(MARGIN, (vh - POPUP_HEIGHT) / 2);
  }

  left = rect.left + rect.width / 2 - POPUP_WIDTH / 2;
  left = Math.max(MARGIN, Math.min(left, vw - POPUP_WIDTH - MARGIN));

  return { top, left, highlight };
}

const SiteTour = () => {
  const { tourOpen, setTourOpen } = useAppStore();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('yaqeen_tour_seen');
    if (!hasSeenTour && location.pathname === '/') {
      const t = setTimeout(() => setTourOpen(true), 1400);
      return () => clearTimeout(t);
    }
  }, [location.pathname, setTourOpen]);

  useEffect(() => {
    if (tourOpen) setCurrentStep(0);
  }, [tourOpen]);

  const finishTour = useCallback(() => {
    setTourOpen(false);
    localStorage.setItem('yaqeen_tour_seen', 'true');
  }, [setTourOpen]);

  const recalc = useCallback(() => {
    if (!tourOpen) return;
    const step = TOUR_STEPS[currentStep];
    const el = document.getElementById(step.targetId);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (!el) {
      // Fallback centered card if current route doesn't mount that targetId
      setLayout({
        top: Math.max(MARGIN, (vh - POPUP_HEIGHT) / 2),
        left: Math.max(MARGIN, (vw - POPUP_WIDTH) / 2),
        highlight: null,
      });
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > vh) {
      window.scrollTo({
        top: window.scrollY + rect.top - vh / 2 + rect.height / 2,
        behavior: 'smooth',
      });
      setTimeout(() => {
        const r2 = el.getBoundingClientRect();
        setLayout(calcPopupStyle(r2, vw, vh));
      }, 400);
      return;
    }

    setLayout(calcPopupStyle(rect, vw, vh));
  }, [tourOpen, currentStep]);

  useEffect(() => {
    recalc();
    window.addEventListener('resize', recalc);
    window.addEventListener('scroll', recalc, { passive: true });
    return () => {
      window.removeEventListener('resize', recalc);
      window.removeEventListener('scroll', recalc);
    };
  }, [recalc]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      finishTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  if (!tourOpen || !layout) return null;

  const step = TOUR_STEPS[currentStep];
  const { highlight } = layout;

  const clipPath = highlight
    ? `polygon(
    0% 0%, 0% 100%,
    ${highlight.left}px 100%,
    ${highlight.left}px ${highlight.top}px,
    ${highlight.left + highlight.width}px ${highlight.top}px,
    ${highlight.left + highlight.width}px ${highlight.top + highlight.height}px,
    ${highlight.left}px ${highlight.top + highlight.height}px,
    ${highlight.left}px 100%,
    100% 100%, 100% 0%
  )`
    : undefined;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none font-tajawal" dir="rtl">
      {/* Dimmed overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/55 pointer-events-auto"
        style={clipPath ? { clipPath } : undefined}
        onClick={finishTour}
      />

      {highlight && (
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0 2px var(--accent-glow-border)',
              '0 0 0 6px transparent',
              '0 0 0 2px var(--accent-glow-border)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute pointer-events-none rounded-3xl border-2 border-glow-border"
          style={{
            top: highlight.top,
            left: highlight.left,
            width: highlight.width,
            height: highlight.height,
          }}
        />
      )}

      {/* Popup Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute pointer-events-auto tactile-card overflow-hidden"
          style={{ top: layout.top, left: layout.left, width: POPUP_WIDTH }}
        >
          <div className="h-1 w-full bg-recessed">
            <motion.div
              animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
              className="h-full amber-glow-dot"
            />
          </div>

          <div className="p-5">
            <button
              type="button"
              onClick={finishTour}
              className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center absolute top-4 left-4 text-ink-secondary hover:text-ink pointer-events-auto"
            >
              <X size={15} />
            </button>

            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-full recessed-box flex items-center justify-center text-glow">
                <Sparkles size={15} />
              </div>
              <h3 className="text-base font-extrabold text-ink font-cairo">
                {step.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-5 text-right">
              {step.content}
            </p>

            <div className="flex items-center justify-between gap-3" dir="ltr">
              <span className="text-xs text-ink-muted font-mono">
                {currentStep + 1} / {TOUR_STEPS.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={finishTour}
                  className="text-xs text-ink-secondary hover:text-ink font-bold px-2"
                >
                  تخطي
                </button>

                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="tactile-pill px-4 py-2 font-bold text-xs text-glow flex items-center gap-1"
                >
                  <span>{currentStep === TOUR_STEPS.length - 1 ? 'ابدأ!' : 'التالي'}</span>
                  <ChevronLeft size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SiteTour;
