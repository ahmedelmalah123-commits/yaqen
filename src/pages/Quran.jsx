import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Search, Mic2, ChevronDown } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';

const RECITERS = [
  // ── الأكثر استماعاً ──
  { id: 'ar.alafasy',            name: 'مشاري العفاسي',              group: 'الأكثر استماعاً' },
  { id: 'ar.abdulbasitmurattal', name: 'عبدالباسط عبدالصمد (مرتل)', group: 'الأكثر استماعاً' },
  { id: 'ar.mahermuaiqly',      name: 'ماهر المعيقلي',              group: 'الأكثر استماعاً' },
  { id: 'ar.abdurrahmaansudais', name: 'عبدالرحمن السديس',           group: 'الأكثر استماعاً' },
  { id: 'ar.saoodshuraym',      name: 'سعود الشريم',                group: 'الأكثر استماعاً' },
  // ── ترتيل ──
  { id: 'ar.minshawi',          name: 'المنشاوي (مرتل)',            group: 'ترتيل' },
  { id: 'ar.husary',            name: 'محمود خليل الحصري (مرتل)',   group: 'ترتيل' },
  { id: 'ar.ahmedajamy',        name: 'أحمد العجمي',                group: 'ترتيل' },
  { id: 'ar.hudhaify',          name: 'علي الحذيفي',                group: 'ترتيل' },
  { id: 'ar.shaatree',          name: 'أبو بكر الشاطري',            group: 'ترتيل' },
  { id: 'ar.muhammadayyoob',    name: 'محمد أيوب',                  group: 'ترتيل' },
  { id: 'ar.muhammadjibreel',   name: 'محمد جبريل',                 group: 'ترتيل' },
  { id: 'ar.hanirifai',         name: 'هاني الرفاعي',               group: 'ترتيل' },
  { id: 'ar.khalefa',           name: 'خليفة الطنيجي',              group: 'ترتيل' },
  // ── تجويد ──
  { id: 'ar.minshawimujawwad',  name: 'المنشاوي (مجوّد)',           group: 'تجويد' },
  { id: 'ar.husarymujawwad',    name: 'الحصري (مجوّد)',             group: 'تجويد' },
  { id: 'ar.abdulbasitmujawwad',name: 'عبدالباسط (مجوّد)',          group: 'تجويد' },
  // ── نادر ──
  { id: 'ar.hussary_mujawwad_rare', name: 'الحصري (تسجيلات الإذاعة)', group: 'نادر' },
];

const fetchSurahs = async () => {
  const res = await fetch('https://api.alquran.cloud/v1/surah');
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();
  return data.data;
};

