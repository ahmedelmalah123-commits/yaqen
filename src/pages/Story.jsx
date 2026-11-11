import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { sahabaData } from '../lib/data/sahabaData';
import { toArabicDigits } from '../lib/arabicSearch';

const Story = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const story = sahabaData.find((s) => s.id === id);

  useEffect(() => {
    setCurrentSlide(0);
  }, [id]);

  useEffect(() => {
    if (!story) return undefined;
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((s) => Math.min(story.slides.length - 1, s + 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((s) => Math.max(0, s - 1));
      } else if (e.key === 'Escape') {
        navigate('/sahaba');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [story, navigate]);

  if (!story) {
    return (
      <div className="bento-stage p-10 text-center flex flex-col items-center gap-4 font-tajawal" dir="rtl">
        <p className="text-xl font-extrabold font-cairo text-ink">القصة غير موجودة</p>
        <Link to="/sahaba" className="tactile-pill px-5 py-2.5 text-xs font-bold text-glow">
          العودة لقصص الصحابة
        </Link>
      </div>
    );
  }

  return (
    <div className="bento-stage p-5 sm:p-8 flex flex-col gap-6 font-tajawal min-h-[70vh]" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <div className="recessed-well px-3 py-2 flex gap-1.5" dir="ltr">
          {story.slides.map((sl, idx) => (
            <button
              key={sl.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={sl.title}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-10 amber-glow-dot' : 'w-3 bg-ink-muted/30'
              }`}
            />
          ))}
        </div>

        <Link
          to="/sahaba"
          aria-label="العودة لقائمة الصحابة"
          className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
        >
          <X size={18} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-3xl tactile-card p-6 sm:p-10 text-center flex flex-col items-center gap-5"
          >
            <span className="recessed-well px-4 py-1.5 text-xs sm:text-sm font-bold text-glow">
              {story.name} · {story.slides[currentSlide].title}
            </span>
            <p className="text-lg sm:text-2xl font-bold leading-[1.95] text-ink font-cairo">
              {story.slides[currentSlide].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
          disabled={currentSlide === 0}
          aria-label="الشريحة السابقة"
          className="w-12 h-12 rounded-full tactile-pill flex items-center justify-center text-ink disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>

        <span className="recessed-well px-4 py-2 text-xs font-mono font-bold text-ink-secondary">
          {toArabicDigits(currentSlide + 1)} / {toArabicDigits(story.slides.length)}
        </span>

        <button
          type="button"
          onClick={() => setCurrentSlide((s) => Math.min(story.slides.length - 1, s + 1))}
          disabled={currentSlide === story.slides.length - 1}
          aria-label="الشريحة التالية"
          className="w-12 h-12 rounded-full tactile-pill flex items-center justify-center text-glow disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
    </div>
  );
};

export default Story;
