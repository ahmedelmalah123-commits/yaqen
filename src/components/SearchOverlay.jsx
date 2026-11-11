import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  BookOpen,
  Mic2,
  Radio as RadioIcon,
  Layers,
  Landmark,
  Users,
  ShieldCheck,
  Bookmark,
  Film,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { ModalDialog } from './ui/OverlayPrimitives';
import { useAppStore } from '../store/useAppStore';
import { fetchAllSurahs, searchQuranVerses } from '../features/quran/quranApi';
import { JUZ_LIST } from '../features/quran/juzMetadata';
import { recitersData } from '../lib/data/recitersData';
import { radioData } from '../lib/data/radioData';
import { seerahData } from '../lib/data/seerahData';
import { sahabaData } from '../lib/data/sahabaData';
import { quranStoriesData } from '../lib/data/quranStoriesData';
import { ruqyahText, morningAdhkar, eveningAdhkar } from '../lib/data/ruqyahData';
import { getBookmarks } from '../lib/bookmarks';
import { matchesNormalized, stripSurahPrefix, toArabicDigits } from '../lib/arabicSearch';

const QUICK_SUGGESTIONS = ['البقرة', 'آية الكرسي', 'مشاري العفاسي', 'القاهرة', 'أصحاب الأخدود', 'أبو بكر'];

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [verses, setVerses] = useState([]);
  const [versesLoading, setVersesLoading] = useState(false);
  const [versesError, setVersesError] = useState(false);
  const [activeResultIdx, setActiveResultIdx] = useState(0);

  const navigate = useNavigate();
  const setReciter = useAppStore((s) => s.setReciter);

  const { data: surahs = [] } = useQuery({
    queryKey: ['all-surahs'],
    queryFn: ({ signal }) => fetchAllSurahs(signal),
    enabled: isOpen,
    staleTime: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setDebouncedQuery('');
      setVerses([]);
      setVersesError(false);
      setActiveResultIdx(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 260);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!isOpen || debouncedQuery.length < 2) {
      setVerses([]);
      setVersesError(false);
      setVersesLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setVersesLoading(true);
    setVersesError(false);

    searchQuranVerses(debouncedQuery, controller.signal)
      .then((matches) => {
        setVerses(matches);
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          setVersesError(true);
          setVerses([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setVersesLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery, isOpen]);

  const localResults = useMemo(() => {
    if (!query.trim()) {
      return { surahs: [], juz: [], reciters: [], radios: [], seerah: [], sahaba: [], stories: [], adhkar: [], bookmarks: [] };
    }

    const q = query.trim();

    return {
      surahs: surahs
        .filter(
          (s) =>
            matchesNormalized(s.name, q) ||
            matchesNormalized(stripSurahPrefix(s.name), q) ||
            matchesNormalized(s.englishName, q) ||
            matchesNormalized(String(s.number), q)
        )
        .slice(0, 6),
      juz: JUZ_LIST.filter(
        (j) =>
          matchesNormalized(j.name, q) ||
          matchesNormalized(j.surahName, q) ||
          matchesNormalized(String(j.number), q)
      ).slice(0, 4),
      reciters: recitersData
        .filter((r) => matchesNormalized(r.name, q) || matchesNormalized(r.group, q))
        .slice(0, 5),
      radios: radioData
        .filter((r) => matchesNormalized(r.name, q) || matchesNormalized(r.type, q))
        .slice(0, 4),
      seerah: seerahData
        .filter(
          (s) =>
            matchesNormalized(s.title, q) ||
            matchesNormalized(s.phase, q) ||
            s.content.some((c) => matchesNormalized(c, q))
        )
        .slice(0, 3),
      sahaba: sahabaData
        .filter(
          (s) =>
            matchesNormalized(s.name, q) ||
            matchesNormalized(s.title, q) ||
            s.slides.some((sl) => matchesNormalized(sl.text, q))
        )
        .slice(0, 3),
      stories: quranStoriesData
        .filter(
          (ep) =>
            matchesNormalized(ep.title, q) ||
            matchesNormalized(ep.rawTitle, q) ||
            matchesNormalized(ep.categoryLabel, q)
        )
        .slice(0, 5),
      adhkar: [...ruqyahText, ...morningAdhkar, ...eveningAdhkar]
        .filter((d) => matchesNormalized(d.title, q) || matchesNormalized(d.text, q))
        .slice(0, 3),
      bookmarks: getBookmarks()
        .filter(
          (b) =>
            matchesNormalized(b.surah_name || '', q) ||
            matchesNormalized(b.ayah_text || '', q)
        )
        .slice(0, 4),
    };
  }, [query, surahs]);

  // Flat navigable action items for keyboard arrow navigation
  const flatItems = useMemo(() => {
    const items = [];
    localResults.surahs.forEach((s) =>
      items.push({
        key: `surah-${s.number}`,
        group: 'السور',
        label: `سورة ${stripSurahPrefix(s.name)}`,
        meta: `${toArabicDigits(s.numberOfAyahs)} آية`,
        icon: BookOpen,
        onSelect: () => {
          onClose();
          navigate(`/surah/${s.number}`);
        },
      })
    );
    localResults.juz.forEach((j) =>
      items.push({
        key: `juz-${j.number}`,
        group: 'الأجزاء',
        label: `الجزء ${toArabicDigits(j.number)} (${j.name})`,
        meta: `سورة ${j.surahName}`,
        icon: Layers,
        onSelect: () => {
          onClose();
          navigate(`/surah/${j.surahNumber}?ayah=${j.ayahNumber}`);
        },
      })
    );
    localResults.reciters.forEach((r) =>
      items.push({
        key: `reciter-${r.id}`,
        group: 'القراء',
        label: r.name,
        meta: r.group,
        icon: Mic2,
        onSelect: () => {
          setReciter(r.id);
          onClose();
          navigate('/reciters');
        },
      })
    );
    localResults.radios.forEach((rad) =>
      items.push({
        key: `radio-${rad.id}`,
        group: 'الإذاعات',
        label: rad.name,
        meta: rad.status === 'unavailable' ? 'متوقف مؤقتاً' : rad.type,
        icon: RadioIcon,
        onSelect: () => {
          onClose();
          navigate(`/radio?station=${rad.id}`);
        },
      })
    );
    localResults.bookmarks.forEach((bm) =>
      items.push({
        key: `bm-${bm.surah_id}-${bm.ayah_num}`,
        group: 'المحفوظات',
        label: `سورة ${stripSurahPrefix(bm.surah_name)} · آية ${toArabicDigits(bm.ayah_num)}`,
        meta: 'آية محفوظة',
        icon: Bookmark,
        onSelect: () => {
          onClose();
          navigate(`/surah/${bm.surah_id}?ayah=${bm.ayah_num}`);
        },
      })
    );
    localResults.seerah.forEach((st) =>
      items.push({
        key: `seerah-${st.id}`,
        group: 'السيرة النبوية',
        label: st.title,
        meta: st.phase,
        icon: Landmark,
        onSelect: () => {
          onClose();
          navigate('/seerah');
        },
      })
    );
    localResults.sahaba.forEach((sh) =>
      items.push({
        key: `sahaba-${sh.id}`,
        group: 'الصحابة',
        label: sh.name,
        meta: sh.title,
        icon: Users,
        onSelect: () => {
          onClose();
          navigate('/sahaba');
        },
      })
    );
    localResults.stories.forEach((ep) =>
      items.push({
        key: `story-${ep.videoId}`,
        group: 'قصص القرآن',
        label: ep.title,
        meta: `${ep.categoryLabel} · الحلقة ${toArabicDigits(ep.episodeNumber)}`,
        icon: Film,
        onSelect: () => {
          onClose();
          navigate(`/stories?category=${ep.category}&v=${ep.videoId}`);
        },
      })
    );
    localResults.adhkar.forEach((ad) =>
      items.push({
        key: `adhkar-${ad.id}`,
        group: 'حصن المسلم',
        label: ad.title,
        meta: 'الأذكار والرقية',
        icon: ShieldCheck,
        onSelect: () => {
          onClose();
          navigate('/ruqyah');
        },
      })
    );
    verses.forEach((v, idx) =>
      items.push({
        key: `verse-${v.number}-${idx}`,
        group: 'الآيات القرآنية',
        label: v.text,
        meta: `سورة ${stripSurahPrefix(v.surah.name)} · آية ${toArabicDigits(v.numberInSurah)}`,
        icon: BookOpen,
        isVerse: true,
        onSelect: () => {
          onClose();
          navigate(`/surah/${v.surah.number}?ayah=${v.numberInSurah}`, {
            state: { highlightAyahIndex: v.numberInSurah - 1 },
          });
        },
      })
    );
    return items;
  }, [localResults, verses, navigate, onClose, setReciter]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveResultIdx((i) => Math.min(flatItems.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveResultIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' && flatItems[activeResultIdx]) {
      e.preventDefault();
      flatItems[activeResultIdx].onSelect();
    }
  };

  return (
    <ModalDialog
      open={isOpen}
      onClose={onClose}
      title="البحث الشامل في يقين"
      subtitle="ابحث في السور، الآيات، القراء، الإذاعات، السيرة، والصحابة بدون تشكيل"
      maxWidthClass="max-w-2xl"
    >
      <div className="flex flex-col gap-4 p-1 font-tajawal" dir="rtl">
        <div className="recessed-well px-4 py-2.5 flex items-center gap-3">
          <Search size={17} className="text-glow shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveResultIdx(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="اكتب للبحث (مثال: ال عمران، الله لا اله الا هو، المنشاوي)..."
            aria-label="حقل البحث الشامل"
            className="flex-1 bg-transparent text-sm sm:text-base font-bold text-ink outline-none placeholder:text-ink-muted"
          />
        </div>

        {!query.trim() ? (
          <div className="recessed-box p-6 flex flex-col items-center gap-4 text-center">
            <p className="text-xs sm:text-sm font-semibold text-ink-secondary">
              اقتراحات بحث سريعة:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_SUGGESTIONS.map((sugg) => (
                <button
                  key={sugg}
                  type="button"
                  onClick={() => setQuery(sugg)}
                  className="tactile-pill px-3.5 py-1.5 text-xs font-bold text-ink hover:text-glow"
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {versesLoading && (
              <div className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-ink-secondary">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-glow border-t-transparent animate-spin" />
                <span>جاري البحث في آيات القرآن الكريم...</span>
              </div>
            )}

            {versesError && (
              <div className="recessed-box p-3 text-xs text-ink-secondary flex items-center gap-2">
                <AlertCircle size={14} className="text-glow shrink-0" />
                <span>تعذر البحث النصي في الآيات حالياً، تم عرض النتائج المحلية أدناه.</span>
              </div>
            )}

            {flatItems.length === 0 && !versesLoading ? (
              <div className="recessed-box p-8 text-center text-sm font-bold text-ink-secondary">
                لا توجد نتائج مطابقة لعبارة «{query}».
              </div>
            ) : (
              flatItems.map((item, idx) => {
                const Icon = item.icon;
                const focused = idx === activeResultIdx;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={item.onSelect}
                    onMouseEnter={() => setActiveResultIdx(idx)}
                    className={`w-full text-right p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                      focused ? 'tactile-card active-ayah-glow' : 'recessed-box hover:border-glow-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="w-9 h-9 rounded-xl tactile-pill flex items-center justify-center text-glow shrink-0">
                        <Icon size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`${
                            item.isVerse ? 'font-uthmanic text-base sm:text-lg leading-relaxed' : 'font-bold text-sm'
                          } text-ink truncate`}
                        >
                          {item.label}
                        </p>
                        <span className="text-[11px] text-ink-muted block truncate">
                          {item.group} · {item.meta}
                        </span>
                      </div>
                    </div>
                    <ArrowLeft size={14} className="text-ink-muted shrink-0" />
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </ModalDialog>
  );
};

export default SearchOverlay;
