import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Quote,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const DUA_LIST = [
  {
    text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    desc: 'أفضل دعاء يوم عرفة كما ثبت عن النبي صلى الله عليه وسلم.',
  },
  {
    text: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    desc: 'من أجمع الأدعية لطلب المغفرة والرحمة في هذه الأيام الفضيلة.',
  },
  {
    text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    desc: 'سؤال خير الدنيا والآخرة والسلامة من كل شر.',
  },
  {
    text: 'اللَّهُمَّ يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    desc: 'سؤال الثبات على الإيمان والهداية.',
  },
];

const VIRTUES_LIST = [
  {
    title: 'أعظم أيام الدنيا',
    text: "أقسم الله تعالى بها في كتابه الكريم فقال: 'والفجر * وليالٍ عشر'، مما يدل على شرفها العظيم ومكانتها عند الله.",
  },
  {
    title: 'مضاعفة الأجور',
    text: 'ما من أيام العمل الصالح فيهن أحب إلى الله من هذه الأيام، فكل تسبيحة وتكبير وصدقة أجرها مضاعف.',
  },
  {
    title: 'يوم عرفة المبارك',
    text: 'يوم مغفرة الذنوب والعتق من النيران، وصيامه يكفر السنة الماضية والسنة الباقية لغير الحاج.',
  },
  {
    title: 'اجتماع أمهات العبادة',
    text: 'تتميز هذه العشر باجتماع الصلاة، والصيام، والصدقة، والحج فيها، وهو ما لا يتوفر في غيرها من الأوقات.',
  },
];

const TASBIH_PHRASES = [
  'الله أكبر، الله أكبر، لا إله إلا الله، الله أكبر، ولله الحمد',
  'لبيك اللهم لبيك، لبيك لا شريك لك لبيك',
  'سبحان الله وبحمده، سبحان الله العظيم',
  'أستغفر الله العظيم وأتوب إليه',
];

const AUDIO_SOURCES = {
  eid: {
    title: 'تكبيرات العيد',
    url: '/audio/takbeerat-eid.mp3?v=2',
  },
  dhulhijjah: {
    title: 'تكبيرات ذي الحجة',
    url: '/audio/takbeerat-dhulhijjah.mp3',
  },
};

