import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CinematicIntro = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(
      'https://upload.wikimedia.org/wikipedia/commons/1/1a/Chimes.ogg'
    );
    audioRef.current.volume = 0.6;
    audioRef.current.play().catch(() => {});

    const timer = setTimeout(() => {
      handleComplete();
    }, 5500);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const handleComplete = () => {
    setIsVisible(false);
    if (audioRef.current) audioRef.current.pause();
    setTimeout(onComplete, 700);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas text-ink overflow-hidden"
        >
          {/* Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="absolute bottom-8 right-8 z-50 px-6 py-2.5 rounded-full tactile-pill text-ink hover:text-glow font-cairo text-sm font-bold"
          >
            تخطي
          </button>

          {/* Subtle Warm Glow */}
          <div
            className="absolute w-[42vw] h-[42vw] rounded-full blur-[140px] pointer-events-none"
            style={{ background: 'var(--accent-glow-soft)' }}
          />

          {/* Warm Amber Light Beam */}
          <motion.div
            initial={{ height: 0, opacity: 0, y: -150 }}
            animate={{ height: '35vh', opacity: [0, 0.9, 0], y: 0 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute top-0 w-1 rounded-full amber-glow-dot"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, filter: 'blur(14px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            className="relative z-10 flex flex-col items-center gap-6 px-4 text-center"
          >
            {/* Brand Orb */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full tactile-card flex items-center justify-center relative">
              <div className="relative flex items-center justify-center w-14 h-14">
                <span
                  className="w-2.5 h-12 rounded-full -rotate-[22deg]"
                  style={{
                    backgroundColor: 'var(--accent-glow)',
                    boxShadow: 'var(--accent-glow-shadow)',
                  }}
                />
                <span className="absolute bottom-1 left-1 w-3 h-3 rounded-full bg-ink/80" />
              </div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.9 }}
              className="text-4xl sm:text-6xl font-marhey font-bold text-ink tracking-wide leading-relaxed"
            >
              معرفة تُثمر{' '}
              <span className="text-glow">يقينًا</span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.75, y: 0 }}
            transition={{ duration: 1.2, delay: 2.2 }}
            className="absolute bottom-16 inset-x-0 text-center font-playpen text-sm sm:text-base text-ink-secondary select-none px-4"
          >
            هذا الموقع في إصداره التطويري — طراز Line Studio Bento
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicIntro;
