import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Book, Mic, ArrowLeft, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { recitersData } from '../lib/data/recitersData';
import { radioData } from '../lib/data/radioData';

const surahsList = [
  'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس',
  'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج',
  'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان', 'السجدة',
  'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر', 'فصلت', 'الشورى', 'الزخرف', 'الدخان',
  'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن',
  'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق',
  'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان',
  'المرسلات', 'النبأ', 'النازعات', 'عبس', 'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق',
  'الأعلى', 'الغاشية', 'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر',
  'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون',
  'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس',
].map((name, idx) => ({ id: idx + 1, name }));

const SearchOverlay = ({ isOpen, onClose }) => {
  const { setReciter } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ surahs: [], reciters: [], radios: [] });
  const [versesResults, setVersesResults] = useState([]);
  const [isSearchingVerses, setIsSearchingVerses] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ surahs: [], reciters: [], radios: [] });
      return;
    }
    const q = query.toLowerCase();

    const matchedSurahs = surahsList.filter((s) => s.name.includes(q)).slice(0, 5);
    const matchedReciters = recitersData
      .filter((r) => r.name.toLowerCase().includes(q))
      .slice(0, 5);
    const matchedRadios = radioData
      .filter((r) => r.name.toLowerCase().includes(q))
      .slice(0, 5);

    setResults({
      surahs: matchedSurahs,
      reciters: matchedReciters,
      radios: matchedRadios,
    });
  }, [query]);

  useEffect(() => {
    if (!query.trim() || query.length < 3) {
      setVersesResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearchingVerses(true);
      try {
        const response = await fetch(
          `https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/ar`
        );
        const json = await response.json();
        if (json.code === 200 && json.data && json.data.matches) {
          setVersesResults(json.data.matches.slice(0, 10));
        } else {
          setVersesResults([]);
        }
      } catch (err) {
        console.error('Error searching verses:', err);
      } finally {
        setIsSearchingVerses(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="search-overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-md font-tajawal"
          dir="rtl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl tactile-card overflow-hidden p-4 sm:p-5 flex flex-col gap-4"
          >
            {/* Search Input Header */}
            <div className="recessed-well px-4 py-2 flex items-center gap-3">
              <Search className="text-glow shrink-0" size={18} />
              <input
                autoFocus
                type="text"
                placeholder="ابحث عن اسم سورة، قارئ، إذاعة، أو كلمة قرآنية..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-base sm:text-lg font-bold outline-none text-ink placeholder:text-ink-muted"
              />
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink shrink-0"
                aria-label="إغلاق البحث"
              >
                <X size={16} />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
              {!query.trim() ? (
                <div className="recessed-box p-10 text-center">
                  <p className="text-sm font-medium text-ink-secondary">
                    ابدأ الكتابة للبحث في المصحف الشريف، القراء، والإذاعات...
                  </p>
                </div>
              ) : (
                <div className="space-y-5 p-1">
                  {/* Surahs Results */}
                  {results.surahs.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold mb-2.5 text-ink-muted px-1">
                        السور
                      </h3>
                      <div className="space-y-2">
                        {results.surahs.map((surah) => (
                          <button
                            key={surah.id}
                            type="button"
                            onClick={() => {
                              onClose();
                              navigate(`/surah/${surah.id}`);
                            }}
                            className="w-full flex items-center justify-between p-3.5 recessed-box hover:border-glow-border transition-all text-ink"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-9 h-9 rounded-xl tactile-pill flex items-center justify-center text-glow">
                                <Book size={16} />
                              </span>
                              <span className="font-bold text-base font-amiri">
                                سورة {surah.name}
                              </span>
                            </div>
                            <ArrowLeft size={15} className="text-ink-muted" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reciters Results */}
                  {results.reciters.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold mb-2.5 text-ink-muted px-1">
                        القراء
                      </h3>
                      <div className="space-y-2">
                        {results.reciters.map((reciter) => (
                          <button
                            key={reciter.id}
                            type="button"
                            onClick={() => {
                              setReciter(reciter.id);
                              onClose();
                              navigate('/quran');
                            }}
                            className="w-full flex items-center justify-between p-3.5 recessed-box hover:border-glow-border transition-all text-ink"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-9 h-9 rounded-xl tactile-pill flex items-center justify-center text-glow">
                                <Mic size={16} />
                              </span>
                              <span className="font-bold text-sm">{reciter.name}</span>
                            </div>
                            <ArrowLeft size={15} className="text-ink-muted" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Radios Results */}
                  {results.radios?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold mb-2.5 text-ink-muted px-1">
                        الإذاعات
                      </h3>
                      <div className="space-y-2">
                        {results.radios.map((radio) => (
                          <button
                            key={radio.id}
                            type="button"
                            onClick={() => {
                              onClose();
                              navigate(`/radio?station=${radio.id}`);
                            }}
                            className="w-full flex items-center justify-between p-3.5 recessed-box hover:border-glow-border transition-all text-ink"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-9 h-9 rounded-xl tactile-pill flex items-center justify-center text-glow">
                                <Radio size={16} />
                              </span>
                              <span className="font-bold text-sm">{radio.name}</span>
                            </div>
                            <ArrowLeft size={15} className="text-ink-muted" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verses Results */}
                  {isSearchingVerses && (
                    <div className="flex items-center justify-center py-5 gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-glow border-t-transparent animate-spin" />
                      <span className="text-xs font-bold text-ink-secondary">
                        جاري البحث في آيات الذكر الحكيم...
                      </span>
                    </div>
                  )}

                  {versesResults.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold mb-2.5 text-ink-muted px-1">
                        الآيات القرآنية
                      </h3>
                      <div className="space-y-2.5">
                        {versesResults.map((verse, idx) => (
                          <button
                            key={`${verse.number}-${idx}`}
                            type="button"
                            onClick={() => {
                              onClose();
                              navigate(`/surah/${verse.surah.number}`, {
                                state: {
                                  highlightAyahIndex: verse.numberInSurah - 1,
                                },
                              });
                            }}
                            className="w-full text-right p-4 recessed-box hover:border-glow-border transition-all flex flex-col gap-2.5"
                          >
                            <p className="font-uthmanic text-xl leading-relaxed text-right w-full text-ink">
                              {verse.text}
                            </p>
                            <div className="flex justify-between items-center text-xs w-full">
                              <span className="tactile-pill px-3 py-1 text-[11px] font-bold text-glow">
                                سورة {verse.surah.name.replace('سُورَةُ ', '')} · الآية{' '}
                                {verse.numberInSurah.toLocaleString('ar-EG')}
                              </span>
                              <span className="flex items-center gap-1 text-ink-secondary font-bold">
                                الانتقال والاستماع <ArrowLeft size={12} />
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.surahs.length === 0 &&
                    results.reciters.length === 0 &&
                    (!results.radios || results.radios.length === 0) &&
                    versesResults.length === 0 &&
                    !isSearchingVerses && (
                      <div className="recessed-box p-8 text-center text-sm font-bold text-ink-secondary">
                        لا توجد نتائج مطابقة لبحثك.
                      </div>
                    )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
