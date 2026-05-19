import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import { Play, Pause, ArrowRight, BookOpen, Mic2, X, SkipForward, SkipBack, Bookmark } from 'lucide-react';

/* ─── Cinematic Listening Overlay ───────────────────────────────── */
const CinematicOverlay = ({ surahData, currentIndex, isPlaying, onClose, onPlayPause, onNext, onPrev }) => {
  const [isSaved, setIsSaved] = useState(false);
  const ayah = surahData?.ayahs?.[currentIndex];
  if (!ayah) return null;

  let ayahText = ayah.text;
  if (surahData.number !== 1 && currentIndex === 0 && ayahText.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
    ayahText = ayahText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
  }

  // Reset saved state when ayah changes
  useEffect(() => { setIsSaved(false); }, [currentIndex]);

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('yaqeen_bookmarks') || '[]');
    const entry = {
      surah_id: surahData.number,
      surah_name: surahData.name.replace('سُورَةُ ', ''),
      ayah_num: ayah.numberInSurah,
      ayah_text: ayahText,
      saved_at: new Date().toISOString(),
    };
    const exists = bookmarks.some(b => b.surah_id === entry.surah_id && b.ayah_num === entry.ayah_num);
    if (!exists) {
      localStorage.setItem('yaqeen_bookmarks', JSON.stringify([...bookmarks, entry]));
    }
    setIsSaved(true);
  };

  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center overflow-hidden bg-secondary">
      {/* Animated background */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 10% 20%, rgba(198,162,102,0.25) 0%, rgba(11,17,32,1) 70%)",
            "radial-gradient(circle at 90% 80%, rgba(198,162,102,0.15) 0%, rgba(11,17,32,1) 80%)",
            "radial-gradient(circle at 50% 10%, rgba(198,162,102,0.2) 0%, rgba(8,12,20,1) 60%)",
            "radial-gradient(circle at 10% 20%, rgba(198,162,102,0.25) 0%, rgba(11,17,32,1) 70%)",
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      />
      {/* Stars texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-color-dodge" />

      {/* Top bar */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
        <button onClick={onClose} className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white backdrop-blur-md transition-all border border-white/10">
          <X size={24} />
        </button>
        <div className="px-5 py-2.5 rounded-full bg-primary/10 text-primary backdrop-blur-md border border-primary/20 font-bold tracking-widest text-base flex items-center gap-3 font-reem">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          وضع الاستماع
        </div>
        <div className="w-14" />
      </div>

      {/* Ayah content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${surahData.number}-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(12px)', y: 30 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(15px)', y: -20 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="relative z-10 max-w-5xl px-6 flex flex-col items-center text-center"
        >
          <h3 className="text-primary font-kufi text-xl md:text-2xl mb-8 tracking-widest opacity-90 border-b border-primary/30 pb-3 font-reem">
            سورة {surahData.name.replace('سُورَةُ ', '')}
          </h3>
          <h2 className="text-white font-amiri text-3xl md:text-6xl leading-[2] md:leading-[2.2] tracking-wide drop-shadow-[0_0_25px_rgba(198,162,102,0.35)]" style={{ wordSpacing: '6px' }}>
            {ayahText}
            <span className="inline-flex items-center justify-center mx-4 text-2xl md:text-4xl font-black text-primary opacity-60">
              ﴿ {ayah.numberInSurah.toLocaleString('ar-EG')} ﴾
            </span>
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-16 flex items-center gap-6 md:gap-8 z-50">
        <button onClick={handleBookmark} disabled={isSaving || isSaved} className={`p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all ${isSaved ? 'text-green-400' : 'text-primary'} disabled:opacity-50`}>
          <Bookmark size={24} className={isSaved ? "fill-current" : ""} />
        </button>
        <button onClick={onPrev} disabled={currentIndex === 0} className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-primary backdrop-blur-md transition-all disabled:opacity-30">
          <SkipForward size={24} />
        </button>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={onPlayPause}
          className="w-20 h-20 rounded-full border-2 border-primary/40 flex items-center justify-center text-primary hover:bg-primary hover:text-secondary transition-all shadow-[0_0_30px_rgba(198,162,102,0.3)] backdrop-blur-md"
        >
          {isPlaying
            ? <Pause fill="currentColor" className="w-8 h-8" />
            : <Play fill="currentColor" className="w-8 h-8 ml-1" />
          }
        </motion.button>
        <button onClick={onNext} disabled={currentIndex >= surahData.ayahs.length - 1} className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-primary backdrop-blur-md transition-all disabled:opacity-30">
          <SkipBack size={24} />
        </button>

        <div className="w-14 hidden md:block"></div> {/* Helper spacer */}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-12 right-12 flex items-center gap-3 z-50">
        <span className="text-primary/60 text-sm font-tajawal">{(currentIndex + 1).toLocaleString('ar-EG')}</span>
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
            animate={{ width: `${((currentIndex + 1) / surahData.ayahs.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-primary/60 text-sm font-tajawal">{surahData.ayahs.length.toLocaleString('ar-EG')}</span>
      </div>
    </div>
  );
};

const reciterGroups = [
  {
    group: 'الأكثر استماعاً',
    reciters: [
      { id: 'ar.alafasy',            name: 'مشاري العفاسي' },
      { id: 'ar.abdulbasitmurattal', name: 'عبدالباسط (مرتل)' },
      { id: 'ar.mahermuaiqly',      name: 'ماهر المعيقلي' },
      { id: 'ar.abdurrahmaansudais', name: 'السديس' },
      { id: 'ar.saoodshuraym',      name: 'سعود الشريم' },
    ]
  },
  {
    group: 'ترتيل',
    reciters: [
      { id: 'ar.minshawi',         name: 'المنشاوي (مرتل)' },
      { id: 'ar.husary',           name: 'الحصري (مرتل)' },
      { id: 'ar.ahmedajamy',       name: 'أحمد العجمي' },
      { id: 'ar.hudhaify',         name: 'علي الحذيفي' },
      { id: 'ar.shaatree',         name: 'أبو بكر الشاطري' },
      { id: 'ar.muhammadayyoob',   name: 'محمد أيوب' },
      { id: 'ar.muhammadjibreel',  name: 'محمد جبريل' },
      { id: 'ar.hanirifai',        name: 'هاني الرفاعي' },
      { id: 'ar.khalefa',          name: 'خليفة الطنيجي' },
    ]
  },
  {
    group: 'تجويد',
    reciters: [
      { id: 'ar.minshawimujawwad',   name: 'المنشاوي (مجوّد)' },
      { id: 'ar.husarymujawwad',     name: 'الحصري (مجوّد)' },
      { id: 'ar.abdulbasitmujawwad', name: 'عبدالباسط (مجوّد)' },
    ]
  },
  {
    group: 'نادر',
    reciters: [
      { id: 'ar.hussary_mujawwad_rare', name: 'الحصري (تسجيلات الإذاعة)' },
    ]
  },
];

const nawadirServers = {
  'ar.hussary_mujawwad_rare': 'https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad'
};

const fetchSurahData = async ({ queryKey, signal }) => {
  const [_, id, reciter] = queryKey;
  
  const fetchWithRetry = (url, retries = 3) => {
    return fetch(url, { signal }).then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).catch(err => {
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
    isNawadir ? Promise.resolve({ code: 200, data: null }) : fetchWithRetry(`https://api.alquran.cloud/v1/surah/${id}/${reciter}`),
    fetchWithRetry(`https://api.alquran.cloud/v1/surah/${id}/ar.muyassar`)
  ]);

  if (surahRes.code === 200 && tafsirRes.code === 200) {
    if (isNawadir) {
       const paddedSurahId = String(id).padStart(3, '0');
       const fullAudioUrl = `${nawadirServers[reciter]}/${paddedSurahId}.mp3`;
       const modifiedAyahs = tafsirRes.data.ayahs.map(a => ({ ...a, audio: fullAudioUrl }));
       return { surahData: { ...tafsirRes.data, ayahs: modifiedAyahs }, tafsirData: tafsirRes.data };
    }
    return { surahData: surahRes.data, tafsirData: tafsirRes.data };
  } else {
    throw new Error("API returned invalid data code");
  }
};

