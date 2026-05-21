import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, Users, Compass, ChevronLeft, Shield, Radio, Smile, Mic, Sparkles, Wind } from 'lucide-react';
import SeasonalWidget from '../components/SeasonalWidget';

const Home = () => {
  const { theme } = useAppStore();
  const [dailyAyah, setDailyAyah] = useState(null);

  useEffect(() => {
    // 6236 is the max Ayahs in Quran
    const randomAyahId = Math.floor(Math.random() * 6236) + 1;
    fetch(`https://api.alquran.cloud/v1/ayah/${randomAyahId}/ar.alafasy`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          let text = data.data.text;
          if (text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
            text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
          }
          setDailyAyah({ ...data.data, text });
        }
      })
      .catch(err => console.error("Error fetching daily ayah:", err));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-[80vh] font-tajawal pb-32">

      {/* Spotlight Hero Section */}
      <motion.div
        id="tour-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full text-center mt-6 md:mt-12 px-4"
      >
        <div className={`relative w-full max-w-6xl mx-auto py-12 md:py-24 px-6 md:px-12 rounded-[2rem] md:rounded-[3rem] overflow-hidden glass-card
          ${theme === 'dark' ? 'bg-gradient-to-br from-[#022c22]/90 to-[#064e3b]/90 border-primary/30' : 'bg-gradient-to-br from-[#FAF8F5]/90 to-white/90 border-secondary/10'}
        `}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-multiply"></div>

          <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px]">
            <h1 className={`text-sm md:text-lg font-bold tracking-widest uppercase mb-6 ${theme === 'dark' ? 'text-primary' : 'text-secondary/60'}`}>
              آية اليوم
            </h1>

            {dailyAyah ? (
               <div className="max-w-4xl max-auto">
                  <p className={`text-4xl md:text-6xl leading-[2.5] md:leading-[2.8] font-amiri mb-8 drop-shadow-sm ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
                    {dailyAyah.text}
                  </p>
                  <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border text-sm md:text-lg font-bold font-tajawal
                     ${theme === 'dark' ? 'border-primary/30 text-primary bg-primary/10' : 'border-secondary/20 text-secondary bg-secondary/5'}
                  `}>
                   سورة {dailyAyah.surah.name.replace(/س(?:ُورَةُ|ورة)\s*/g, '')} • {dailyAyah.numberInSurah}
                 </div>
               </div>
            ) : (
               <div className="animate-pulse flex flex-col items-center gap-4">
                 <div className="h-12 w-3/4 bg-black/10 rounded-lg"></div>
                 <div className="h-12 w-1/2 bg-black/10 rounded-lg"></div>
               </div>
            )}
            
            <div className="mt-12 pt-12 w-full border-t border-dashed border-white/20 flex flex-col items-center">
                <h2 className={`text-5xl md:text-8xl font-black mb-4 font-marhey text-neon-gold`}>يَقِين</h2>
                <p className={`text-lg md:text-2xl font-tajawal opacity-80 ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>معرفة تُثمر يقينًا</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Seasonal Dhul-Hijjah & Arafat Widget */}
      <SeasonalWidget />

      {/* Feature Cards Grid */}
      <div id="tour-features" className="w-full max-w-6xl mx-auto mt-16 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "القرآن", icon: <BookOpen size={28} />, path: "/quran", desc: "اقرأ واستمع" },
            { title: "القراء", icon: <Mic size={28} />, path: "/reciters", desc: "المكتبة الصوتية" },
            { title: "الإذاعة", icon: <Radio size={28} />, path: "/radio", desc: "بث مباشر 24/7" },
            { title: "الصحابة", icon: <Users size={28} />, path: "/sahaba", desc: "سيرهم العطرة" },
            { title: "السيرة", icon: <Compass size={28} />, path: "/seerah", desc: "خط زمني تفاعلي" },
            { title: "الرقية", icon: <Shield size={28} />, path: "/ruqyah", desc: "حصن المسلم" },
            { title: "نوادر", icon: <Sparkles size={28} />, path: "/rare-recitations", desc: "تسجيلات مفقودة" }
          ].map((feature, i) => (
            <Link to={feature.path} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-6 rounded-3xl flex flex-col items-start transition-all glass-card relative group overflow-hidden`}
              >
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-all group-hover:opacity-60
                  ${theme === 'dark' ? 'bg-primary' : 'bg-secondary'}
                `}></div>
                
                <div className={`p-4 rounded-xl mb-4 z-10 transition-colors ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-1 z-10 ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>{feature.title}</h3>
                <p className={`text-sm z-10 opacity-70 ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>{feature.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tour & Beta Status Section */}
      <div className="w-full flex flex-col items-center gap-6 mt-16 pb-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => useAppStore.getState().setTourOpen(true)}
          className={`px-8 py-3 rounded-full font-bold text-sm border flex items-center gap-2 transition-all
            ${theme === 'dark' 
              ? 'border-primary/40 text-primary hover:bg-primary/10' 
              : 'border-secondary/40 text-secondary hover:bg-secondary/5'
            }
          `}
        >
          <Sparkles size={16} />
          بدء جولة في الموقع
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2.5, duration: 2 }}
          className="text-center font-playpen text-lg text-white/40 tracking-widest select-none"
        >
          هذا الموقع لا يزال في إصداره التجريبي (بيتا)
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
