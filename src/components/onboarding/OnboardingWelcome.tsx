import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, ArrowLeft, X } from 'lucide-react';

interface OnboardingWelcomeProps {
  open: boolean;
  onExploreSolo: () => void;
  onStartTour: () => void;
}

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({
  open,
  onExploreSolo,
  onStartTour,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 font-tajawal"
          dir="rtl"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="w-full max-w-md bento-stage p-6 sm:p-7 flex flex-col items-center text-center gap-5 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onExploreSolo}
              aria-label="إغلاق والبدء بالتصفح"
              className="absolute top-4 left-4 w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
            >
              <X size={15} />
            </button>

            {/* Avatar of Amm Baraka */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[var(--accent-glow)] p-1 bg-stage shadow-lg">
                <img
                  src="/amm-baraka.webp"
                  alt="عمي بركة"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to logo if avatar fails
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full amber-glow-dot text-white flex items-center justify-center shadow-md">
                <Sparkles size={13} />
              </div>
            </div>

            {/* Welcome Dialogue */}
            <div className="flex flex-col gap-2">
              <span className="recessed-well px-3 py-1 text-[11px] font-bold text-glow w-fit mx-auto">
                مساعدك في يقين
              </span>
              <h2 id="onboarding-title" className="text-xl sm:text-2xl font-black font-cairo text-ink">
                أهلاً بيك في يقين
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed pt-1">
                «أنا <strong className="text-ink font-bold">عمي بركة</strong>، مساعدك في المنصة. تحب تستكشف الموقع بنفسك، ولا أخدك في جولة سريعة أعرفك فيها على كل حاجة علشان ما يفوتكش أي جزء؟»
              </p>
            </div>

            {/* Two Clear Choices */}
            <div className="w-full flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={onStartTour}
                className="w-full tactile-pill active-ayah-glow py-3 px-4 text-sm font-extrabold text-glow flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <Compass size={17} />
                <span>خدني في جولة سريعة</span>
                <ArrowLeft size={15} />
              </button>

              <button
                type="button"
                onClick={onExploreSolo}
                className="w-full tactile-pill py-2.5 px-4 text-xs font-bold text-ink-secondary hover:text-ink transition-colors"
              >
                أستكشف بنفسي
              </button>
            </div>

            <p className="text-[11px] text-ink-muted">
              يمكنك إعادة تشغيل الجولة التعريفية في أي وقت من القائمة الجانبية
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingWelcome;