const Surah = () => {
  const { id } = useParams();
  const { theme, reciter, setYaqeenModeActive } = useAppStore();
  const [showTafsir, setShowTafsir] = useState(false);
  const [showCinema, setShowCinema] = useState(false);
  const [autoPlayPending, setAutoPlayPending] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const audio1Ref = useRef(new Audio());
  const audio2Ref = useRef(new Audio());
  const activePlayer = useRef(1);
  
  const activeAyahRef = useRef(null);
  const isActiveSurah = true;

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['surah', id, reciter],
    queryFn: fetchSurahData,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const surahData = data?.surahData;
  const tafsirData = data?.tafsirData;

  useEffect(() => {
    // Cleanup audio on unmount
    const a1 = audio1Ref.current;
    const a2 = audio2Ref.current;
    return () => {
      a1.pause();
      a1.src = '';
      a2.pause();
      a2.src = '';
      setYaqeenModeActive(false);
    };
  }, []);

  useEffect(() => {
    if (autoPlayPending && surahData) {
      handlePlaySurah(currentIndex);
      setAutoPlayPending(false);
    }
  }, [surahData, autoPlayPending]);

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
       const currentAudio = activePlayer.current === 1 ? audio1Ref.current : audio2Ref.current;
       
       currentAudio.play().catch(() => {});
       setCurrentIndex(nextIndex);
       preloadNext(nextIndex + 1);
    } else {
       setIsPlaying(false);
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

  const handlePlaySurah = async (startIndex = 0) => {
    if (!surahData) return;
    const currentAudio = activePlayer.current === 1 ? audio1Ref.current : audio2Ref.current;
    const nextAudio = activePlayer.current === 1 ? audio2Ref.current : audio1Ref.current;

    if (isPlaying && currentIndex === startIndex) {
       currentAudio.pause();
       setIsPlaying(false);
       return;
    }
    
    // Stop anything playing
    audio1Ref.current.pause();
    audio2Ref.current.pause();
    
    setCurrentIndex(startIndex);
    currentAudio.src = surahData.ayahs[startIndex].audio;
    currentAudio.load();
    
    try {
      await currentAudio.play();
      setIsPlaying(true);
      setShowCinema(true);
      setYaqeenModeActive(true);
      preloadNext(startIndex + 1);
    } catch (err) {
      console.error(err);
      setIsPlaying(false);
    }
  };

  const handleCinemaClose = () => {
    setShowCinema(false);
    // keep Yaqeen mode active if still playing
  };

  const handleCinemaPlayPause = () => {
    const currentAudio = activePlayer.current === 1 ? audio1Ref.current : audio2Ref.current;
    if (isPlaying) {
      currentAudio.pause();
      setIsPlaying(false);
      setYaqeenModeActive(false);
    } else {
      if (!currentAudio.src) {
        handlePlaySurah(currentIndex);
      } else {
        currentAudio.play();
        setIsPlaying(true);
      }
    }
  };

  const handleCinemaNext = () => {
    if (currentIndex < surahData.ayahs.length - 1)
      handlePlaySurah(currentIndex + 1);
  };

  const handleCinemaPrev = () => {
    if (currentIndex > 0)
      handlePlaySurah(currentIndex - 1);
  };

  if (loading && !surahData) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
       <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${theme === 'dark' ? 'border-primary' : 'border-secondary'}`}></div>
       <p className={`font-tajawal text-xl opacity-80 font-medium ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
         جاري إعداد السورة...
       </p>
    </div>
  );

  if (error && !surahData) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4 font-tajawal">
      <p className="text-2xl text-red-500 font-bold">{error?.message || "تعذر تحميل السورة. يرجى التحقق من جودة الاتصال بالإنترنت."}</p>
      <button 
        onClick={() => window.location.reload()} 
        className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${theme === 'dark' ? 'bg-primary text-secondary' : 'bg-secondary text-white'}`}
      >
        إعادة المحاولة
      </button>
    </div>
  );

  // Absolute crash guard
  if (!surahData || !surahData.ayahs || !tafsirData) return null;

  return (
    <div className="py-6 md:py-12 max-w-6xl mx-auto px-4 font-tajawal pb-32 md:pb-40">

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
      
      {/* Header Container */}
      <div className={`relative rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 mb-8 md:mb-10 overflow-hidden text-center glass-card transition-colors duration-500
        ${theme === 'dark' ? 'text-white' : 'text-secondary'}
      `}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-multiply"></div>
        <div className="relative z-10 flex flex-col items-center">
          
          <div className="w-full flex justify-between items-center mb-8">
             <Link to="/quran" className={`p-4 rounded-full transition-all border ${theme === 'dark' ? 'hover:bg-primary/10 border-transparent hover:border-primary/30' : 'hover:bg-white border-transparent hover:border-secondary/20'}`}>
               <ArrowRight size={28} className={theme === 'dark' ? 'text-primary' : 'text-secondary'} />
             </Link>
             <div className="flex-1 text-center">
               <span className={`text-xl font-medium tracking-widest ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
                 {surahData.revelationType === 'Meccan' ? 'سورة مكية' : 'سورة مدنية'}
               </span>
             </div>
             <div className="w-14"></div>
          </div>

          <h1 className={`text-5xl md:text-[6rem] font-bold mb-4 md:mb-6 drop-shadow-lg font-reem ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
            سورة {surahData.name.replace('سُورَةُ ', '')}
          </h1>
          <p className="text-xl md:text-2xl font-bold mb-6 md:mb-8 opacity-80">
            {surahData.ayahs.length} آيات
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-8 md:mb-10 w-full justify-center px-4 md:px-0">
             <button 
               onClick={() => handlePlaySurah(0)}
               className={`flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-lg md:text-xl transition-all shadow-xl hover:scale-105 w-full md:w-auto
                 ${theme === 'dark' ? 'bg-primary text-secondary hover:bg-white' : 'bg-secondary text-white hover:bg-black'}
               `}
             >
               <Play fill="currentColor" className="w-5 h-5 md:w-6 md:h-6" />
               استمع للسورة كاملة
             </button>

             <button 
               onClick={() => setShowTafsir(!showTafsir)}
               className={`flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-lg md:text-xl transition-all border shadow-lg hover:scale-105 w-full md:w-auto
                 ${theme === 'dark' ? 'border-primary/50 text-primary hover:bg-primary/10' : 'border-secondary/50 text-secondary hover:bg-secondary/10'}
                 ${showTafsir && (theme === 'dark' ? 'bg-primary/20' : 'bg-secondary/10')}
               `}
             >
               <BookOpen className={`w-5 h-5 md:w-6 md:h-6 ${showTafsir ? "fill-current" : ""}`} />
               عرض الصفوف و التفسير
             </button>
          </div>

          {/* Explicit Reciter Switcher Rows by Group */}
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center border-t border-dashed pt-8 mt-4 border-primary/30">
             <div className="w-full space-y-6">
                {reciterGroups.map(group => (
                  <div key={group.group} className="flex flex-col md:flex-row items-center justify-center gap-4">
                     <span className={`text-sm font-bold opacity-70 w-32 text-center md:text-right ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
                        {group.group}:
                     </span>
                     <div className="flex flex-wrap justify-center gap-2 flex-1">
                        {group.reciters.map(r => {
                          const isSelected = reciter === r.id;
                          return (
                            <button 
                              key={r.id}
                              onClick={() => {
                                setReciter(r.id);
                                setAutoPlayPending(true);
                              }}
                              className={`px-4 py-2 rounded-xl text-md font-bold transition-all border
                                ${isSelected 
                                  ? (theme === 'dark' ? 'bg-primary text-secondary shadow-[0_0_15px_rgba(198,156,109,0.5)] border-primary' : 'bg-secondary text-white shadow-lg border-secondary') 
                                  : (theme === 'dark' ? 'bg-transparent text-white border-primary/20 hover:border-primary' : 'bg-transparent text-secondary border-secondary/20 hover:border-secondary')
                                }
                              `}
                            >
                              {r.name}
                            </button>
                          );
                        })}
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>

      {/* Bismillah */}
      {surahData.number !== 1 && surahData.number !== 9 && (
        <div className={`text-center text-3xl md:text-4xl mb-8 md:mb-12 font-bold leading-relaxed tracking-wide font-reem ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      )}

      {/* Content Rendering Logic */}
      {!showTafsir ? (
        /* --- TRUE MUSHAF INLINE LAYOUT --- */
        <div className={`p-5 sm:p-8 md:p-14 lg:p-20 rounded-[2rem] md:rounded-[3rem] min-h-[100px] text-justify leading-[2.6] md:leading-[3.5] tracking-wide glass-card transition-colors duration-500
            ${theme === 'dark' ? 'text-white' : 'text-secondary'}
        `} dir="rtl">
          <div className="text-[1.8rem] md:text-[3rem] font-amiri leading-[2.2] md:leading-[2.6] tracking-normal right-align dir-rtl block text-justify" style={{ wordSpacing: '5px' }}>
            {surahData.ayahs.map((ayah, index) => {
              const isCurrent = isActiveSurah && currentIndex === index;
              let ayahText = ayah.text;
              if (surahData.number !== 1 && index === 0 && ayahText.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
                ayahText = ayahText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
              }

              return (
                <span 
                  key={ayah.number}
                  ref={isCurrent ? activeAyahRef : null}
                  onClick={() => handlePlaySurah(index)}
                  className={`inline cursor-pointer transition-colors duration-300 mx-1 px-1 py-1 rounded-lg
                    ${isCurrent 
                      ? (theme === 'dark' ? 'text-primary font-black drop-shadow-md bg-primary/10' : 'text-secondary font-black drop-shadow-md bg-secondary/10') 
                      : (theme === 'dark' ? 'hover:text-primary/80 hover:bg-primary/5' : 'hover:text-secondary/70 hover:bg-secondary/5')
                    }
                  `}
                >
                  {ayahText}
                  <span className={`inline-block mx-1.5 md:mx-2 font-black select-none text-xl md:text-3xl whitespace-nowrap align-middle
                    ${isCurrent ? (theme === 'dark' ? 'text-primary' : 'text-secondary') : (theme === 'dark' ? 'text-primary/50' : 'text-secondary/50')}
                  `}>
                    ﴿ {ayah.numberInSurah.toLocaleString('ar-EG')} ﴾
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        /* --- AYAH ROWS EXPERIENCED LAYOUT --- */
        <div className="space-y-6 md:space-y-8">
          {surahData.ayahs.map((ayah, index) => {
            const isCurrent = isActiveSurah && currentIndex === index;
            const tafsirText = tafsirData.ayahs[index].text;

            let ayahText = ayah.text;
            if (surahData.number !== 1 && index === 0 && ayahText.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
              ayahText = ayahText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
            }

            return (
              <motion.div 
                key={ayah.number}
                ref={isCurrent ? activeAyahRef : null}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-6 md:p-10 rounded-3xl transition-all flex flex-col gap-6 md:gap-8 glass-card group
                  ${isCurrent 
                    ? (theme === 'dark' 
                        ? 'border-primary/50 shadow-[0_0_30px_rgba(198,156,109,0.15)] scale-[1.01] bg-secondary/20' 
                        : 'border-secondary/50 shadow-xl scale-[1.01] bg-white')
                    : ''
                  }
                `}
              >
                {/* Text Block */}
                <div className="w-full text-center md:text-right">
                   <p className={`text-3xl md:text-[3rem] font-amiri leading-[2.2] md:leading-[2.5]
                     ${isCurrent ? (theme === 'dark' ? 'text-primary' : 'text-secondary') : (theme === 'dark' ? 'text-white' : 'text-secondary')}
                   `}>
                     {ayahText}
                     <span className={`mx-2 md:mx-4 text-xl md:text-2xl font-black ${theme === 'dark' ? 'text-primary/60' : 'text-secondary/60'}`}>
                        ﴿ {ayah.numberInSurah.toLocaleString('ar-EG')} ﴾
                     </span>
                   </p>
                </div>
                
                {/* Interactive Action Bar (Hover visible on desktop) */}
                <div className={`mt-2 md:mt-4 pt-4 md:pt-6 border-t border-dashed flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all
                    ${theme === 'dark' ? 'border-primary/20' : 'border-secondary/20'}
                `}>
                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
                     <button 
                       onClick={() => handlePlaySurah(index)}
                       className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm md:text-base transition-all
                         ${isCurrent && isPlaying ? (theme === 'dark' ? 'bg-primary text-secondary' : 'bg-secondary text-white') : (theme === 'dark' ? 'bg-primary/10 text-primary hover:bg-primary hover:text-secondary' : 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white')}
                       `}
                     >
                       {isCurrent && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                       {isCurrent && isPlaying ? 'يتم التشغيل' : 'تشغيل'}
                     </button>

                     <button 
                       onClick={() => {
                          const bookmarks = JSON.parse(localStorage.getItem('yaqeen_bookmarks') || '[]');
                          const entry = { surah_id: surahData.number, surah_name: surahData.name.replace('سُورَةُ ', ''), ayah_num: ayah.numberInSurah, ayah_text: ayahText, saved_at: new Date().toISOString() };
                          const exists = bookmarks.some(b => b.surah_id === entry.surah_id && b.ayah_num === entry.ayah_num);
                          if (!exists) localStorage.setItem('yaqeen_bookmarks', JSON.stringify([...bookmarks, entry]));
                       }}
                       className={`p-2.5 rounded-full transition-all
                         ${theme === 'dark' ? 'bg-primary/10 text-primary hover:bg-primary hover:text-secondary' : 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white'}
                       `}
                       title="احفظ الآية"
                     >
                       <Bookmark size={18} />
                     </button>
                  </div>

                  {/* Tafsir (Always shown in this layout) */}
                  <div className="flex items-start gap-4 flex-1">
                     <p className={`text-sm md:text-base leading-relaxed text-right flex-1 opacity-90
                        ${theme === 'dark' ? 'text-white' : 'text-gray-700'}
                     `}>
                       {tafsirText}
                     </p>
                     
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         window.speechSynthesis.cancel();
                         const utterance = new SpeechSynthesisUtterance(tafsirText);
                         utterance.lang = 'ar-SA';
                         utterance.rate = 0.9;
                         window.speechSynthesis.speak(utterance);
                       }}
                       className={`p-2.5 rounded-full border transition-all flex-shrink-0
                         ${theme === 'dark' ? 'border-primary/30 text-primary hover:bg-primary hover:text-secondary' : 'border-secondary/20 text-secondary hover:bg-secondary hover:text-white'}
                       `}
                       title="استمع للتفسير"
                     >
                       <Mic2 size={18} />
                     </button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Surah;