const Quran = () => {
  const { theme, reciter, setReciter } = useAppStore();
  const [search, setSearch] = useState('');
  const [reciterOpen, setReciterOpen] = useState(false);

  const { data: surahs = [], isLoading: loading } = useQuery({
    queryKey: ['surahs'],
    queryFn: fetchSurahs,
  });

  const filteredSurahs = surahs.filter(s =>
    s.name.includes(search) ||
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    String(s.number).includes(search)
  );

  const currentReciterName = RECITERS.find(r => r.id === reciter)?.name || 'اختر قارئاً';

  return (
    <div className="py-6 md:py-10 max-w-7xl mx-auto px-4 font-tajawal pb-32">

      {/* ── Header ── */}
      <div className="flex flex-col gap-5 mb-8 md:mb-10">
        <div>
          <h1 className={`text-3xl md:text-5xl font-bold mb-2 ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
            القرآن الكريم
          </h1>
          <p className={`text-base md:text-lg opacity-70 ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
            استمع واقرأ وتأمل في كلام الله عز وجل
          </p>
        </div>

        {/* Search + Reciter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث عن سورة بالاسم أو الرقم..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full h-12 py-3 pr-11 pl-4 rounded-2xl outline-none transition-all border text-sm md:text-base glass-card
                ${theme === 'dark'
                  ? 'border-primary/30 text-white focus:border-primary placeholder-white/40'
                  : 'border-secondary/20 text-secondary focus:border-secondary placeholder-secondary/40'
                }
              `}
              dir="rtl"
            />
            <Search className={`absolute right-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-primary/60' : 'text-secondary/60'}`} size={18} />
          </div>

          {/* Reciter picker */}
          <div className="relative">
            <button
              onClick={() => setReciterOpen(o => !o)}
              className={`h-12 flex items-center gap-2 px-4 rounded-2xl border font-bold text-sm whitespace-nowrap transition-all w-full sm:w-auto glass-card
                ${theme === 'dark'
                  ? 'border-primary/40 text-primary hover:bg-primary/10'
                  : 'border-secondary/30 text-secondary hover:bg-secondary/5'
                }
              `}
            >
              <Mic2 size={16} />
              <span>{currentReciterName}</span>
              <ChevronDown size={14} className={`transition-transform ${reciterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {reciterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute top-14 left-0 right-0 sm:right-auto sm:min-w-[260px] rounded-2xl border shadow-2xl z-50 overflow-hidden max-h-[60vh] overflow-y-auto glass-card
                  `}
                >
                  {/* Group reciters */}
                  {['الأكثر استماعاً', 'ترتيل', 'تجويد', 'نادر'].map(group => {
                    const groupReciters = RECITERS.filter(r => r.group === group);
                    return (
                      <div key={group}>
                        <div className={`px-4 py-1.5 text-xs font-bold tracking-wide sticky top-0
                          ${theme === 'dark' ? 'bg-secondary/80 text-primary/70' : 'bg-[#FAF8F5]/90 text-secondary/60'}
                        `}>
                          {group}
                        </div>
                        {groupReciters.map(r => (
                          <button
                            key={r.id}
                            onClick={() => { setReciter(r.id); setReciterOpen(false); }}
                            className={`w-full text-right px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between gap-2
                              ${r.id === reciter
                                ? (theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-secondary/10 text-secondary font-bold')
                                : (theme === 'dark' ? 'text-white/80 hover:bg-white/5' : 'text-secondary/70 hover:bg-black/5')
                              }
                            `}
                          >
                            <span>{r.id === reciter ? '✓' : ''}</span>
                            <span>{r.name}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Surah grid ── */}
      {loading ? (
        <div className="auto-grid">
          {[...Array(16)].map((_, i) => (
            <div key={i} className={`h-20 rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-[#0A291F]' : 'bg-white shadow-sm'}`} />
          ))}
        </div>
      ) : (
        <motion.div
          className="auto-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filteredSurahs.map((surah, index) => (
            <Link key={surah.number} to={`/surah/${surah.number}`} onClick={() => setReciterOpen(false)}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.015, 0.5) }}
                whileHover={{ scale: 1.02, y: -3 }}
                className={`p-4 md:p-5 rounded-2xl flex items-center gap-4 transition-all h-full glass-card overflow-hidden relative group`}
              >
                <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-20 transition-all group-hover:opacity-60 group-hover:scale-150
                  ${theme === 'dark' ? 'bg-primary' : 'bg-secondary'}
                `}></div>
                
                {/* Number badge */}
                <div className={`w-10 h-10 md:w-11 md:h-11 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-sm border rotate-45 z-10
                  ${theme === 'dark' ? 'border-primary/40 text-primary' : 'border-secondary/30 text-secondary'}
                `}>
                  <span className="-rotate-45 text-xs md:text-sm">{surah.number}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 z-10">
                  <h3 className={`text-lg md:text-xl font-bold truncate leading-tight font-amiri ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
                    {surah.name.replace(/س(?:ُورَةُ|ورة)\s*/g, 'سورة ')}
                  </h3>
                  <p className={`text-xs md:text-sm mt-0.5 ${theme === 'dark' ? 'text-white/60' : 'text-secondary/60'}`}>
                    {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && filteredSurahs.length === 0 && (
        <div className={`text-center py-20 opacity-60 font-bold text-xl ${theme === 'dark' ? 'text-[#C8A96A]' : 'text-[#0F3D2E]'}`}>
          لم يتم العثور على نتائج
        </div>
      )}
    </div>
  );
};

export default Quran;
