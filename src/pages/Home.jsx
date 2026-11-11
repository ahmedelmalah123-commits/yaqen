import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  BookOpen,
  Users,
  Compass,
  Shield,
  Radio,
  Mic,
  Sparkles,
  Play,
  Pause,
  ArrowUpLeft,
} from 'lucide-react';
import SeasonalWidget from '../components/SeasonalWidget';
import FarewellMedia from '../components/FarewellMedia';

const FEATURE_CARDS = [
  { title: 'المصحف الشريف', icon: BookOpen, path: '/quran', desc: 'اقرأ وتدبر في ١١٤ سورة' },
  { title: 'المكتبة الصوتية', icon: Mic, path: '/reciters', desc: 'نخبة القراء والمجودين' },
  { title: 'الإذاعة المباشرة', icon: Radio, path: '/radio', desc: 'بث قرآني على مدار الساعة' },
  { title: 'قصص الصحابة', icon: Users, path: '/sahaba', desc: 'شرائح تفاعلية لسيرهم' },
  { title: 'السيرة النبوية', icon: Compass, path: '/seerah', desc: 'خط زمني تفاعلي ميسر' },
  { title: 'حصن المسلم', icon: Shield, path: '/ruqyah', desc: 'الرقية والأذكار اليومية' },
  { title: 'تسجيلات نادرة', icon: Sparkles, path: '/reciters?category=نادر', desc: 'نوادر إذاعية خالدة' },
];

const Home = () => {
  const { setTourOpen } = useAppStore();
  const [dailyAyah, setDailyAyah] = useState(null);
  const [isAyahPlaying, setIsAyahPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const randomAyahId = Math.floor(Math.random() * 6236) + 1;
    fetch(`https://api.alquran.cloud/v1/ayah/${randomAyahId}/ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          let text = data.data.text;
          if (text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
            text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
          }
          setDailyAyah({ ...data.data, text });
        }
      })
      .catch((err) => console.error('Error fetching daily ayah:', err));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const toggleDailyAyahAudio = () => {
    if (!dailyAyah?.audio) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(dailyAyah.audio);
      audioRef.current.addEventListener('ended', () => setIsAyahPlaying(false));
    }
    if (isAyahPlaying) {
      audioRef.current.pause();
      setIsAyahPlaying(false);
    } else {
      if (audioRef.current.src !== dailyAyah.audio) {
        audioRef.current.src = dailyAyah.audio;
      }
      audioRef.current
        .play()
        .then(() => setIsAyahPlaying(true))
        .catch(() => setIsAyahPlaying(false));
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full font-tajawal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ═══ MAIN STAGE COLUMN (8 cols) ═══ */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Hero & Daily Ayah Bento Stage */}
          <motion.section
            id="tour-hero"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bento-stage p-5 sm:p-8 flex flex-col gap-6"
          >
            {/* Brand Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full amber-glow-dot shrink-0" />
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black font-marhey text-ink tracking-wide">
                    يَقِين
                  </h1>
                  <p className="text-xs sm:text-sm text-ink-secondary font-medium mt-0.5">
                    معرفة تُثمر يقيناً — ملاذك القرآني الهادئ
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to="/quran"
                  className="tactile-pill px-5 py-2.5 text-xs sm:text-sm font-bold text-ink hover:text-glow flex items-center gap-2"
                >
                  <BookOpen size={15} className="text-glow" />
                  <span>تصفح المصحف</span>
                </Link>

                <Link
                  id="tour-meditation"
                  to="/yaqeen"
                  className="tactile-pill px-5 py-2.5 text-xs sm:text-sm font-bold text-ink hover:text-glow flex items-center gap-2"
                >
                  <Sparkles size={15} className="text-glow" />
                  <span>وضع اليقين</span>
                </Link>
              </div>
            </div>

            {/* Daily Ayah Carved Inner Frame */}
            <div
              id="tour-daily-ayah"
              className="tactile-card p-5 sm:p-8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="recessed-well px-3.5 py-1 text-[11px] font-bold text-glow tracking-wide">
                  آية اليوم
                </span>

                {dailyAyah && (
                  <Link
                    to={`/surah/${dailyAyah.surah.number}`}
                    state={{ highlightAyahIndex: dailyAyah.numberInSurah - 1 }}
                    className="tactile-pill px-3.5 py-1.5 text-xs font-bold text-ink-secondary hover:text-ink flex items-center gap-1.5"
                  >
                    <span>
                      سورة {dailyAyah.surah.name.replace(/س(?:ُورَةُ|ورة)\s*/g, '')} ·{' '}
                      {dailyAyah.numberInSurah.toLocaleString('ar-EG')}
                    </span>
                    <ArrowUpLeft size={13} />
                  </Link>
                )}
              </div>

              {dailyAyah ? (
                <>
                  <p className="font-uthmanic text-2xl sm:text-4xl md:text-[2.6rem] leading-[2.2] text-ink text-center py-2">
                    {dailyAyah.text}
                  </p>

                  {/* Recessed Mini Audio Player for Daily Ayah */}
                  <div className="recessed-well p-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={toggleDailyAyahAudio}
                      className={`tactile-pill px-5 py-2 text-xs font-bold flex items-center gap-2 ${
                        isAyahPlaying ? 'active-ayah-glow text-glow' : 'text-ink hover:text-glow'
                      }`}
                    >
                      {isAyahPlaying ? (
                        <Pause size={14} fill="currentColor" />
                      ) : (
                        <Play size={14} fill="currentColor" />
                      )}
                      <span>{isAyahPlaying ? 'إيقاف التلاوة' : 'استمع للآية'}</span>
                    </button>

                    <span className="text-[11px] text-ink-muted px-3 truncate">
                      بصوت الشيخ مشاري العفاسي
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center gap-3">
                  <div className="h-7 w-4/5 rounded-xl recessed-box animate-pulse" />
                  <div className="h-7 w-3/5 rounded-xl recessed-box animate-pulse" />
                </div>
              )}
            </div>
          </motion.section>

          {/* Feature Bento Grid */}
          <section id="tour-features" className="bento-stage p-5 sm:p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-ink-muted block">
                  استكشف المنصة
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold font-cairo text-ink">
                  أقسام يقين التفاعلية
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setTourOpen(true)}
                className="tactile-pill px-4 py-2 text-xs font-bold text-ink-secondary hover:text-glow flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                <span>ابدأ جولة في الموقع</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {FEATURE_CARDS.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link key={feature.path} to={feature.path} className="group">
                    <div className="tactile-card p-5 h-full flex items-center justify-between gap-4 group-hover:-translate-y-0.5 group-hover:border-glow-border">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl recessed-box flex items-center justify-center text-ink-secondary group-hover:text-glow shrink-0 transition-colors">
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-extrabold text-ink truncate font-cairo">
                            {feature.title}
                          </h3>
                          <p className="text-xs text-ink-secondary mt-0.5 truncate">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                      <ArrowUpLeft
                        size={16}
                        className="text-ink-muted group-hover:text-glow shrink-0 transition-colors"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* ═══ LEFT BENTO STACK COLUMN (4 cols) ═══ */}
        <aside className="lg:col-span-4 flex flex-col gap-5">
          <SeasonalWidget />
          <FarewellMedia />
        </aside>
      </div>
    </div>
  );
};

export default Home;
