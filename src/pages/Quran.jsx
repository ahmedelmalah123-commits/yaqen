import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  BookOpen,
  Mic2,
  ChevronDown,
  Layers,
  ArrowUpLeft,
  X,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAudioStore } from '../store/useAudioStore';
import { fetchAllSurahs } from '../features/quran/quranApi';
import { JUZ_LIST } from '../features/quran/juzMetadata';
import { reciterGroups, getReciterById } from '../lib/data/recitersData';
import { matchesNormalized, stripSurahPrefix, toArabicDigits } from '../lib/arabicSearch';
import { SegmentedTabs, SectionHeader } from '../components/ui/Primitives';
import { CardsSkeleton, EmptyState, ErrorState } from '../components/ui/StateViews';

const Quran = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('surahs');
  const [revelationFilter, setRevelationFilter] = useState('all');
  const [reciterOpen, setReciterOpen] = useState(false);

  const reciterId = useAppStore((s) => s.reciter);
  const setReciter = useAppStore((s) => s.setReciter);
  const lastSession = useAudioStore((s) => s.lastSession);

  const currentReciter = getReciterById(reciterId);

  const {
    data: surahs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['all-surahs'],
    queryFn: ({ signal }) => fetchAllSurahs(signal),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const filteredSurahs = useMemo(() => {
    return surahs.filter((s) => {
      if (revelationFilter === 'meccan' && s.revelationType !== 'Meccan') return false;
      if (revelationFilter === 'medinan' && s.revelationType !== 'Medinan') return false;
      if (!searchQuery.trim()) return true;
      return (
        matchesNormalized(s.name, searchQuery) ||
        matchesNormalized(stripSurahPrefix(s.name), searchQuery) ||
        matchesNormalized(s.englishName, searchQuery) ||
        matchesNormalized(String(s.number), searchQuery)
      );
    });
  }, [surahs, searchQuery, revelationFilter]);

  const filteredJuz = useMemo(() => {
    if (!searchQuery.trim()) return JUZ_LIST;
    return JUZ_LIST.filter(
      (j) =>
        matchesNormalized(j.name, searchQuery) ||
        matchesNormalized(j.surahName, searchQuery) ||
        matchesNormalized(String(j.number), searchQuery)
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-5 font-tajawal" dir="rtl">
      <div className="bento-stage p-5 sm:p-7 flex flex-col gap-5">
        <SectionHeader
          eyebrow="كتاب الله الكريم"
          title="المصحف الشريف"
          description="تصفح السور والأجزاء بالرسم العثماني مع التفسير الميسر والتلاوة الصوتية المتواصلة."
          action={
            lastSession && (
              <Link
                to={`/surah/${lastSession.surahNumber}?ayah=${lastSession.ayahNumber}`}
                className="tactile-pill active-ayah-glow px-4 py-2.5 text-xs font-extrabold text-glow flex items-center gap-2"
              >
                <BookOpen size={15} />
                <span>
                  موضع الآية: سورة {lastSession.surahName} ({toArabicDigits(lastSession.ayahNumber)})
                </span>
                <ArrowUpLeft size={14} />
              </Link>
            )
          }
        />

        {/* Controls Bar: Search, Index Tabs, Revelation Filter, Reciter Picker */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="recessed-well px-4 py-2.5 flex items-center gap-2.5 flex-1 max-w-xl">
            <Search size={16} className="text-glow shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم السورة، الجزء، أو الرقم (مثال: البقره، يس، 18)..."
              aria-label="ابحث في فهرس القرآن الكريم"
              className="flex-1 bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink-muted"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="مسح البحث"
                className="text-ink-muted hover:text-ink"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <SegmentedTabs
              activeId={activeTab}
              onChange={setActiveTab}
              items={[
                { id: 'surahs', label: 'السور', icon: BookOpen, badge: toArabicDigits(114) },
                { id: 'juz', label: 'الأجزاء', icon: Layers, badge: toArabicDigits(30) },
              ]}
            />

            {/* Reciter Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setReciterOpen((o) => !o)}
                className="tactile-pill px-4 py-2.5 text-xs font-bold text-ink flex items-center gap-2"
              >
                <Mic2 size={14} className="text-glow" />
                <span className="max-w-[140px] truncate">{currentReciter.name}</span>
                <ChevronDown
                  size={14}
                  className={`text-ink-muted transition-transform ${reciterOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {reciterOpen && (
                <div className="absolute left-0 top-12 w-72 max-h-80 overflow-y-auto no-scrollbar tactile-card p-2 z-30 shadow-raised">
                  {reciterGroups.map((group) => (
                    <div key={group.group} className="mb-2 last:mb-0">
                      <div className="px-3 py-1 text-[11px] font-bold text-ink-muted">
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
                          className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-colors ${r.id === currentReciter.id
                            ? 'active-ayah-glow text-glow'
                            : 'text-ink-secondary hover:text-ink hover:bg-recessed/50'
                            }`}
                        >
                          <span className="truncate">{r.name}</span>
                          <span className="text-[10px] opacity-75">
                            {r.id === currentReciter.id ? '✓' : ''}
                          </span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'surahs' && (
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'جميع السور' },
              { id: 'meccan', label: 'السور المكية' },
              { id: 'medinan', label: 'السور المدنية' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRevelationFilter(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${revelationFilter === item.id
                  ? 'tactile-pill active-ayah-glow text-glow'
                  : 'text-ink-secondary hover:text-ink'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeTab === 'surahs' ? (
        isLoading ? (
          <CardsSkeleton count={15} />
        ) : error ? (
          <ErrorState
            title="تعذر تحميل فهرس السور"
            message="حدث خطأ أثناء الاتصال بخدمة المصحف، يرجى المحاولة مرة أخرى."
            onRetry={() => refetch()}
          />
        ) : filteredSurahs.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={22} />}
            title="لم يتم العثور على سور مطابقة"
            description="تأكد من كتابة اسم السورة أو رقمها، أو أعد ضبط عامل التصفية."
          />
        ) : (
          <div className="auto-grid">
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
                      <h2 className="text-lg font-bold truncate font-amiri text-ink leading-snug">
                        سورة {stripSurahPrefix(surah.name)}
                      </h2>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} ·{' '}
                        {toArabicDigits(surah.numberOfAyahs)} آية
                      </p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-muted group-hover:text-glow shrink-0">
                    <BookOpen size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : filteredJuz.length === 0 ? (
        <EmptyState
          icon={<Layers size={22} />}
          title="لا توجد أجزاء مطابقة للبحث"
          description="ابحث برقم الجزء من ١ إلى ٣٠ أو باسم السورة التي يبدأ بها."
        />
      ) : (
        <div className="auto-grid">
          {filteredJuz.map((juz) => (
            <Link
              key={juz.number}
              to={`/surah/${juz.surahNumber}?ayah=${juz.ayahNumber}`}
              className="group"
            >
              <div className="tactile-card p-5 flex items-center justify-between gap-4 h-full group-hover:-translate-y-0.5 group-hover:border-glow-border">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl recessed-box flex items-center justify-center font-mono font-bold text-xs text-glow shrink-0">
                    {toArabicDigits(juz.number)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-extrabold font-cairo text-ink truncate">
                      الجزء {juz.name}
                    </h2>
                    <p className="text-xs text-ink-secondary mt-0.5 truncate">
                      يبدأ من سورة {juz.surahName} · آية {toArabicDigits(juz.ayahNumber)} · ص{' '}
                      {toArabicDigits(juz.page)}
                    </p>
                  </div>
                </div>
                <ArrowUpLeft
                  size={16}
                  className="text-ink-muted group-hover:text-glow shrink-0"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quran;
