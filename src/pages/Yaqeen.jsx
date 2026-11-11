import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, RefreshCw, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useAudioStore } from '../store/useAudioStore';
import { fetchSurahAyahTiming } from '../features/quran/quranApi';
import { getSurahAudioUrl } from '../lib/data/recitersData';
import { stripBismillah, stripSurahPrefix, toArabicDigits } from '../lib/arabicSearch';

const STAR_COORDS = Array.from({ length: 32 }, (_, idx) => ({
  id: idx,
  top: `${(idx * 37) % 100}%`,
  left: `${(idx * 53 + 11) % 100}%`,
  size: (idx % 3) + 2,
  delay: (idx % 5) * 0.7,
}));

const Yaqeen = () => {
  const navigate = useNavigate();
  const setYaqeenModeActive = useAppStore((s) => s.setYaqeenModeActive);
  const pauseGlobalAudio = useAudioStore((s) => s.pause);

  const [ayah, setAyah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ayahCount, setAyahCount] = useState(0);

  const audioRef = useRef(null);
  const advanceTimerRef = useRef(null);
  const activeClipRef = useRef(null);

  const stars = useMemo(() => STAR_COORDS, []);

  const fetchRandomAyah = useCallback(async () => {
    setLoading(true);
    setError(false);
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    activeClipRef.current = null;

    const randomGlobalNum = Math.floor(Math.random() * 6236) + 1;
    try {
      const uthmaniRes = await fetch(
        `https://api.alquran.cloud/v1/ayah/${randomGlobalNum}/quran-uthmani`
      ).then((r) => r.json());

      const data = uthmaniRes?.data;
      if (!data) throw new Error('Failed to load verse');

      const surahNum = Number(data.surah.number);
      const totalAyahs = Number(data.surah.numberOfAyahs) || 0;
      const surahAudioUrl = getSurahAudioUrl('ar.alafasy', surahNum);

      const timingData = await fetchSurahAyahTiming(123, surahNum, totalAyahs).catch(() => ({
        timingAvailable: false,
        segments: [],
      }));
      const seg = timingData.segments.find((s) => s.ayah === data.numberInSurah) || null;

      const cleanText = stripBismillah(data.text, surahNum, data.numberInSurah === 1);
      const startSeconds = seg ? seg.startTimeMs / 1000 : null;
      const endSeconds = seg ? seg.endTimeMs / 1000 : null;

      activeClipRef.current =
        startSeconds !== null && endSeconds !== null ? { startSeconds, endSeconds } : null;

      setAyah({
        ...data,
        text: cleanText,
        audioUrl: surahAudioUrl,
        startSeconds,
        endSeconds,
      });
      setAyahCount((c) => c + 1);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setYaqeenModeActive(true);
    pauseGlobalAudio();
    const audio = new Audio();
    audioRef.current = audio;

    const finishClip = () => {
      audio.pause();
      setIsPlaying(false);
      advanceTimerRef.current = window.setTimeout(() => {
        fetchRandomAyah();
      }, 2800);
    };

    const handleTimeUpdate = () => {
      const clip = activeClipRef.current;
      if (!clip) return;
      if (audio.currentTime >= clip.endSeconds) {
        finishClip();
      }
    };

    const handleLoadedMetadata = () => {
      const clip = activeClipRef.current;
      if (!clip) return;
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = Math.min(clip.startSeconds, Math.max(0, audio.duration - 0.25));
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', finishClip);
    fetchRandomAyah();

    return () => {
      setYaqeenModeActive(false);
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      audio.pause();
      audio.removeAttribute('src');
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', finishClip);
    };
  }, [setYaqeenModeActive, pauseGlobalAudio, fetchRandomAyah]);

  const canPlayClip = Boolean(ayah?.audioUrl && ayah?.startSeconds !== null && ayah?.endSeconds !== null);

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !canPlayClip || !ayah) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    if (audio.src !== ayah.audioUrl) {
      audio.src = ayah.audioUrl;
      audio.load();
    } else if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = Math.min(ayah.startSeconds, Math.max(0, audio.duration - 0.25));
    }
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-canvas text-ink flex flex-col items-center justify-center p-6 overflow-hidden font-tajawal"
      dir="rtl"
    >
      {/* Ambient subtle floating dots */}
      <div className="absolute inset-0 pointer-events-none opacity-45" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-glow/40 animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <div className="absolute top-5 inset-x-5 flex items-center justify-between gap-3 z-10">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="خروج من وضع اليقين"
          className="w-11 h-11 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
        >
          <X size={19} />
        </button>

        <div className="tactile-pill px-5 py-2 text-xs sm:text-sm font-extrabold font-cairo text-ink flex items-center gap-2">
          <span className="w-2 h-2 rounded-full amber-glow-dot animate-pulse" />
          <span>وضع اليقين</span>
          {ayahCount > 0 && (
            <span className="font-mono text-ink-muted text-xs">· {toArabicDigits(ayahCount)}</span>
          )}
        </div>

        <button
          type="button"
          onClick={fetchRandomAyah}
          title="آية جديدة"
          aria-label="جلب آية جديدة للتدبر"
          className="w-11 h-11 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Center Meditative Verse */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-bold text-ink-secondary"
          >
            جاري استحضار آية للتدبر...
          </motion.div>
        ) : error || !ayah ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bento-stage p-8 text-center flex flex-col items-center gap-4 z-10"
          >
            <p className="text-base font-bold text-ink">تعذر تحميل الآية، يرجى المحاولة مرة أخرى.</p>
            <button
              type="button"
              onClick={fetchRandomAyah}
              className="tactile-pill px-5 py-2 text-xs font-bold text-glow"
            >
              إعادة المحاولة
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={ayah.number}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-4xl text-center flex flex-col items-center gap-7"
          >
            <Link
              to={`/surah/${ayah.surah.number}?ayah=${ayah.numberInSurah}`}
              className="recessed-well px-5 py-1.5 text-xs sm:text-sm font-bold text-glow hover:underline flex items-center gap-2"
            >
              <BookOpen size={14} />
              <span>
                سورة {stripSurahPrefix(ayah.surah.name)} · آية {toArabicDigits(ayah.numberInSurah)}
              </span>
            </Link>

            <h1 className="font-uthmanic quran-text-render text-3xl sm:text-5xl md:text-6xl leading-[2.15] text-ink select-text">
              {ayah.text}
              <span className="inline-block mx-3 font-cairo text-2xl sm:text-3xl font-bold text-glow">
                ﴿{toArabicDigits(ayah.numberInSurah)}﴾
              </span>
            </h1>

            <button
              type="button"
              disabled={!canPlayClip}
              onClick={handleTogglePlay}
              title={
                canPlayClip
                  ? 'استماع لمقطع الآية من التلاوة الكاملة'
                  : 'المقطع الزمني للآية غير متوفر حالياً — افتح السورة للاستماع'
              }
              aria-label={isPlaying ? 'إيقاف التلاوة' : 'استماع للآية'}
              className={`w-16 h-16 rounded-full tactile-pill flex items-center justify-center text-glow disabled:opacity-40 disabled:cursor-not-allowed ${
                isPlaying ? 'active-ayah-glow' : ''
              }`}
            >
              {isPlaying ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Yaqeen;
