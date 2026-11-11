import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import {
  Play,
  Pause,
  ArrowRight,
  BookOpen,
  Mic2,
  X,
  SkipForward,
  SkipBack,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Headphones,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { recitersData, reciterGroups, nawadirServers } from '../lib/data/recitersData';
import {
  getBookmarks,
  toggleBookmark,
  isAyahBookmarked,
  BOOKMARKS_EVENT,
} from '../lib/bookmarks';

/* ─── Helpers ───────────────────────────────────────────────────── */
const stripBismillah = (text, surahNumber, isFirstAyah) => {
  if (!text) return '';
  if (surahNumber !== 1 && isFirstAyah) {
    if (text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
      return text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
    }
    if (text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
      return text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
    }
  }
  return text;
};

/* ─── Cinematic Listening Overlay ───────────────────────────────── */
const CinematicOverlay = ({
  surahData,
  currentIndex,
  isPlaying,
  onClose,
  onPlayPause,
  onNext,
  onPrev,
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const ayah = surahData?.ayahs?.[currentIndex];

  useEffect(() => {
    if (surahData && ayah) {
      setBookmarked(isAyahBookmarked(surahData.number, ayah.numberInSurah));
    }
  }, [surahData, ayah, currentIndex]);

  if (!ayah) return null;

  const ayahText = stripBismillah(ayah.text, surahData.number, currentIndex === 0);

  const handleBookmark = () => {
    const entry = {
      surah_id: surahData.number,
      surah_name: surahData.name.replace('سُورَةُ ', ''),
      ayah_num: ayah.numberInSurah,
      ayah_text: ayahText,
      saved_at: new Date().toISOString(),
    };
    const nextState = toggleBookmark(entry);
    setBookmarked(nextState);
  };

  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center overflow-hidden bg-canvas text-ink">
      {/* Subtle Warm Ambient Aura */}
      <motion.div
        animate={{
          opacity: [0.35, 0.65, 0.35],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[620px] h-[620px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: 'var(--accent-glow-soft)' }}
      />

      {/* Top Bar */}
      <div className="absolute top-6 inset-x-6 flex justify-between items-center z-50">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
          aria-label="إغلاق وضع الاستماع"
        >
          <X size={20} />
        </button>

        <div className="tactile-pill px-5 py-2 text-xs sm:text-sm font-bold text-ink flex items-center gap-2.5 font-cairo">
          <span className="w-2.5 h-2.5 rounded-full amber-glow-dot animate-pulse" />
          وضع الاستماع
        </div>

        <div className="w-12" />
      </div>

      {/* Ayah Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${surahData.number}-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)', y: 20 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)', y: -15 }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
          className="relative z-10 max-w-4xl px-6 flex flex-col items-center text-center"
        >
          <span className="tactile-pill px-4 py-1.5 text-sm font-bold text-ink-secondary mb-6 font-cairo">
            سورة {surahData.name.replace('سُورَةُ ', '')}
          </span>
          <h2
            className="text-ink font-uthmanic text-3xl sm:text-5xl md:text-6xl leading-[2.1] tracking-wide"
            style={{ wordSpacing: '6px' }}
          >
            {ayahText}
            <span className="inline-flex items-center justify-center mx-3 text-2xl md:text-4xl font-bold text-glow">
              ﴿ {ayah.numberInSurah.toLocaleString('ar-EG')} ﴾
            </span>
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Controls Capsule */}
      <div className="absolute bottom-14 inset-x-6 flex flex-col items-center gap-5 z-50">
        <div className="recessed-well px-5 py-2.5 flex items-center gap-4 sm:gap-6">
          <button
            onClick={handleBookmark}
            className={`w-11 h-11 rounded-full tactile-pill flex items-center justify-center transition-colors ${
              bookmarked ? 'text-glow' : 'text-ink-secondary hover:text-ink'
            }`}
            title={bookmarked ? 'إزالة من المحفوظات' : 'حفظ الآية'}
          >
            <Bookmark size={18} className={bookmarked ? 'fill-current' : ''} />
          </button>

          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="w-11 h-11 rounded-full tactile-pill flex items-center justify-center text-ink disabled:opacity-30"
            title="الآية السابقة"
          >
            <SkipForward size={18} />
          </button>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={onPlayPause}
            className="w-16 h-16 rounded-full tactile-pill flex items-center justify-center text-glow border-glow-border"
            style={{ boxShadow: isPlaying ? 'var(--accent-glow-shadow)' : 'var(--shadow-raised-sm)' }}
          >
            {isPlaying ? (
              <Pause fill="currentColor" className="w-7 h-7" />
            ) : (
              <Play fill="currentColor" className="w-7 h-7 ml-0.5" />
            )}
          </motion.button>

          <button
            onClick={onNext}
            disabled={currentIndex >= surahData.ayahs.length - 1}
            className="w-11 h-11 rounded-full tactile-pill flex items-center justify-center text-ink disabled:opacity-30"
            title="الآية التالية"
          >
            <SkipBack size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xl flex items-center gap-3">
          <span className="text-ink-secondary text-xs font-mono">
            {(currentIndex + 1).toLocaleString('ar-EG')}
          </span>
          <div className="flex-1 h-2 recessed-well overflow-hidden p-0.5">
            <motion.div
              className="h-full rounded-full amber-glow-dot"
              animate={{
                width: `${((currentIndex + 1) / surahData.ayahs.length) * 100}%`,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-ink-secondary text-xs font-mono">
            {surahData.ayahs.length.toLocaleString('ar-EG')}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── API Fetcher (Preserved 100%) ──────────────────────────────── */
const fetchSurahData = async ({ queryKey, signal }) => {
  const [, id, reciter] = queryKey;

  const fetchWithRetry = (url, retries = 3) => {
    return fetch(url, { signal })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .catch((err) => {
        if (err.name === 'AbortError') throw err;
        if (retries > 0) {
          return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              fetchWithRetry(url, retries - 1).then(resolve).catch(reject);
            }, 500);
            signal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              reject(new Error('AbortError'));
            });
          });
        }
        throw err;
      });
  };

  const isNawadir = Object.keys(nawadirServers).includes(reciter);

  const [surahRes, tafsirRes] = await Promise.all([
    isNawadir
      ? Promise.resolve({ code: 200, data: null })
      : fetchWithRetry(`https://api.alquran.cloud/v1/surah/${id}/${reciter}`),
    fetchWithRetry(`https://api.alquran.cloud/v1/surah/${id}/ar.muyassar`),
  ]);

  if (surahRes.code === 200 && tafsirRes.code === 200) {
    if (isNawadir) {
      const paddedSurahId = String(id).padStart(3, '0');
      const fullAudioUrl = `${nawadirServers[reciter]}/${paddedSurahId}.mp3`;
      const modifiedAyahs = tafsirRes.data.ayahs.map((a) => ({
        ...a,
        audio: fullAudioUrl,
      }));
      return {
        surahData: { ...tafsirRes.data, ayahs: modifiedAyahs },
        tafsirData: tafsirRes.data,
      };
    }
    return { surahData: surahRes.data, tafsirData: tafsirRes.data };
  } else {
    throw new Error('API returned invalid data code');
  }
};

