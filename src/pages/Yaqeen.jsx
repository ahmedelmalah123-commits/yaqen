import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Play, Pause, X, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';

const Yaqeen = () => {
  const { theme, audioState, setAudioState } = useAppStore();
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
    if (audioState.isPlaying) setAudioState({ isPlaying: false });

    const randomAyahId = Math.floor(Math.random() * 6236) + 1;

    fetch(`https://api.alquran.cloud/v1/ayah/${randomAyahId}/ar.alafasy`)
      .then(res => res.json())
      .then(data => {
        let pureText = data.data.text;
        if (pureText.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
          pureText = pureText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
        }
        setAyah({ ...data.data, text: pureText });
        setLoading(false);
        setAyahCount(prev => prev + 1);
        setTimeout(() => {
          setAudioState({ isPlaying: true });
        }, 500);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleAyahEnded = () => {
    setAudioState({ isPlaying: false });
    setTransitioning(true);
    autoAdvanceTimer.current = setTimeout(() => {
      fetchRandomAyah();
    }, 3000);
  };

  useEffect(() => {
    fetchRandomAyah();
    return () => {
      setAudioState({ isPlaying: false });
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && ayah) {
      if (audioState.isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioState.isPlaying, ayah]);

  const handleExit = () => navigate('/');

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-secondary">

      {/* Deep Animated Cosmic Backgrounds */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 10% 20%, rgba(198,162,102,0.2) 0%, rgba(11,17,32,1) 70%)",
            "radial-gradient(circle at 90% 80%, rgba(198,162,102,0.1) 0%, rgba(11,17,32,1) 80%)",
            "radial-gradient(circle at 50% 10%, rgba(198,162,102,0.25) 0%, rgba(8,12,20,1) 60%)",
            "radial-gradient(circle at 10% 20%, rgba(198,162,102,0.2) 0%, rgba(11,17,32,1) 70%)"
          ]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      ></motion.div>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-color-dodge animate-pulse" style={{ animationDuration: '8s' }}></div>

      {/* Dynamic Floating Particles */}
      <ParticlesBackground count={60} color="#FAF8F5" />

      {/* Floating Controls Grid */}
      <div className="absolute top-8 left-8 right-8 flex justify-between z-50">
        <button onClick={handleExit} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-all">
          <X size={28} />
        </button>
        <div className="p-4 rounded-full bg-primary/10 text-primary backdrop-blur-md border border-primary/20 font-bold tracking-widest text-lg flex items-center gap-3 font-reem">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
          وضع اليقين
          {ayahCount > 0 && <span className="text-sm opacity-60 font-tajawal">· {ayahCount}</span>}
        </div>
        <button onClick={fetchRandomAyah} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-all">
          <RefreshCw size={28} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!loading && ayah && (
          <motion.div
            key={ayah.number}
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(15px)', y: 20 }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)', y: -20 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="relative z-10 max-w-6xl px-4 flex flex-col items-center text-center"
          >
            <h3 className="text-primary font-kufi text-2xl md:text-3xl mb-8 md:mb-12 tracking-widest opacity-90 border-b border-primary/30 pb-4">
              سورة {ayah.surah.name.replace(/س(?:ُورَةُ|ورة)\s*/g, '')}
            </h3>

            <h2 className="text-white font-amiri text-3xl md:text-[6rem] leading-[2] md:leading-[2.2] tracking-wide drop-shadow-[0_0_30px_rgba(198,162,102,0.4)]" style={{ wordSpacing: '8px' }}>
              {ayah.text}
              <span className="inline-flex items-center justify-center mx-4 md:mx-6 text-2xl md:text-5xl font-black text-primary opacity-70">
                ﴿ {ayah.numberInSurah.toLocaleString('ar-EG')} ﴾
              </span>
            </h2>

            {/* Play/Pause Button center beneath verse */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAudioState({ isPlaying: !audioState.isPlaying })}
              className="mt-12 md:mt-20 w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/40 flex items-center justify-center text-primary hover:bg-primary hover:text-secondary transition-all shadow-[0_0_30px_rgba(198,162,102,0.3)] backdrop-blur-md"
            >
              {audioState.isPlaying ? <Pause fill="currentColor" className="w-8 h-8 md:w-10 md:h-10" /> : <Play fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 ml-2" />}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={ayah?.audio}
        onEnded={handleAyahEnded}
      />

      {/* Auto-advance transition indicator */}
      {transitioning && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 3, ease: "linear" }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent origin-right"
          style={{ transformOrigin: 'right' }}
        />
      )}

    </div>
  );
};

export default Yaqeen;
