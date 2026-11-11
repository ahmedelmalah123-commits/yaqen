import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const CinematicIntro = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // 100% stable Wikimedia Commons chime (no 403 Hotlinking restrictions)
    audioRef.current = new Audio('https://upload.wikimedia.org/wikipedia/commons/1/1a/Chimes.ogg');
    audioRef.current.volume = 0.6;

    // Automatic silent play (allowed by browser) until first user interaction
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
    setTimeout(onComplete, 800);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A1A14] overflow-hidden"
        >
          {/* Skip Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleComplete(); }}
            className="absolute bottom-8 right-8 z-50 px-6 py-2 rounded-full border border-[#d6a54a]/30 text-[#d6a54a] hover:bg-[#d6a54a]/20 transition-all font-cairo text-sm tracking-widest shadow-lg backdrop-blur-md"
          >
            تخطي
          </button>

          {/* Visual Overlays */}
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-30 mix-blend-overlay"></div>
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/arabic-pattern.png')] opacity-10 mix-blend-color-dodge"></div>
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#d6a54a]/20 via-[#0f1c2c]/60 to-[#0A1A14]"></div>

          {/* Atmospheric Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-[50vw] h-[50vw] bg-[#d6a54a]/10 blur-[150px] rounded-full animate-pulse"></div>
          </div>

          {/* Floating Stardust Particles */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: Math.random() * 100 + "%", y: "100%" }}
                animate={{ 
                  opacity: [0, 0.4, 0], 
                  y: ["100%", "0%"],
                  x: (Math.random() * 100) + (Math.random() * 10 - 5) + "%"
                }}
                transition={{ 
                  duration: 4 + Math.random() * 4, 
                  repeat: Infinity, 
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
                className="absolute w-1 h-1 bg-[#d6a54a] rounded-full blur-[1px]"
              />
            ))}
          </div>

          {/* Celestial Light Path */}
          <motion.div
            initial={{ height: 0, opacity: 0, y: -200 }}
            animate={{ height: "40vh", opacity: [0, 1, 0], y: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute top-0 w-px bg-gradient-to-b from-transparent via-[#d6a54a] to-transparent shadow-[0_0_20px_rgba(200,169,106,1)]"
          />

          <motion.div 
            initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="relative">
              <img loading="lazy" 
                src="/logo.png" 
                alt="Yaqeen Logo" 
                className="w-56 h-56 md:w-80 md:h-80 object-contain drop-shadow-[0_0_15px_rgba(200,169,106,0.8)] drop-shadow-[0_0_30px_rgba(200,169,106,0.4)]" 
                style={{ filter: "brightness(0) saturate(100%) invert(80%) sepia(21%) saturate(942%) hue-rotate(349deg) brightness(87%) contrast(92%)" }} 
              />
            </div>
            
            {/* Slogan - Enlarged & Sweeping Neon Effect */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1.5 }}
              className="mt-6 md:mt-12 text-4xl md:text-6xl lg:text-7xl font-marhey tracking-wide font-semibold text-neon-gold select-none text-center leading-relaxed drop-shadow-[0_0_10px_rgba(200,169,106,0.5)] drop-shadow-[0_0_20px_rgba(200,169,106,0.3)]"
            >
              معرفة تُثمر يقينًا
            </motion.h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 2, delay: 3.5 }}
            className="absolute bottom-16 left-0 right-0 text-center font-playpen text-xl md:text-2xl text-white select-none z-50 px-4"
          >
            هذا الموقع لازال اصدار تجريبي بيتا
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicIntro;
