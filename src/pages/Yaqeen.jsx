import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Play, Pause, X, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';

const Yaqeen = () => {
  const { setYaqeenModeActive } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  const [ayah, setAyah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ayahCount, setAyahCount] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const audioRef = useRef(null);
  const autoAdvanceTimer = useRef(null);

  const fetchRandomAyah = () => {
    setLoading(true);
    setTransitioning(false);
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    if (isPlaying) setIsPlaying(false);

    const randomAyahId = Math.floor(Math.random() * 6236) + 1;

    fetch(`https://api.alquran.cloud/v1/ayah/${randomAyahId}/ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        let pureText = data.data.text;
        if (pureText.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
          pureText = pureText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
        }
        setAyah({ ...data.data, text: pureText });
        setLoading(false);
        setAyahCount((prev) => prev + 1);
        setTimeout(() => {
          setIsPlaying(true);
          setYaqeenModeActive(true);
        }, 500);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleAyahEnded = () => {
    setIsPlaying(false);
    setYaqeenModeActive(false);
    setTransitioning(true);
    autoAdvanceTimer.current = setTimeout(() => {
      fetchRandomAyah();
    }, 3000);
  };

  useEffect(() => {
    fetchRandomAyah();
    return () => {
      setIsPlaying(false);
      setYaqeenModeActive(false);
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && ayah) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, ayah]);

  const handleExit = () => navigate('/');

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-canvas text-ink">
      {/* Subtle Warm Ambient Aura */}
      <motion.div
        animate={{
          opacity: [0.35, 0.7, 0.35],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[640px] h-[640px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: 'var(--accent-glow-soft)' }}
      />

      <ParticlesBackground count={45} color="var(--accent-glow)" />

      {/* Top Controls */}
      <div className="absolute top-6 inset-x-6 flex justify-between items-center z-50">
        <button
          type="button"
          onClick={handleExit}
          className="w-12 h-12 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
          aria-label="خروج من وضع اليقين"
        >
          <X size={20} />
        </button>

        <div className="tactile-pill px-5 py-2 font-bold text-sm flex items-center gap-2.5 font-cairo text-ink">
          <span className="w-2.5 h-2.5 rounded-full amber-glow-dot animate-pulse" />
          <span>وضع اليقين</span>
          {ayahCount > 0 && (
            <span className="text-xs text-ink-muted font-mono">
              · {ayahCount.toLocaleString('ar-EG')}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={fetchRandomAyah}
          className="w-12 h-12 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow"
          title="آية جديدة"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!loading && ayah && (
          <motion.div
            key={ayah.number}
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)', y: 18 }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)', y: -15 }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
            className="relative z-10 max-w-5xl px-6 flex flex-col items-center text-center gap-8"
          >
            <span className="recessed-well px-5 py-2 text-sm font-bold text-glow font-cairo">
              سورة {ayah.surah.name.replace(/س(?:ُورَةُ|ورة)\s*/g, '')}
            </span>

            <h2
              className="text-ink font-uthmanic text-3xl sm:text-5xl md:text-6xl leading-[2.15]"
              style={{ wordSpacing: '6px' }}
            >
              {ayah.text}
              <span className="inline-flex items-center justify-center mx-4 text-2xl md:text-4xl font-bold text-glow">
                ﴿ {ayah.numberInSurah.toLocaleString('ar-EG')} ﴾
              </span>
            </h2>

            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setIsPlaying((p) => !p)}
              className={`w-20 h-20 rounded-full tactile-pill flex items-center justify-center text-glow ${
                isPlaying ? 'active-ayah-glow' : ''
              }`}
            >
              {isPlaying ? (
                <Pause fill="currentColor" className="w-8 h-8" />
              ) : (
                <Play fill="currentColor" className="w-8 h-8 ml-1" />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={ayah?.audio} onEnded={handleAyahEnded} />

      {transitioning && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 3, ease: 'linear' }}
          className="absolute bottom-0 left-0 right-0 h-1 amber-glow-dot origin-right"
          style={{ transformOrigin: 'right' }}
        />
      )}
    </div>
  );
};

export default Yaqeen;