const getJuzName = (num) => {
  const juzNames = {
    1: 'الأول', 2: 'الثاني', 3: 'الثالث', 4: 'الرابع', 5: 'الخامس',
    6: 'السادس', 7: 'السابع', 8: 'الثامن', 9: 'التاسع', 10: 'العاشر',
    11: 'الحادي عشر', 12: 'الثاني عشر', 13: 'الثالث عشر', 14: 'الرابع عشر', 15: 'الخامس عشر',
    16: 'السادس عشر', 17: 'السابع عشر', 18: 'الثامن عشر', 19: 'التاسع عشر', 20: 'العشرون',
    21: 'الحادي والعشرون', 22: 'الثاني والعشرون', 23: 'الثالث والعشرون', 24: 'الرابع والعشرون', 25: 'الخامس والعشرون',
    26: 'السادس والعشرون', 27: 'السابع والعشرون', 28: 'الثامن والعشرون', 29: 'التاسع والعشرون', 30: 'الثلاثون',
  };
  return juzNames[num] || String(num);
};

/* ─── Main Surah Bento Workspace ───────────────────────────────── */
const Surah = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    reciter,
    setReciter,
    setYaqeenModeActive,
    quranFontSize,
    setQuranFontSize,
    isFocusMode,
    toggleFocusMode,
    setBookmarksDrawerOpen,
  } = useAppStore();

  const [viewMode, setViewMode] = useState('mushaf'); // 'mushaf', 'continuous', 'tafsir'
  const [selectedPage, setSelectedPage] = useState(null);
  const [showCinema, setShowCinema] = useState(false);
  const [autoPlayPending, setAutoPlayPending] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarksList, setBookmarksList] = useState(() => getBookmarks());
  const [reciterGroupTab, setReciterGroupTab] = useState('الأكثر استماعاً');

  const audio1Ref = useRef(new Audio());
  const audio2Ref = useRef(new Audio());
  const activePlayer = useRef(1);
  const activeAyahRef = useRef(null);
  const isActiveSurah = true;

  // Sync bookmarks state
  useEffect(() => {
    const sync = () => setBookmarksList(getBookmarks());
    window.addEventListener(BOOKMARKS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['surah', id, reciter],
    queryFn: fetchSurahData,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const surahData = data?.surahData;
  const tafsirData = data?.tafsirData;

  // Group ayahs by page
  const pages = {};
  if (surahData && surahData.ayahs) {
    surahData.ayahs.forEach((ayah, index) => {
      const p = ayah.page || 1;
      if (!pages[p]) {
        pages[p] = [];
      }
      pages[p].push({ ...ayah, originalIndex: index });
    });
  }
  const pageNumbers = Object.keys(pages).map(Number).sort((a, b) => a - b);
  const activePageNum = selectedPage || pageNumbers[0] || 1;
  const pageAyahs = pages[activePageNum] || [];

  // Cleanup audio on unmount
  useEffect(() => {
    const a1 = audio1Ref.current;
    const a2 = audio2Ref.current;
    return () => {
      a1.pause();
      a1.src = '';
      a2.pause();
      a2.src = '';
      setYaqeenModeActive(false);
    };
  }, [setYaqeenModeActive]);

  // Reset initial page when surah changes
  useEffect(() => {
    if (surahData && surahData.ayahs && surahData.ayahs.length > 0) {
      setSelectedPage(surahData.ayahs[0].page);
    }
  }, [surahData]);

  // Follow page during playback
  useEffect(() => {
    if (surahData && surahData.ayahs && surahData.ayahs[currentIndex]) {
      const activePage = surahData.ayahs[currentIndex].page;
      if (activePage !== selectedPage && isPlaying) {
        setSelectedPage(activePage);
      }
    }
  }, [currentIndex, isPlaying, surahData, selectedPage]);

  // Handle highlighted ayah from search or bookmarks
  useEffect(() => {
    if (
      surahData &&
      location.state &&
      typeof location.state.highlightAyahIndex === 'number'
    ) {
      const idx = location.state.highlightAyahIndex;
      if (idx >= 0 && idx < surahData.ayahs.length) {
        setCurrentIndex(idx);
        const activePage = surahData.ayahs[idx].page;
        if (activePage) {
          setSelectedPage(activePage);
        }
      }
    }
  }, [surahData, location.state]);

  // Auto-play on reciter switch
  useEffect(() => {
    if (autoPlayPending && surahData) {
      handlePlaySurah(currentIndex, { openCinema: false });
      setAutoPlayPending(false);
    }
  }, [surahData, autoPlayPending]);

  // Auto-scroll to active ayah
  useEffect(() => {
    if (activeAyahRef.current) {
      activeAyahRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex]);

  const preloadNext = (idx) => {
    if (!surahData || idx >= surahData.ayahs.length) return;
    const nextAudio = activePlayer.current === 1 ? audio2Ref.current : audio1Ref.current;
    if (nextAudio.src !== surahData.ayahs[idx].audio) {
      nextAudio.src = surahData.ayahs[idx].audio;
      nextAudio.load();
    }
  };

  const handleEnded = () => {
    if (!surahData) return;
    if (currentIndex + 1 < surahData.ayahs.length) {
      const nextIndex = currentIndex + 1;
      activePlayer.current = activePlayer.current === 1 ? 2 : 1;
      const currentAudio =
        activePlayer.current === 1 ? audio1Ref.current : audio2Ref.current;

      currentAudio.play().catch(() => {});
      setCurrentIndex(nextIndex);
      preloadNext(nextIndex + 1);
    } else {
      setIsPlaying(false);
      setYaqeenModeActive(false);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    const a1 = audio1Ref.current;
    const a2 = audio2Ref.current;
    a1.addEventListener('ended', handleEnded);
    a2.addEventListener('ended', handleEnded);
    return () => {
      a1.removeEventListener('ended', handleEnded);
      a2.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, surahData]);

  const handlePlaySurah = async (startIndex = 0, options = { openCinema: false }) => {
    if (!surahData) return;
    const currentAudio =
      activePlayer.current === 1 ? audio1Ref.current : audio2Ref.current;

    if (isPlaying && currentIndex === startIndex) {
      currentAudio.pause();
      setIsPlaying(false);
      setYaqeenModeActive(false);
      return;
    }

    audio1Ref.current.pause();
    audio2Ref.current.pause();

    setCurrentIndex(startIndex);
    currentAudio.src = surahData.ayahs[startIndex].audio;
    currentAudio.load();

    try {
      await currentAudio.play();
      setIsPlaying(true);
      if (options.openCinema) setShowCinema(true);
      setYaqeenModeActive(true);
      preloadNext(startIndex + 1);
    } catch (err) {
      console.error(err);
      setIsPlaying(false);
    }
  };

  const handleCinemaClose = () => {
    setShowCinema(false);
  };

  const handleCinemaPlayPause = () => {
    const currentAudio =
      activePlayer.current === 1 ? audio1Ref.current : audio2Ref.current;
    if (isPlaying) {
      currentAudio.pause();
      setIsPlaying(false);
      setYaqeenModeActive(false);
    } else {
      if (!currentAudio.src) {
        handlePlaySurah(currentIndex, { openCinema: false });
      } else {
        currentAudio.play().catch(() => {});
        setIsPlaying(true);
        setYaqeenModeActive(true);
      }
    }
  };

  const handleCinemaNext = () => {
    if (surahData && currentIndex < surahData.ayahs.length - 1) {
      handlePlaySurah(currentIndex + 1, { openCinema: showCinema });
    }
  };

  const handleCinemaPrev = () => {
    if (currentIndex > 0) {
      handlePlaySurah(currentIndex - 1, { openCinema: showCinema });
    }
  };

  const handleSpeakTafsir = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  if (loading && !surahData) {
    return (
      <div className="max-w-[1440px] mx-auto w-full bento-stage min-h-[60vh] flex flex-col items-center justify-center gap-5 p-8">
        <div className="w-14 h-14 rounded-full tactile-pill flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-glow border-t-transparent animate-spin" />
        </div>
        <p className="font-tajawal text-lg font-bold text-ink-secondary">
          جاري إعداد السورة...
        </p>
      </div>
    );
  }

  if (error && !surahData) {
    return (
      <div className="max-w-[1440px] mx-auto w-full bento-stage min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center p-8 font-tajawal">
        <p className="text-xl text-red-500 font-bold">
          {error?.message || 'تعذر تحميل السورة. يرجى التحقق من جودة الاتصال بالإنترنت.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="tactile-pill px-8 py-3 font-bold text-ink hover:text-glow"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!surahData || !surahData.ayahs || !tafsirData) return null;

  const currentAyah = surahData.ayahs[currentIndex] || surahData.ayahs[0];
  const currentTafsirText = tafsirData.ayahs[currentIndex]?.text || '';
  const currentReciterObj = recitersData.find((r) => r.id === reciter);
  const currentAyahCleanText = stripBismillah(
    currentAyah.text,
    surahData.number,
    currentIndex === 0
  );
  const isCurrentBookmarked = isAyahBookmarked(
    surahData.number,
    currentAyah.numberInSurah
  );
  const fontProgressPercent = ((quranFontSize - 24) / (60 - 24)) * 100;
  const surahProgressPercent = ((currentIndex + 1) / surahData.ayahs.length) * 100;

  return (
    <div className="max-w-[1440px] mx-auto w-full font-tajawal">
      {/* Cinematic Listening Overlay */}
      <AnimatePresence>
        {showCinema && isActiveSurah && (
          <CinematicOverlay
            surahData={surahData}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            onClose={handleCinemaClose}
            onPlayPause={handleCinemaPlayPause}
            onNext={handleCinemaNext}
            onPrev={handleCinemaPrev}
          />
        )}
      </AnimatePresence>

      {/* Bento Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ═══ MAIN SURAH STAGE (70% / 100% in Focus Mode) ═══ */}
        <section
          className={`${
            isFocusMode ? 'lg:col-span-12' : 'lg:col-span-8'
          } bento-stage p-4 sm:p-7 flex flex-col gap-6 transition-all duration-300`}
        >
          {/* 1. Stage Header */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Link
                  to="/quran"
                  className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
                  title="العودة لفهرس السور"
                >
                  <ArrowRight size={18} />
                </Link>
                <span className="text-xs sm:text-sm font-bold text-ink-muted tracking-wide">
                  {String(surahData.number).padStart(2, '0')} —{' '}
                  {surahData.name.replace(/س(?:ُورَةُ|ورة)\s*/g, 'سورة ')} · الجزء{' '}
                  {getJuzName(pageAyahs[0]?.juz || currentAyah?.juz || 1)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFocusMode}
                  className={`tactile-pill px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 ${
                    isFocusMode ? 'text-glow border-glow-border' : 'text-ink-secondary hover:text-ink'
                  }`}
                  title={isFocusMode ? 'إظهار اللوحة الجانبية' : 'وضع التركيز وتوسيع المصحف'}
                >
                  {isFocusMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  <span>{isFocusMode ? 'إنهاء التركيز' : 'وضع التركيز'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-5xl font-black font-cairo text-ink leading-tight">
                  سورة {surahData.name.replace('سُورَةُ ', '')}
                </h1>
                <p className="text-sm text-ink-secondary mt-1.5 font-medium">
                  {surahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} ·{' '}
                  {surahData.ayahs.length.toLocaleString('ar-EG')} آية
                </p>
              </div>

              <button
                type="button"
                onClick={() => handlePlaySurah(currentIndex, { openCinema: false })}
                className={`tactile-pill px-6 py-3 font-bold text-sm flex items-center justify-center gap-2.5 shrink-0 ${
                  isPlaying ? 'active-ayah-glow text-glow' : 'text-ink hover:text-glow'
                }`}
              >
                {isPlaying ? (
                  <Pause size={16} fill="currentColor" />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
                <span>{isPlaying ? 'إيقاف التلاوة' : 'استمع للسورة'}</span>
              </button>
            </div>
          </div>

          {/* 2. Carved Font-Size Slider & View Mode Bar (Line Studio `size 40` inspiration) */}
          <div className="recessed-box p-3.5 sm:p-4 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
            {/* Carved Font-Size Slider */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xs font-bold text-ink-secondary shrink-0">
                حجم الخط
              </span>

              <div
                className="recessed-well h-5 flex-1 min-w-[130px] relative flex items-center px-1.5"
                dir="ltr"
              >
                {/* Filled inner glow bar */}
                <div
                  className="h-2 rounded-full transition-all duration-150 pointer-events-none"
                  style={{
                    width: `${fontProgressPercent}%`,
                    backgroundColor: 'var(--accent-glow)',
                    opacity: 0.75,
                  }}
                />
                {/* Raised puck indicator */}
                <div
                  className="w-4 h-4 rounded-full tactile-pill absolute pointer-events-none transition-all duration-75"
                  style={{
                    left: `calc(${fontProgressPercent}% - ${(fontProgressPercent / 100) * 16}px)`,
                  }}
                />
                <input
                  type="range"
                  min={24}
                  max={60}
                  step={1}
                  value={quranFontSize}
                  onChange={(e) => setQuranFontSize(Number(e.target.value))}
                  aria-label="التحكم في حجم خط المصحف"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <span className="tactile-pill px-3 py-1 text-xs font-mono font-bold text-ink shrink-0">
                {quranFontSize}
              </span>
            </div>

            {/* View Switcher */}
            <div className="recessed-well p-1.5 flex flex-wrap items-center gap-1.5">
              {[
                { id: 'mushaf', label: 'المصحف (صفحات)', icon: BookOpen },
                { id: 'continuous', label: 'آيات متتالية', icon: BookOpen },
                { id: 'tafsir', label: 'التفسير والكروت', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = viewMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setViewMode(tab.id)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                      active
                        ? 'tactile-pill text-ink'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    <Icon size={13} className={active ? 'text-glow' : ''} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setShowCinema(true);
                  if (!isPlaying) {
                    handlePlaySurah(currentIndex, { openCinema: true });
                  }
                }}
                className="px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 text-ink-secondary hover:text-glow transition-colors"
              >
                <Headphones size={13} />
                <span>وضع الاستماع</span>
              </button>
            </div>
          </div>

          {/* 3. Bismillah */}
          {surahData.number !== 1 && surahData.number !== 9 && (
            <div className="recessed-box py-4 px-6 text-center font-amiri text-2xl sm:text-3xl text-ink">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}

          {/* 4. Reading Area */}
          {viewMode === 'mushaf' && (
            <div className="flex flex-col gap-5">
              {/* Page Quick Selector */}
              {pageNumbers.length > 1 && (
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-ink-secondary shrink-0">
                    الصفحات:
                  </span>
                  <div className="recessed-well p-1 flex gap-1 overflow-x-auto no-scrollbar max-w-full">
                    {pageNumbers.map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setSelectedPage(pageNum)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                          activePageNum === pageNum
                            ? 'tactile-pill text-glow'
                            : 'text-ink-secondary hover:text-ink'
                        }`}
                      >
                        {pageNum.toLocaleString('ar-EG')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Carved Mushaf Frame */}
              <div className="tactile-card p-5 sm:p-9 md:p-12 flex flex-col justify-between min-h-[520px]">
                {/* Page Header */}
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-[var(--glass-border-subtle)] text-xs font-bold text-ink-secondary">
                  <span>الجزء {getJuzName(pageAyahs[0]?.juz || 1)}</span>
                  <span className="font-cairo text-sm text-ink">
                    {surahData.name}
                  </span>
                  <span>صفحة {activePageNum.toLocaleString('ar-EG')}</span>
                </div>

                {/* Inline Uthmanic Script */}
                <div
                  className="text-justify font-uthmanic dir-rtl select-none text-ink"
                  style={{
                    fontSize: `${quranFontSize}px`,
                    lineHeight: 2.25,
                    wordSpacing: '4px',
                    textAlignLast: 'center',
                  }}
                >
                  {pageAyahs.map((ayah) => {
                    const isCurrent = currentIndex === ayah.originalIndex;
                    const ayahText = stripBismillah(
                      ayah.text,
                      surahData.number,
                      ayah.numberInSurah === 1
                    );

                    return (
                      <span
                        key={ayah.number}
                        ref={isCurrent ? activeAyahRef : null}
                        onClick={() =>
                          handlePlaySurah(ayah.originalIndex, { openCinema: false })
                        }
                        className={`inline cursor-pointer transition-all duration-300 mx-1 px-1.5 py-0.5 rounded-xl border ${
                          isCurrent
                            ? 'active-ayah-glow text-ink'
                            : 'border-transparent hover:bg-[var(--bg-recessed)]/60'
                        }`}
                      >
                        {ayahText}
                        <span
                          className={`inline-block mx-1.5 font-bold select-none whitespace-nowrap align-middle ${
                            isCurrent ? 'text-glow' : 'text-ink-muted'
                          }`}
                          style={{ fontSize: `${Math.max(18, quranFontSize * 0.65)}px` }}
                        >
                          ﴿ {ayah.numberInSurah.toLocaleString('ar-EG')} ﴾
                        </span>
                      </span>
                    );
                  })}
                </div>

                {/* Page Footer Navigation */}
                <div className="mt-8 pt-4 border-t border-[var(--glass-border-subtle)] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const idx = pageNumbers.indexOf(activePageNum);
                      if (idx > 0) setSelectedPage(pageNumbers[idx - 1]);
                    }}
                    disabled={activePageNum === pageNumbers[0]}
                    className="tactile-pill px-4 py-2 text-xs font-bold flex items-center gap-1.5 text-ink disabled:opacity-30"
                  >
                    <ChevronRight size={15} />
                    <span>الصفحة السابقة</span>
                  </button>

                  <span className="recessed-well px-4 py-1.5 text-xs font-bold text-ink-secondary">
                    صفحة {activePageNum.toLocaleString('ar-EG')}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const idx = pageNumbers.indexOf(activePageNum);
                      if (idx < pageNumbers.length - 1)
                        setSelectedPage(pageNumbers[idx + 1]);
                    }}
                    disabled={activePageNum === pageNumbers[pageNumbers.length - 1]}
                    className="tactile-pill px-4 py-2 text-xs font-bold flex items-center gap-1.5 text-ink disabled:opacity-30"
                  >
                    <span>الصفحة التالية</span>
                    <ChevronLeft size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'continuous' && (
            <div className="tactile-card p-5 sm:p-9 md:p-12" dir="rtl">
              <div
                className="font-uthmanic text-justify text-ink select-none"
                style={{
                  fontSize: `${quranFontSize}px`,
                  lineHeight: 2.3,
                  wordSpacing: '4px',
                }}
              >
                {surahData.ayahs.map((ayah, index) => {
                  const isCurrent = isActiveSurah && currentIndex === index;
                  const ayahText = stripBismillah(
                    ayah.text,
                    surahData.number,
                    index === 0
                  );

                  return (
                    <span
                      key={ayah.number}
                      ref={isCurrent ? activeAyahRef : null}
                      onClick={() =>
                        handlePlaySurah(index, { openCinema: false })
                      }
                      className={`inline cursor-pointer transition-all duration-300 mx-1 px-1.5 py-0.5 rounded-xl border ${
                        isCurrent
                          ? 'active-ayah-glow text-ink'
                          : 'border-transparent hover:bg-[var(--bg-recessed)]/60'
                      }`}
                    >
                      {ayahText}
                      <span
                        className={`inline-block mx-1.5 font-bold select-none whitespace-nowrap align-middle ${
                          isCurrent ? 'text-glow' : 'text-ink-muted'
                        }`}
                        style={{ fontSize: `${Math.max(18, quranFontSize * 0.65)}px` }}
                      >
                        ﴿ {ayah.numberInSurah.toLocaleString('ar-EG')} ﴾
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'tafsir' && (
            <div className="space-y-4">
              {surahData.ayahs.map((ayah, index) => {
                const isCurrent = isActiveSurah && currentIndex === index;
                const tafsirText = tafsirData.ayahs[index].text;
                const ayahText = stripBismillah(
                  ayah.text,
                  surahData.number,
                  index === 0
                );
                const bookmarked = bookmarksList.some(
                  (b) =>
                    Number(b.surah_id) === Number(surahData.number) &&
                    Number(b.ayah_num) === Number(ayah.numberInSurah)
                );

                return (
                  <motion.div
                    key={ayah.number}
                    ref={isCurrent ? activeAyahRef : null}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`p-5 sm:p-7 rounded-[24px] flex flex-col gap-5 relative transition-all ${
                      isCurrent ? 'active-ayah-glow' : 'tactile-card'
                    }`}
                  >
                    {isCurrent && (
                      <span
                        className="absolute top-4 left-4 w-2.5 h-2.5 rounded-full amber-glow-dot"
                        aria-hidden="true"
                      />
                    )}

                    {/* Ayah Text */}
                    <p
                      className="font-uthmanic text-ink text-right"
                      style={{
                        fontSize: `${quranFontSize}px`,
                        lineHeight: 2.15,
                      }}
                    >
                      {ayahText}
                      <span
                        className={`mx-2 font-bold ${
                          isCurrent ? 'text-glow' : 'text-ink-muted'
                        }`}
                        style={{ fontSize: `${Math.max(18, quranFontSize * 0.65)}px` }}
                      >
                        ﴿ {ayah.numberInSurah.toLocaleString('ar-EG')} ﴾
                      </span>
                    </p>

                    {/* Tafsir Block */}
                    <div className="recessed-box p-4 flex items-start gap-3">
                      <p className="text-sm sm:text-base leading-relaxed text-ink-secondary flex-1">
                        {tafsirText}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeakTafsir(tafsirText);
                        }}
                        className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow shrink-0"
                        title="استمع للتفسير"
                      >
                        <Mic2 size={16} />
                      </button>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            handlePlaySurah(index, { openCinema: false })
                          }
                          className={`tactile-pill px-4 py-2 text-xs font-bold flex items-center gap-2 ${
                            isCurrent && isPlaying
                              ? 'active-ayah-glow text-glow'
                              : 'text-ink hover:text-glow'
                          }`}
                        >
                          {isCurrent && isPlaying ? (
                            <Pause size={14} fill="currentColor" />
                          ) : (
                            <Play size={14} fill="currentColor" />
                          )}
                          <span>
                            {isCurrent && isPlaying ? 'يتم التشغيل' : 'تشغيل'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            toggleBookmark({
                              surah_id: surahData.number,
                              surah_name: surahData.name.replace('سُورَةُ ', ''),
                              ayah_num: ayah.numberInSurah,
                              ayah_text: ayahText,
                              saved_at: new Date().toISOString(),
                            });
                          }}
                          className={`w-10 h-10 rounded-full tactile-pill flex items-center justify-center transition-colors ${
                            bookmarked ? 'text-glow' : 'text-ink-secondary hover:text-glow'
                          }`}
                          title={bookmarked ? 'إزالة من المحفوظات' : 'احفظ الآية'}
                        >
                          <Bookmark
                            size={16}
                            className={bookmarked ? 'fill-current' : ''}
                          />
                        </button>
                      </div>

                      <span className="text-xs font-mono text-ink-muted">
                        آية {ayah.numberInSurah.toLocaleString('ar-EG')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 5. Bottom Carved Glass Audio Bar */}
          <div className="recessed-well p-2 rounded-[28px] sm:rounded-full mt-2">
            <div className="glass-card rounded-[24px] sm:rounded-full px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Controls */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCinemaPrev}
                  disabled={currentIndex === 0}
                  className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-ink disabled:opacity-30"
                  title="الآية السابقة"
                >
                  <SkipForward size={15} />
                </button>

                <button
                  type="button"
                  onClick={handleCinemaPlayPause}
                  className={`w-11 h-11 rounded-full tactile-pill flex items-center justify-center transition-all ${
                    isPlaying ? 'active-ayah-glow text-glow' : 'text-ink hover:text-glow'
                  }`}
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                >
                  {isPlaying ? (
                    <Pause size={17} fill="currentColor" />
                  ) : (
                    <Play size={17} fill="currentColor" className="ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCinemaNext}
                  disabled={currentIndex >= surahData.ayahs.length - 1}
                  className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-ink disabled:opacity-30"
                  title="الآية التالية"
                >
                  <SkipBack size={15} />
                </button>
              </div>

              {/* Active Reciter & Progress */}
              <div className="flex-1 w-full sm:w-auto flex flex-col gap-1.5 min-w-0 px-2">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-bold text-ink truncate">
                    {currentReciterObj?.name || 'القارئ'}
                  </span>
                  <span className="text-ink-secondary font-mono shrink-0">
                    آية {currentAyah.numberInSurah.toLocaleString('ar-EG')} /{' '}
                    {surahData.ayahs.length.toLocaleString('ar-EG')}
                  </span>
                </div>
                <div className="recessed-well h-2 p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-full amber-glow-dot transition-all duration-300"
                    style={{ width: `${surahProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    toggleBookmark({
                      surah_id: surahData.number,
                      surah_name: surahData.name.replace('سُورَةُ ', ''),
                      ayah_num: currentAyah.numberInSurah,
                      ayah_text: currentAyahCleanText,
                      saved_at: new Date().toISOString(),
                    });
                  }}
                  className={`w-10 h-10 rounded-full tactile-pill flex items-center justify-center ${
                    isCurrentBookmarked ? 'text-glow' : 'text-ink-secondary hover:text-glow'
                  }`}
                  title="حفظ الآية الحالية"
                >
                  <Bookmark
                    size={15}
                    className={isCurrentBookmarked ? 'fill-current' : ''}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCinema(true);
                    if (!isPlaying) {
                      handlePlaySurah(currentIndex, { openCinema: true });
                    }
                  }}
                  className="tactile-pill px-3.5 py-2 text-xs font-bold text-ink hover:text-glow flex items-center gap-1.5"
                >
                  <Headphones size={14} />
                  <span>الاستماع</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ LEFT 2-CARD BENTO STACK (30% on Desktop) ═══ */}
        {!isFocusMode && (
          <aside className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-4">
            {/* TOP BENTO CARD: Live Tafsir & Reciter Switcher */}
            <div className="tactile-card p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-ink-muted block">
                    التفسير الميسر الحي
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-ink font-cairo">
                    تدبّر الآية {currentAyah.numberInSurah.toLocaleString('ar-EG')}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeakTafsir(currentTafsirText)}
                  className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow"
                  title="استمع للتفسير الميسر"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              {/* Live Tafsir Box */}
              <div className="recessed-box p-4 text-sm leading-relaxed text-ink-secondary max-h-[210px] overflow-y-auto no-scrollbar">
                {currentTafsirText}
              </div>

              {/* Reciter Switcher Inside Card */}
              <div className="pt-3 border-t border-[var(--glass-border-subtle)] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-secondary">
                    القارئ النشط
                  </span>
                  <span className="text-xs font-bold text-glow">
                    {currentReciterObj?.name}
                  </span>
                </div>

                {/* Group Tabs */}
                <div className="recessed-well p-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {reciterGroups.map((g) => (
                    <button
                      key={g.group}
                      type="button"
                      onClick={() => setReciterGroupTab(g.group)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                        reciterGroupTab === g.group
                          ? 'tactile-pill text-ink'
                          : 'text-ink-secondary hover:text-ink'
                      }`}
                    >
                      {g.group}
                    </button>
                  ))}
                </div>

                {/* Group Reciters Pills */}
                <div className="flex flex-wrap gap-1.5 max-h-[150px] overflow-y-auto no-scrollbar py-0.5">
                  {(
                    reciterGroups.find((g) => g.group === reciterGroupTab)
                      ?.reciters || []
                  ).map((r) => {
                    const isSelected = reciter === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setReciter(r.id);
                          setAutoPlayPending(true);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          isSelected
                            ? 'active-ayah-glow text-glow'
                            : 'tactile-pill text-ink-secondary hover:text-ink'
                        }`}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BOTTOM BENTO CARD: Progress Stats & Quick Bookmarks (Line Studio `0 EGP` style) */}
            <div className="tactile-card p-5 sm:p-6 flex flex-col justify-between gap-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-secondary">
                  موضع القراءة الحالي
                </span>
                <button
                  type="button"
                  onClick={() =>
                    toggleBookmark({
                      surah_id: surahData.number,
                      surah_name: surahData.name.replace('سُورَةُ ', ''),
                      ayah_num: currentAyah.numberInSurah,
                      ayah_text: currentAyahCleanText,
                      saved_at: new Date().toISOString(),
                    })
                  }
                  className={`tactile-pill px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 ${
                    isCurrentBookmarked ? 'text-glow' : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  <Bookmark
                    size={13}
                    className={isCurrentBookmarked ? 'fill-current' : ''}
                  />
                  <span>{isCurrentBookmarked ? 'محفوظة' : 'احفظ الآية'}</span>
                </button>
              </div>

              {/* Large Clear Stat Display */}
              <div>
                <div className="text-4xl xl:text-5xl font-black font-cairo text-ink tracking-tight">
                  {(currentIndex + 1).toLocaleString('ar-EG')}{' '}
                  <span className="text-lg font-bold text-ink-muted">
                    / {surahData.ayahs.length.toLocaleString('ar-EG')} آية
                  </span>
                </div>
                <div className="recessed-well h-3 mt-3 p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-full amber-glow-dot transition-all duration-300"
                    style={{ width: `${surahProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stacked Mini Cards for Recent Bookmarks */}
              <div className="pt-3 border-t border-[var(--glass-border-subtle)] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-secondary">
                    آخر المحفوظات ({bookmarksList.length.toLocaleString('ar-EG')})
                  </span>
                  <button
                    type="button"
                    onClick={() => setBookmarksDrawerOpen(true)}
                    className="text-xs font-bold text-glow hover:underline"
                  >
                    عرض الكل
                  </button>
                </div>

                {bookmarksList.length === 0 ? (
                  <div className="recessed-box p-3 text-xs text-ink-muted text-center">
                    لا توجد آيات محفوظة بعد
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookmarksList.slice(0, 2).map((b, i) => (
                      <button
                        key={`${b.surah_id}-${b.ayah_num}-${i}`}
                        type="button"
                        onClick={() =>
                          navigate(`/surah/${b.surah_id}`, {
                            state: {
                              highlightAyahIndex: Math.max(0, Number(b.ayah_num) - 1),
                            },
                          })
                        }
                        className="w-full text-right recessed-box p-3 flex items-center justify-between gap-2 hover:border-glow-border transition-colors"
                      >
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-glow block">
                            سورة {b.surah_name} · آية{' '}
                            {Number(b.ayah_num).toLocaleString('ar-EG')}
                          </span>
                          <p className="text-xs text-ink-secondary truncate font-uthmanic mt-0.5">
                            {b.ayah_text}
                          </p>
                        </div>
                        <ChevronLeft size={14} className="text-ink-muted shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Surah;
