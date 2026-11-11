import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sahabaData } from '../lib/data/sahabaData';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Story = () => {
  const { id } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);

  const story = sahabaData.find((s) => s.id === id);

  if (!story) {
    return (
      <div className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center gap-4 p-8 font-tajawal">
        <p className="text-2xl font-bold">القصة غير موجودة</p>
        <Link to="/sahaba" className="tactile-pill px-6 py-2.5 text-sm font-bold text-glow">
          العودة للصحابة
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    if (currentSlide < story.slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-canvas text-ink font-ibm overflow-y-auto overflow-x-hidden min-h-screen">
      {/* Header Controls */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-6 flex items-center justify-between gap-4">
        <div className="recessed-well px-3 py-2 flex gap-2" dir="ltr">
          {story.slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-10 amber-glow-dot' : 'w-3 bg-ink-muted/30'
              }`}
            />
          ))}
        </div>

        <Link
          to="/sahaba"
          className="w-11 h-11 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
          aria-label="إغلاق القصة"
        >
          <X size={20} />
        </Link>
      </div>

      {/* Slide Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full max-w-4xl bento-stage p-6 sm:p-12 md:p-14 flex flex-col justify-center min-h-[55vh]"
          >
            <div className="text-center overflow-y-auto max-h-[65vh] no-scrollbar flex flex-col items-center gap-4">
              <span className="recessed-well px-4 py-1.5 text-xs sm:text-sm font-bold text-glow">
                {story.name} · {story.slides[currentSlide].title}
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold leading-[1.9] text-ink font-cairo">
                {story.slides[currentSlide].text}
              </h2>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div
        className="relative z-10 w-full p-6 flex items-center justify-center gap-5"
        dir="rtl"
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="w-14 h-14 rounded-full tactile-pill flex items-center justify-center text-ink disabled:opacity-30"
          title="السابق"
        >
          <ChevronRight size={24} />
        </button>

        <span className="recessed-well px-4 py-2 text-xs font-mono font-bold text-ink-secondary">
          {(currentSlide + 1).toLocaleString('ar-EG')} /{' '}
          {story.slides.length.toLocaleString('ar-EG')}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentSlide === story.slides.length - 1}
          className="w-14 h-14 rounded-full tactile-pill flex items-center justify-center text-glow disabled:opacity-30"
          title="التالي"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
};

export default Story;
