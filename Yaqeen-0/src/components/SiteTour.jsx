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
    content: 'رسالة يومية متجددة تبدأ بها يومك ببركة ويقين.',
  },
  {
    targetId: 'tour-amm-baraka',
    title: 'عم بركة 💌',
    content: 'صديقك الوفي في "يقين"، يرسل لك الأدعية والآيات بكلمات طيبة كلما ضغطت عليه.',
  },
];

const POPUP_WIDTH = 340;
const POPUP_HEIGHT = 240;
const MARGIN = 16;

// Calculates the best popup position keeping it entirely within the viewport
function calcPopupStyle(rect, vw, vh) {
  const highlight = {
    top: rect.top - 8,
    left: rect.left - 8,
    width: rect.width + 16,
    height: rect.height + 16,
  };

  let top, left;

  // Try below first
  if (rect.bottom + MARGIN + POPUP_HEIGHT < vh) {
    top = rect.bottom + MARGIN;
  } else if (rect.top - MARGIN - POPUP_HEIGHT > 0) {
    // Try above
    top = rect.top - MARGIN - POPUP_HEIGHT;
  } else {
    // Center vertically
    top = Math.max(MARGIN, (vh - POPUP_HEIGHT) / 2);
  }

  // Horizontally — center on element but clamp to viewport
  left = rect.left + rect.width / 2 - POPUP_WIDTH / 2;
  left = Math.max(MARGIN, Math.min(left, vw - POPUP_WIDTH - MARGIN));

  return { top, left, highlight };
}

const SiteTour = () => {
  const { theme, tourOpen, setTourOpen } = useAppStore();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [layout, setLayout] = useState(null); // { top, left, highlight }

  // Auto-start for first-time visitors on home page
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('yaqeen_tour_seen');
    if (!hasSeenTour && location.pathname === '/') {
      const t = setTimeout(() => setTourOpen(true), 1500);
      return () => clearTimeout(t);
    }
  }, [location.pathname, setTourOpen]);

  // Reset step when tour opens
  useEffect(() => {
    if (tourOpen) setCurrentStep(0);
  }, [tourOpen]);

  // Recalculate layout whenever step changes or tour opens
  const recalc = useCallback(() => {
    if (!tourOpen) return;
    const step = TOUR_STEPS[currentStep];
    const el = document.getElementById(step.targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Scroll element into view if needed (without smooth to get accurate rect)
    if (rect.top < 0 || rect.bottom > vh) {
      window.scrollTo({
        top: window.scrollY + rect.top - vh / 2 + rect.height / 2,
        behavior: 'smooth',
      });
      // Recalc after scroll settles
      setTimeout(() => {
        const r2 = el.getBoundingClientRect();
        setLayout(calcPopupStyle(r2, vw, vh));
      }, 450);
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
      setCurrentStep(p => p + 1);
    } else {
      finishTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(p => p - 1);
  };

  const finishTour = () => {
    setTourOpen(false);
    localStorage.setItem('yaqeen_tour_seen', 'true');
  };

  if (!tourOpen || !layout) return null;

  const step = TOUR_STEPS[currentStep];
  const { highlight } = layout;

  // Build clip-path hole around highlighted element
  const { top: ht, left: hl, width: hw, height: hh } = highlight;
  const clipPath = `polygon(
    0% 0%, 0% 100%,
    ${hl}px 100%,
    ${hl}px ${ht}px,
    ${hl + hw}px ${ht}px,
    ${hl + hw}px ${ht + hh}px,
    ${hl}px ${ht + hh}px,
    ${hl}px 100%,
    100% 100%, 100% 0%
  )`;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none font-tajawal" dir="rtl">
      {/* Dimmed overlay with cutout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 pointer-events-auto"
        style={{ clipPath }}
        onClick={finishTour}
      />

      {/* Gold border highlight around target element */}
      <motion.div
        animate={{ boxShadow: ['0 0 0 2px rgba(200,169,106,0.4)', '0 0 0 6px rgba(200,169,106,0)', '0 0 0 2px rgba(200,169,106,0.4)'] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute pointer-events-none rounded-2xl border-2 border-[#d6a54a]"
        style={{ top: ht, left: hl, width: hw, height: hh }}
      />

      {/* Popup Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`absolute pointer-events-auto rounded-[1.5rem] shadow-2xl border overflow-hidden
            ${theme === 'dark' ? 'bg-[#0d2d22] border-[#d6a54a]/30 text-white' : 'bg-white border-[#0f1c2c]/10 text-[#0f1c2c]'}
          `}
          style={{ top: layout.top, left: layout.left, width: POPUP_WIDTH }}
        >
          {/* Progress bar */}
          <div className="h-1 w-full bg-black/10">
            <motion.div
              animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
              className={`h-full ${theme === 'dark' ? 'bg-[#d6a54a]' : 'bg-[#0f1c2c]'}`}
            />
          </div>

          <div className="p-5">
            {/* Close */}
            <button
              onClick={finishTour}
              className="absolute top-4 left-4 opacity-40 hover:opacity-100 transition-opacity pointer-events-auto"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <div className="flex items-center gap-2 mb-3 mt-1 pr-1">
              <div className={`p-1.5 rounded-xl ${theme === 'dark' ? 'bg-[#d6a54a]/20 text-[#d6a54a]' : 'bg-[#0f1c2c]/10 text-[#0f1c2c]'}`}>
                <Sparkles size={16} />
              </div>
              <h3 className="text-lg font-bold leading-snug">{step.title}</h3>
            </div>

            {/* Content */}
            <p className="text-sm opacity-80 leading-relaxed mb-5 text-right" dir="rtl">
              {step.content}
            </p>

            {/* Step counter + buttons */}
            <div className="flex items-center justify-between gap-3" dir="ltr">
              <span className="text-xs opacity-40 font-mono">{currentStep + 1} / {TOUR_STEPS.length}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={finishTour}
                  className="text-xs opacity-40 hover:opacity-80 font-medium px-2"
                >
                  تخطي
                </button>

                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`p-2 rounded-xl transition-all ${currentStep === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:scale-105 active:scale-95 bg-black/5'}`}
                >
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={handleNext}
                  className={`px-5 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5
                    ${theme === 'dark' ? 'bg-[#d6a54a] text-[#0f1c2c]' : 'bg-[#0f1c2c] text-white'}
                  `}
                >
                  {currentStep === TOUR_STEPS.length - 1 ? 'ابدأ !' : 'التالي'}
                  <ChevronLeft size={16} />
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
