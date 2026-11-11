import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Search, Mic2, ChevronDown, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { recitersData, reciterGroups } from '../lib/data/recitersData';

const fetchSurahs = async () => {
  const res = await fetch('https://api.alquran.cloud/v1/surah');
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();
  return data.data;
};

const Quran = () => {
  const { reciter, setReciter } = useAppStore();
  const [search, setSearch] = useState('');
  const [revelationFilter, setRevelationFilter] = useState('all'); // 'all' | 'Meccan' | 'Medinan'
  const [reciterOpen, setReciterOpen] = useState(false);

  const { data: surahs = [], isLoading: loading } = useQuery({
    queryKey: ['surahs'],
    queryFn: fetchSurahs,
  });

  const filteredSurahs = surahs.filter((s) => {
    const matchesSearch =
      s.name.includes(search) ||
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search);
    const matchesType =
      revelationFilter === 'all' || s.revelationType === revelationFilter;
    return matchesSearch && matchesType;
  });

  const currentReciterName =
    recitersData.find((r) => r.id === reciter)?.name || 'اختر قارئاً';

  return (
    <div className="max-w-[1440px] mx-auto w-full bento-stage p-5 sm:p-8 font-tajawal flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <span className="text-xs font-bold text-ink-muted tracking-wide block mb-1">
            المصحف الشريف · ١١٤ سورة
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-cairo text-ink">
            فهرس السور القرآنية
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary mt-1.5">
            استمع واقرأ وتدبر في كلام الله عز وجل بالخط العثماني والتفسير الميسر
          </p>
        </div>

        {/* Revelation Type Filter Pills */}
        <div className="recessed-well p-1.5 flex items-center gap-1.5 self-start">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'Meccan', label: 'مكية' },
            { id: 'Medinan', label: 'مدنية' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRevelationFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                revelationFilter === tab.id
                  ? 'tactile-pill text-ink'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search + Reciter Row ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Recessed Search Well */}
        <div className="recessed-well flex-1 h-12 px-4 flex items-center gap-3">
          <Search className="text-ink-secondary shrink-0" size={17} />
          <input
            type="text"
            placeholder="ابحث عن سورة بالاسم أو الرقم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm font-medium text-ink placeholder:text-ink-muted"
            dir="rtl"
          />
        </div>

        {/* Reciter Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setReciterOpen((o) => !o)}
            className="h-12 tactile-pill px-5 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-ink whitespace-nowrap w-full sm:w-auto"
          >
            <div className="flex items-center gap-2">
              <Mic2 size={15} className="text-glow" />
              <span>{currentReciterName}</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-ink-secondary transition-transform ${
                reciterOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {reciterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-14 left-0 right-0 sm:right-auto sm:min-w-[270px] tactile-card z-50 overflow-hidden max-h-[55vh] overflow-y-auto no-scrollbar p-2"
              >
                {reciterGroups.map((group) => (
                  <div key={group.group} className="mb-2 last:mb-0">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-ink-muted">
                      {group.group}
                    </div>
                    {group.reciters.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setReciter(r.id);
                          setReciterOpen(false);
                        }}
                        className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between gap-2 ${
                          r.id === reciter
                            ? 'active-ayah-glow text-glow'
                            : 'text-ink-secondary hover:text-ink hover:bg-[var(--bg-recessed)]/60'
                        }`}
                      >
                        <span>{r.name}</span>
                        <span>{r.id === reciter ? '✓' : ''}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Surah Bento Grid ── */}
      {loading ? (
        <div className="auto-grid">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="h-24 rounded-[24px] recessed-box animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          className="auto-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              onClick={() => setReciterOpen(false)}
              className="group"
            >
              <div className="tactile-card p-5 flex items-center justify-between gap-4 h-full group-hover:-translate-y-0.5 group-hover:border-glow-border">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl recessed-box flex items-center justify-center font-mono font-bold text-xs text-ink-secondary group-hover:text-glow shrink-0">
                    {String(surah.number).padStart(2, '0')}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-bold truncate font-amiri text-ink leading-snug">
                      {surah.name.replace(/س(?:ُورَةُ|ورة)\s*/g, 'سورة ')}
                    </h3>
                    <p className="text-xs text-ink-secondary mt-0.5">
                      {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} ·{' '}
                      {surah.numberOfAyahs.toLocaleString('ar-EG')} آية
                    </p>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-muted group-hover:text-glow shrink-0">
                  <BookOpen size={15} />
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      )}

      {!loading && filteredSurahs.length === 0 && (
        <div className="recessed-box text-center py-16 text-ink-secondary font-bold text-base">
          لم يتم العثور على سور مطابقة للبحث
        </div>
      )}
    </div>
  );
};

export default Quran;
