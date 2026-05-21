import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Pause, RotateCcw, BookOpen, Quote, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const DUA_LIST = [
  { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", desc: "أفضل دعاء يوم عرفة كما ثبت عن النبي صلى الله عليه وسلم." },
  { text: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", desc: "من أجمع الأدعية لطلب المغفرة والرحمة في هذه الأيام الفضيلة." },
  { text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", desc: "سؤال خير الدنيا والآخرة والسلامة من كل شر." },
  { text: "اللَّهُمَّ يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", desc: "سؤال الثبات على الإيمان والهداية." }
];

const VIRTUES_LIST = [
  { title: "أعظم أيام الدنيا", text: "أقسم الله تعالى بها في كتابه الكريم فقال: 'والفجر * وليالٍ عشر'، مما يدل على شرفها العظيم ومكانتها عند الله." },
  { title: "مضاعفة الأجور", text: "ما من أيام العمل الصالح فيهن أحب إلى الله من هذه الأيام، فكل تسبيحة وتكبير وصدقة أجرها مضاعف." },
  { title: "يوم عرفة المبارك", text: "يوم مغفرة الذنوب والعتق من النيران، وصيامه يكفر السنة الماضية والسنة الباقية لغير الحاج." },
  { title: "اجتماع أمهات العبادة", text: "تتميز هذه العشر باجتماع الصلاة، والصيام، والصدقة، والحج فيها، وهو ما لا يتوفر في غيرها من الأوقات." }
];

const TASBIH_PHRASES = [
  "الله أكبر، الله أكبر، لا إله إلا الله، الله أكبر، ولله الحمد",
  "لبيك اللهم لبيك، لبيك لا شريك لك لبيك",
  "سبحان الله وبحمده، سبحان الله العظيم",
  "أستغفر الله العظيم وأتوب إليه"
];

const AUDIO_SOURCES = {
  eid: {
    title: "تكبيرات العيد",
    url: "/audio/takbeerat-eid.mp3?v=2"
  },
  dhulhijjah: {
    title: "تكبيرات ذي الحجة",
    url: "/audio/takbeerat-dhulhijjah.mp3"
  }
};

const SeasonalWidget = () => {
  const { theme } = useAppStore();
  const [activeTab, setActiveTab] = useState('tasbih'); // 'tasbih', 'duas', 'virtues'
  const [tasbihCount, setTasbihCount] = useState(0);
  const [activePhraseIdx, setActivePhraseIdx] = useState(0);
  
  // Takbeerat Audio State
  const [activeAudioKey, setActiveAudioKey] = useState(null); // 'eid', 'dhulhijjah' or null
  const [playbackStates, setPlaybackStates] = useState({
    eid: 'idle', // 'idle' | 'loading' | 'playing' | 'paused' | 'error'
    dhulhijjah: 'idle'
  });

  const audioRef = useRef(null);

  const activeAudioKeyRef = useRef(activeAudioKey);

  useEffect(() => {
    activeAudioKeyRef.current = activeAudioKey;
  }, [activeAudioKey]);

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;

    // Add audio event listeners for robust state management
    const handleLoadStart = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates(prev => ({ ...prev, [currentKey]: 'loading' }));
      }
    };

    const handleCanPlay = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey && audio.paused === false) {
        setPlaybackStates(prev => ({ ...prev, [currentKey]: 'playing' }));
      }
    };

    const handlePlaying = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates(prev => ({ ...prev, [currentKey]: 'playing' }));
      }
    };

    const handleWaiting = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates(prev => ({ ...prev, [currentKey]: 'loading' }));
      }
    };

    const handlePause = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates(prev => ({ ...prev, [currentKey]: 'paused' }));
      }
    };

    const handleError = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates(prev => ({ ...prev, [currentKey]: 'error' }));
      }
    };

    const handleEnded = () => {
      const currentKey = activeAudioKeyRef.current;
      if (currentKey) {
        setPlaybackStates(prev => ({ ...prev, [currentKey]: 'idle' }));
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
      // Toggle play/pause for same audio
      if (playbackStates[key] === 'playing') {
        audio.pause();
        setPlaybackStates(prev => ({ ...prev, [key]: 'paused' }));
      } else {
        setPlaybackStates(prev => ({ ...prev, [key]: 'loading' }));
        audio.play().catch(() => {
          setPlaybackStates(prev => ({ ...prev, [key]: 'error' }));
        });
      }
    } else {
      // Stop currently playing if any
      audio.pause();
      if (activeAudioKey) {
        setPlaybackStates(prev => ({ ...prev, [activeAudioKey]: 'idle' }));
      }

      // Switch audio source
      setActiveAudioKey(key);
      activeAudioKeyRef.current = key; // Update ref synchronously for immediate event listener access
      setPlaybackStates(prev => ({ ...prev, [key]: 'loading' }));
      audio.src = AUDIO_SOURCES[key].url;
      audio.load();
      audio.play().catch(() => {
        setPlaybackStates(prev => ({ ...prev, [key]: 'error' }));
      });
    }
  };

  // Duas Carousel State
  const [duaIdx, setDuaIdx] = useState(0);
  // Virtues Carousel State
  const [virtueIdx, setVirtueIdx] = useState(0);

  const handleTasbihClick = () => {
    setTasbihCount(prev => prev + 1);
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

    let icon = <Play size={18} fill="currentColor" />;
    let statusText = `تشغيل ${source.title}`;

    if (state === 'loading') {
      icon = <Loader2 size={18} className="animate-spin" />;
      statusText = "جاري التحميل...";
    } else if (state === 'playing') {
      icon = <Pause size={18} fill="currentColor" />;
      statusText = `إيقاف ${source.title}`;
    } else if (state === 'paused') {
      icon = <Play size={18} fill="currentColor" />;
      statusText = `استئناف ${source.title}`;
    } else if (state === 'error') {
      icon = <AlertCircle size={18} />;
      statusText = "فشل تحميل الصوت";
    }

    return (
      <button
        onClick={() => handleAudioAction(key)}
        className={`flex items-center gap-3 px-6 py-3.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-md border
          ${state === 'playing'
            ? (theme === 'dark' ? 'bg-primary text-secondary border-transparent' : 'bg-secondary text-white border-transparent')
            : state === 'error'
            ? 'bg-red-500/10 text-red-500 border-red-500/35'
            : (theme === 'dark' ? 'bg-[#064e3b] text-primary border-primary/30' : 'bg-white text-secondary border-secondary/20')
          }
        `}
      >
        {icon}
        <span>{statusText}</span>
      </button>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 px-4" dir="rtl">
      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border transition-all duration-500
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-[#022c22]/90 to-[#043e2f]/80 border-primary/30 shadow-[0_0_40px_rgba(2,44,34,0.3)]' 
          : 'bg-gradient-to-br from-[#FAF8F5] to-white border-secondary/15 shadow-xl'
        }
      `}>
        {/* Background watermark */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.04] mix-blend-multiply pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 border-b border-dashed pb-8 mb-8 border-primary/20">
          <div className="flex items-center gap-4 text-center md:text-right">
            <div className={`p-4 rounded-2xl flex-shrink-0 animate-pulse
              ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}
            `}>
              <Sparkles size={32} />
            </div>
            <div>
              <h2 className={`text-2xl md:text-3xl font-black font-reem ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
                بوابة عشر ذي الحجة ويوم عرفة الموسمية
              </h2>
              <p className={`text-sm md:text-md font-tajawal opacity-75 mt-1 ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
                اغتنم أعظم أيام الدنيا بالتكبير، والذكر، والدعاء المأثور.
              </p>
            </div>
          </div>

          {/* Dual Takbeerat Audio Controllers */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto justify-center items-center">
            {renderAudioButton('eid')}
            {renderAudioButton('dhulhijjah')}
          </div>
        </div>

        {/* Switcher Navigation */}
        <div className="relative z-10 flex justify-center mb-8">
          <div className={`flex p-1.5 rounded-2xl border ${theme === 'dark' ? 'bg-black/25 border-primary/10' : 'bg-gray-100 border-gray-200'}`}>
            <button
              onClick={() => setActiveTab('tasbih')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all
                ${activeTab === 'tasbih'
                  ? (theme === 'dark' ? 'bg-primary text-secondary shadow-md' : 'bg-secondary text-white shadow-sm')
                  : (theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-secondary/60 hover:text-secondary')
                }
              `}
            >
              المسبحة الإلكترونية
            </button>
            
            <button
              onClick={() => setActiveTab('duas')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all
                ${activeTab === 'duas'
                  ? (theme === 'dark' ? 'bg-primary text-secondary shadow-md' : 'bg-secondary text-white shadow-sm')
                  : (theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-secondary/60 hover:text-secondary')
                }
              `}
            >
              أدعية عرفات
            </button>

            <button
              onClick={() => setActiveTab('virtues')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all
                ${activeTab === 'virtues'
                  ? (theme === 'dark' ? 'bg-primary text-secondary shadow-md' : 'bg-secondary text-white shadow-sm')
                  : (theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-secondary/60 hover:text-secondary')
                }
              `}
            >
              فضائل العشر
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="relative z-10 min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            
            {/* TASBIH VIEW */}
            {activeTab === 'tasbih' && (
              <motion.div
                key="tasbih"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-6"
              >
                {/* Phrase selector */}
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                  {TASBIH_PHRASES.map((phrase, i) => (
                    <button
                      key={i}
                      onClick={() => { setActivePhraseIdx(i); }}
                      className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all
                        ${activePhraseIdx === i
                          ? (theme === 'dark' ? 'bg-primary/25 border-primary text-primary shadow-md' : 'bg-secondary/15 border-secondary text-secondary')
                          : (theme === 'dark' ? 'bg-transparent border-primary/10 text-white/70 hover:border-primary/40' : 'bg-transparent border-secondary/10 text-secondary/70 hover:border-secondary/40')
                        }
                      `}
                    >
                      {phrase.split('،')[0]}...
                    </button>
                  ))}
                </div>

                {/* Selected phrase bubble */}
                <div className={`p-5 rounded-2xl text-center max-w-xl font-bold text-lg md:text-xl font-amiri border leading-relaxed
                  ${theme === 'dark' ? 'bg-primary/5 text-primary border-primary/20' : 'bg-secondary/5 text-secondary border-secondary/10'}
                `}>
                  "{TASBIH_PHRASES[activePhraseIdx]}"
                </div>

                {/* Rosary Counter circular button */}
                <div className="flex flex-col items-center gap-6 w-full">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTasbihClick}
                    className={`w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-colors relative group
                      ${theme === 'dark' 
                        ? 'border-primary/30 bg-[#0A291F] hover:bg-[#0E3D2E] text-white' 
                        : 'border-secondary/20 bg-white hover:bg-gray-50 text-secondary'
                      }
                    `}
                  >
                    <div className="absolute inset-2 rounded-full border border-dashed border-primary/20 group-hover:border-primary/40 transition-colors" />

                    <span className="text-xs opacity-60 font-tajawal font-bold uppercase tracking-wider">التكبيرات</span>
                    <span className="text-5xl font-black font-tajawal my-1">{tasbihCount.toLocaleString('ar-EG')}</span>
                    <span className="text-xs opacity-60 font-tajawal">اضغط للذكر</span>
                  </motion.div>

                  {/* Reset button positioned BELOW the circle counter */}
                  <button
                    onClick={handleResetTasbih}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all hover:scale-105 shadow-md font-bold text-xs
                      ${theme === 'dark' 
                        ? 'bg-[#064e3b] border-primary/35 text-primary hover:bg-primary hover:text-secondary' 
                        : 'bg-white border-secondary/20 text-secondary hover:bg-secondary hover:text-white'
                      }
                    `}
                  >
                    <RotateCcw size={14} />
                    <span>إعادة الضبط</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* DUAS VIEW */}
            {activeTab === 'duas' && (
              <motion.div
                key="duas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-6"
              >
                {/* Dua Slide Wrapper */}
                <div className="relative w-full max-w-3xl min-h-[180px] flex items-center justify-center px-8 text-center">
                  
                  {/* Left arrow */}
                  <button
                    onClick={() => setDuaIdx(prev => (prev > 0 ? prev - 1 : DUA_LIST.length - 1))}
                    className={`absolute right-0 p-3 rounded-full border transition-all shadow-md
                      ${theme === 'dark' ? 'bg-secondary border-primary/20 text-primary hover:bg-primary hover:text-secondary' : 'bg-white border-secondary/20 text-secondary hover:bg-secondary hover:text-white'}
                    `}
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="flex flex-col items-center gap-4 max-w-xl">
                    <Quote size={28} className={theme === 'dark' ? 'text-primary/45' : 'text-secondary/45'} />
                    <p className={`text-2xl md:text-3xl font-bold font-amiri leading-[2.2] ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
                      {DUA_LIST[duaIdx].text}
                    </p>
                    <p className={`text-xs md:text-sm font-tajawal opacity-75
                      ${theme === 'dark' ? 'text-primary' : 'text-secondary'}
                    `}>
                      {DUA_LIST[duaIdx].desc}
                    </p>
                  </div>

                  {/* Right arrow */}
                  <button
                    onClick={() => setDuaIdx(prev => (prev < DUA_LIST.length - 1 ? prev + 1 : 0))}
                    className={`absolute left-0 p-3 rounded-full border transition-all shadow-md
                      ${theme === 'dark' ? 'bg-secondary border-primary/20 text-primary hover:bg-primary hover:text-secondary' : 'bg-white border-secondary/20 text-secondary hover:bg-secondary hover:text-white'}
                    `}
                  >
                    <ChevronLeft size={20} />
                  </button>
                </div>

                {/* Slider indicators */}
                <div className="flex gap-2 justify-center">
                  {DUA_LIST.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 rounded-full transition-all duration-300
                        ${duaIdx === i ? 'w-8 bg-primary' : 'w-2.5 bg-primary/20'}
                      `}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIRTUES VIEW */}
            {activeTab === 'virtues' && (
              <motion.div
                key="virtues"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-6"
              >
                {/* Virtue Slide Wrapper */}
                <div className="relative w-full max-w-3xl min-h-[180px] flex items-center justify-center px-8 text-center">
                  
                  {/* Left arrow */}
                  <button
                    onClick={() => setVirtueIdx(prev => (prev > 0 ? prev - 1 : VIRTUES_LIST.length - 1))}
                    className={`absolute right-0 p-3 rounded-full border transition-all shadow-md
                      ${theme === 'dark' ? 'bg-secondary border-primary/20 text-primary hover:bg-primary hover:text-secondary' : 'bg-white border-secondary/20 text-secondary hover:bg-secondary hover:text-white'}
                    `}
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="flex flex-col items-center gap-3 max-w-xl">
                    <BookOpen size={28} className={theme === 'dark' ? 'text-primary/45' : 'text-secondary/45'} />
                    <h3 className={`text-xl md:text-2xl font-black font-reem ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
                      {VIRTUES_LIST[virtueIdx].title}
                    </h3>
                    <p className={`text-base md:text-lg font-tajawal leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
                      {VIRTUES_LIST[virtueIdx].text}
                    </p>
                  </div>

                  {/* Right arrow */}
                  <button
                    onClick={() => setVirtueIdx(prev => (prev < VIRTUES_LIST.length - 1 ? prev + 1 : 0))}
                    className={`absolute left-0 p-3 rounded-full border transition-all shadow-md
                      ${theme === 'dark' ? 'bg-secondary border-primary/20 text-primary hover:bg-primary hover:text-secondary' : 'bg-white border-secondary/20 text-secondary hover:bg-secondary hover:text-white'}
                    `}
                  >
                    <ChevronLeft size={20} />
                  </button>
                </div>

                {/* Slider indicators */}
                <div className="flex gap-2 justify-center">
                  {VIRTUES_LIST.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 rounded-full transition-all duration-300
                        ${virtueIdx === i ? 'w-8 bg-primary' : 'w-2.5 bg-primary/20'}
                      `}
                    />
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default SeasonalWidget;