const SeasonalWidget = () => {
  const [activeTab, setActiveTab] = useState('tasbih'); // 'tasbih', 'duas', 'virtues'
  const [tasbihCount, setTasbihCount] = useState(() => {
    try {
      const stored = window.localStorage.getItem('yaqeen_tasbih_count');
      const num = Number(stored);
      return Number.isFinite(num) && num >= 0 ? num : 0;
    } catch {
      return 0;
    }
  });
  const [activePhraseIdx, setActivePhraseIdx] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem('yaqeen_tasbih_count', String(tasbihCount));
    } catch {
      // Ignore
    }
  }, [tasbihCount]);

  const [activeAudioKey, setActiveAudioKey] = useState(null);
  const [playbackStates, setPlaybackStates] = useState({
    eid: 'idle',
    dhulhijjah: 'idle',
  });

  const audioRef = useRef(null);
  const activeAudioKeyRef = useRef(activeAudioKey);

  useEffect(() => {
    activeAudioKeyRef.current = activeAudioKey;
  }, [activeAudioKey]);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;

    const handleLoadStart = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates((prev) => ({ ...prev, [currentKey]: 'loading' }));
      }
    };
    const handleCanPlay = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey && audio.paused === false) {
        setPlaybackStates((prev) => ({ ...prev, [currentKey]: 'playing' }));
      }
    };
    const handlePlaying = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates((prev) => ({ ...prev, [currentKey]: 'playing' }));
      }
    };
    const handleWaiting = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates((prev) => ({ ...prev, [currentKey]: 'loading' }));
      }
    };
    const handlePause = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates((prev) => ({ ...prev, [currentKey]: 'paused' }));
      }
    };
    const handleError = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates((prev) => ({ ...prev, [currentKey]: 'error' }));
      }
    };
    const handleEnded = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates((prev) => ({ ...prev, [currentKey]: 'idle' }));
      }
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleAudioAction = (key) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeAudioKey === key) {
      if (playbackStates[key] === 'playing') {
        audio.pause();
        setPlaybackStates((prev) => ({ ...prev, [key]: 'paused' }));
      } else {
        setPlaybackStates((prev) => ({ ...prev, [key]: 'loading' }));
        audio.play().catch(() => {
          setPlaybackStates((prev) => ({ ...prev, [key]: 'error' }));
        });
      }
    } else {
      audio.pause();
      if (activeAudioKey) {
        setPlaybackStates((prev) => ({ ...prev, [activeAudioKey]: 'idle' }));
      }

      setActiveAudioKey(key);
      activeAudioKeyRef.current = key;
      setPlaybackStates((prev) => ({ ...prev, [key]: 'loading' }));
      audio.src = AUDIO_SOURCES[key].url;
      audio.load();
      audio.play().catch(() => {
        setPlaybackStates((prev) => ({ ...prev, [key]: 'error' }));
      });
    }
  };

  const [duaIdx, setDuaIdx] = useState(0);
  const [virtueIdx, setVirtueIdx] = useState(0);

  const handleTasbihClick = () => {
    setTasbihCount((prev) => prev + 1);
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(40);
    }
  };

  const handleResetTasbih = (e) => {
    e.stopPropagation();
    setTasbihCount(0);
  };

  const renderAudioButton = (key) => {
    const state = playbackStates[key];
    const source = AUDIO_SOURCES[key];

    let icon = <Play size={14} fill="currentColor" />;
    let statusText = source.title;

    if (state === 'loading') {
      icon = <Loader2 size={14} className="animate-spin" />;
      statusText = 'جاري التحميل...';
    } else if (state === 'playing') {
      icon = <Pause size={14} fill="currentColor" />;
      statusText = `إيقاف ${source.title}`;
    } else if (state === 'paused') {
      icon = <Play size={14} fill="currentColor" />;
      statusText = `استئناف ${source.title}`;
    } else if (state === 'error') {
      icon = <AlertCircle size={14} />;
      statusText = 'تعذر التحميل';
    }

    return (
      <button
        type="button"
        onClick={() => handleAudioAction(key)}
        className={`flex-1 tactile-pill px-3.5 py-2.5 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
          state === 'playing'
            ? 'active-ayah-glow text-glow'
            : state === 'error'
            ? 'text-red-500'
            : 'text-ink hover:text-glow'
        }`}
      >
        {icon}
        <span className="truncate">{statusText}</span>
      </button>
    );
  };

  return (
    <section className="tactile-card p-5 sm:p-6 flex flex-col gap-5" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-ink-muted block">
            أذكار ومواسم
          </span>
          <h2 className="text-lg font-extrabold font-cairo text-ink">
            بوابة الذكر والمسبحة
          </h2>
        </div>
        <div className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-glow shrink-0">
          <Sparkles size={17} />
        </div>
      </div>

      {/* Takbeerat Audio Controls inside Recessed Well */}
      <div className="recessed-well p-1.5 flex items-center gap-2">
        {renderAudioButton('eid')}
        {renderAudioButton('dhulhijjah')}
      </div>

      {/* Mode Switcher */}
      <div className="recessed-well p-1 flex items-center justify-between gap-1">
        {[
          { id: 'tasbih', label: 'المسبحة' },
          { id: 'duas', label: 'أدعية' },
          { id: 'virtues', label: 'فضائل' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 rounded-full font-bold text-xs transition-all ${
              activeTab === t.id
                ? 'tactile-pill text-ink'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <AnimatePresence mode="wait">
        {activeTab === 'tasbih' && (
          <motion.div
            key="tasbih"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Phrase Selector Pills */}
            <div className="flex flex-wrap justify-center gap-1.5 w-full">
              {TASBIH_PHRASES.map((phrase, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActivePhraseIdx(i)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    activePhraseIdx === i
                      ? 'active-ayah-glow text-glow'
                      : 'tactile-pill text-ink-secondary hover:text-ink'
                  }`}
                >
                  {phrase.split('،')[0]}
                </button>
              ))}
            </div>

            {/* Active Phrase Readout */}
            <div className="w-full recessed-box p-3.5 text-center font-amiri text-base leading-relaxed text-ink">
              «{TASBIH_PHRASES[activePhraseIdx]}»
            </div>

            {/* Carved Counter Button + Large Stat */}
            <div className="flex items-center justify-between gap-4 w-full recessed-box p-4">
              <div>
                <span className="text-[11px] font-bold text-ink-muted block">
                  عدد التسبيحات
                </span>
                <span className="text-4xl font-extrabold font-tajawal text-ink tracking-tight leading-none mt-1 block">
                  {tasbihCount.toLocaleString('ar-EG')}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleResetTasbih}
                  className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
                  title="إعادة الضبط"
                >
                  <RotateCcw size={15} />
                </button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.93 }}
                  onClick={handleTasbihClick}
                  className="w-16 h-16 rounded-full tactile-pill flex flex-col items-center justify-center text-glow border-glow-border font-bold text-xs"
                >
                  <span>سبّح</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'duas' && (
          <motion.div
            key="duas"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="recessed-box p-5 text-center flex flex-col items-center gap-3 min-h-[180px] justify-center">
              <Quote size={20} className="text-glow opacity-75" />
              <p className="text-lg font-bold font-amiri leading-loose text-ink">
                {DUA_LIST[duaIdx].text}
              </p>
              <p className="text-xs text-ink-secondary">{DUA_LIST[duaIdx].desc}</p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  setDuaIdx((prev) => (prev > 0 ? prev - 1 : DUA_LIST.length - 1))
                }
                className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink"
              >
                <ChevronRight size={16} />
              </button>

              <div className="flex gap-1.5">
                {DUA_LIST.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      duaIdx === i ? 'w-6 amber-glow-dot' : 'w-2 bg-ink-muted/30'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setDuaIdx((prev) => (prev < DUA_LIST.length - 1 ? prev + 1 : 0))
                }
                className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'virtues' && (
          <motion.div
            key="virtues"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="recessed-box p-5 text-center flex flex-col items-center gap-2.5 min-h-[180px] justify-center">
              <BookOpen size={20} className="text-glow opacity-75" />
              <h3 className="text-base font-extrabold font-cairo text-ink">
                {VIRTUES_LIST[virtueIdx].title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-ink-secondary">
                {VIRTUES_LIST[virtueIdx].text}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  setVirtueIdx((prev) =>
                    prev > 0 ? prev - 1 : VIRTUES_LIST.length - 1
                  )
                }
                className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink"
              >
                <ChevronRight size={16} />
              </button>

              <div className="flex gap-1.5">
                {VIRTUES_LIST.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      virtueIdx === i ? 'w-6 amber-glow-dot' : 'w-2 bg-ink-muted/30'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setVirtueIdx((prev) =>
                    prev < VIRTUES_LIST.length - 1 ? prev + 1 : 0
                  )
                }
                className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SeasonalWidget;
