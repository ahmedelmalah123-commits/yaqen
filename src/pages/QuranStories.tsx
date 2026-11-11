import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Film,
  ListVideo,
  Play,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  QURAN_STORIES_PLAYLIST,
  STORY_CATEGORIES,
  buildYouTubeEmbedUrl,
  buildYouTubeThumbnailUrl,
  buildYouTubeWatchUrl,
  quranStoriesData,
  type QuranStoryEpisode,
  type StoryCategoryId,
} from '../lib/data/quranStoriesData';
import { matchesNormalized, normalizeArabic, toArabicDigits } from '../lib/arabicSearch';
import { SectionHeader, SegmentedTabs } from '../components/ui/Primitives';
import { EmptyState } from '../components/ui/StateViews';

type CategoryFilter = 'all' | StoryCategoryId;

const CATEGORY_ICONS: Record<CategoryFilter, React.ComponentType<{ size?: string | number; className?: string }>> = {
  all: ListVideo,
  human: Users,
  women: Sparkles,
  animals: Film,
};

interface EpisodeThumbProps {
  videoId: string;
  alt: string;
}

const EpisodeThumb: React.FC<EpisodeThumbProps> = ({ videoId, alt }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [videoId]);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-recessed text-ink-muted">
        <Film size={28} className="opacity-60" />
      </div>
    );
  }

  return (
    <img
      src={buildYouTubeThumbnailUrl(videoId)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
    />
  );
};

const isValidCategory = (value: string | null): value is CategoryFilter =>
  value === 'all' || value === 'human' || value === 'women' || value === 'animals';

const QuranStories: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCatParam = searchParams.get('category');
  const initialVideoParam = searchParams.get('v');

  const initialVideo = useMemo(
    () => quranStoriesData.find((ep) => ep.videoId === initialVideoParam) || null,
    [initialVideoParam]
  );

  const [category, setCategory] = useState<CategoryFilter>(() => {
    if (isValidCategory(initialCatParam)) return initialCatParam;
    if (initialVideo) return initialVideo.category;
    return 'all';
  });
  const [query, setQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    () => initialVideo?.videoId || quranStoriesData[0]?.videoId || ''
  );
  const [autoplayNext, setAutoplayNext] = useState(false);

  const playerSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialCatParam && isValidCategory(initialCatParam) && initialCatParam !== category) {
      setCategory(initialCatParam);
    }
    if (initialVideo && initialVideo.videoId !== selectedVideoId) {
      setSelectedVideoId(initialVideo.videoId);
    }
    // Only sync from external navigation changes in URL search params
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCatParam, initialVideoParam]);

  const tabItems = useMemo(
    () => [
      {
        id: 'all',
        label: 'الكل',
        icon: CATEGORY_ICONS.all,
        badge: toArabicDigits(quranStoriesData.length),
      },
      ...STORY_CATEGORIES.map((cat) => ({
        id: cat.id,
        label: cat.label,
        icon: CATEGORY_ICONS[cat.id],
        badge: toArabicDigits(cat.count),
      })),
    ],
    []
  );

  const filteredEpisodes = useMemo(() => {
    const byCategory =
      category === 'all'
        ? quranStoriesData
        : quranStoriesData.filter((ep) => ep.category === category);

    if (!query.trim()) return byCategory;
    const q = query.trim();
    const cleanQ = normalizeArabic(q);
    const strippedAl = cleanQ.startsWith('ال') && cleanQ.length >= 4 ? cleanQ.slice(2) : '';

    return byCategory.filter(
      (ep) =>
        matchesNormalized(ep.title, q) ||
        matchesNormalized(ep.rawTitle, q) ||
        matchesNormalized(ep.categoryLabel, q) ||
        (strippedAl && (matchesNormalized(ep.title, strippedAl) || matchesNormalized(ep.rawTitle, strippedAl))) ||
        String(ep.episodeNumber).includes(q) ||
        matchesNormalized(toArabicDigits(ep.episodeNumber), q)
    );
  }, [category, query]);

  const activeEpisode: QuranStoryEpisode | null = useMemo(() => {
    const exact = quranStoriesData.find((ep) => ep.videoId === selectedVideoId);
    if (exact) return exact;
    return filteredEpisodes[0] || quranStoriesData[0] || null;
  }, [filteredEpisodes, selectedVideoId]);

  const currentList = filteredEpisodes.length > 0 ? filteredEpisodes : quranStoriesData;
  const activeIdxInList = activeEpisode
    ? currentList.findIndex((ep) => ep.videoId === activeEpisode.videoId)
    : -1;
  const prevEpisode = activeIdxInList > 0 ? currentList[activeIdxInList - 1] : null;
  const nextEpisode =
    activeIdxInList >= 0 && activeIdxInList < currentList.length - 1
      ? currentList[activeIdxInList + 1]
      : null;

  const activeCategoryMeta = useMemo(
    () => STORY_CATEGORIES.find((cat) => cat.id === category) || null,
    [category]
  );

  const handleSelectCategory = (nextCat: string) => {
    const normalized: CategoryFilter = isValidCategory(nextCat) ? nextCat : 'all';
    setCategory(normalized);
    setAutoplayNext(false);

    const firstInCat =
      normalized === 'all'
        ? quranStoriesData[0]
        : quranStoriesData.find((ep) => ep.category === normalized);

    const nextVideo =
      activeEpisode && (normalized === 'all' || activeEpisode.category === normalized)
        ? activeEpisode
        : firstInCat;

    if (nextVideo) {
      setSelectedVideoId(nextVideo.videoId);
      setSearchParams({ category: normalized, v: nextVideo.videoId }, { replace: true });
    } else {
      setSearchParams({ category: normalized }, { replace: true });
    }
  };

  const handleSelectEpisode = (ep: QuranStoryEpisode, scrollToPlayer = true) => {
    setSelectedVideoId(ep.videoId);
    setAutoplayNext(true);
    setSearchParams({ category, v: ep.videoId }, { replace: true });
    if (scrollToPlayer) {
      playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bento-stage p-5 sm:p-8 font-tajawal flex flex-col gap-6" dir="rtl">
      <SectionHeader
        eyebrow="سلسلة مرئية قرآنية موثقة"
        title="قصص الإنسان والنساء والحيوان في القرآن"
        description={`مشاهدة الحلقات الرسمية عبر تضمين YouTube المباشر — ${toArabicDigits(QURAN_STORIES_PLAYLIST.totalVideos)} حلقة مصنفة حسب السلاسل الفعلية في القائمة المرجعية.`}
        action={
          <a
            href={QURAN_STORIES_PLAYLIST.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tactile-pill px-4 py-2.5 text-xs font-bold text-ink hover:text-glow inline-flex items-center gap-2 transition-colors"
          >
            <span>قائمة التشغيل على YouTube</span>
            <ExternalLink size={14} className="text-glow" />
          </a>
        }
      />

      {/* Category Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {STORY_CATEGORIES.map((cat) => {
          const isSelected = category === cat.id;
          const Icon = CATEGORY_ICONS[cat.id];
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(isSelected ? 'all' : cat.id)}
              aria-pressed={isSelected}
              className={`tactile-card p-4 text-right flex flex-col justify-between gap-2.5 transition-all ${
                isSelected ? 'border-glow-border ring-1 ring-glow/30' : 'hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="w-9 h-9 rounded-xl recessed-box flex items-center justify-center text-glow shrink-0">
                  <Icon size={17} />
                </span>
                <span className="recessed-well px-2.5 py-1 text-[11px] font-bold text-ink-secondary">
                  {toArabicDigits(cat.count)} حلقة
                </span>
              </div>
              <div>
                <h2 className="text-base font-black font-cairo text-ink">{cat.label}</h2>
                <p className="text-xs text-ink-secondary leading-relaxed mt-1">{cat.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Embedded Video Player Stage */}
      {activeEpisode && (
        <section
          ref={playerSectionRef}
          aria-label="مشغل الحلقة المحددة"
          className="tactile-card p-4 sm:p-6 flex flex-col gap-4"
        >
          <div className="aspect-video w-full rounded-2xl overflow-hidden recessed-box bg-black/90">
            <iframe
              key={activeEpisode.videoId}
              src={buildYouTubeEmbedUrl(activeEpisode.videoId, autoplayNext)}
              title={activeEpisode.rawTitle}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0 flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <span className="tactile-pill px-3 py-1 text-glow">
                  {activeEpisode.categoryLabel}
                </span>
                <span className="recessed-well px-2.5 py-1 text-ink-secondary">
                  الحلقة {toArabicDigits(activeEpisode.episodeNumber)}
                </span>
                <span className="recessed-well px-2.5 py-1 text-ink-secondary inline-flex items-center gap-1" dir="ltr">
                  <Clock size={12} className="text-glow" />
                  {activeEpisode.duration}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-cairo text-ink leading-snug">
                {activeEpisode.title}
              </h2>
              <p className="text-xs text-ink-muted truncate" title={activeEpisode.rawTitle}>
                المصدر: قناة {activeEpisode.channel} · مضمّن رسمياً من YouTube
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => prevEpisode && handleSelectEpisode(prevEpisode, false)}
                disabled={!prevEpisode}
                className="tactile-pill px-3.5 py-2 text-xs font-bold text-ink disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
              >
                <ChevronRight size={15} className="text-glow" />
                <span>الحلقة السابقة</span>
              </button>

              <button
                type="button"
                onClick={() => nextEpisode && handleSelectEpisode(nextEpisode, false)}
                disabled={!nextEpisode}
                className="tactile-pill px-3.5 py-2 text-xs font-bold text-ink disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
              >
                <span>الحلقة التالية</span>
                <ChevronLeft size={15} className="text-glow" />
              </button>

              <a
                href={buildYouTubeWatchUrl(activeEpisode.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="recessed-well px-3.5 py-2 text-xs font-bold text-ink-secondary hover:text-glow inline-flex items-center gap-1.5 transition-colors"
              >
                <span>فتح على YouTube</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Filter Tabs & Episode Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <SegmentedTabs
          items={tabItems}
          activeId={category}
          onChange={handleSelectCategory}
        />

        <div className="recessed-well px-4 py-2.5 flex items-center gap-2.5 w-full lg:w-80">
          <Search size={16} className="text-glow shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث باسم القصة أو رقم الحلقة..."
            aria-label="ابحث في قصص القرآن"
            className="flex-1 bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="مسح البحث"
              className="text-ink-muted hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {activeCategoryMeta && (
        <div className="recessed-box px-4 py-2.5 text-xs text-ink-secondary flex flex-wrap items-center justify-between gap-2">
          <span>{activeCategoryMeta.description}</span>
          <span className="font-bold text-ink">
            المعروض: {toArabicDigits(filteredEpisodes.length)} حلقة
          </span>
        </div>
      )}

      {/* Episodes Grid */}
      {filteredEpisodes.length === 0 ? (
        <EmptyState
          icon={<Film size={22} />}
          title="لا توجد حلقات مطابقة لبحثك"
          description="جرب البحث بكلمة أخرى مثل أصحاب الأخدود، السيدة مريم، الهدهد، أو امسح حقل البحث."
          action={
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('all');
              }}
              className="tactile-pill px-4 py-2 text-xs font-bold text-ink hover:text-glow"
            >
              عرض جميع الحلقات ({toArabicDigits(quranStoriesData.length)})
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredEpisodes.map((ep) => {
            const isSelected = activeEpisode?.videoId === ep.videoId;
            return (
              <button
                key={ep.videoId}
                type="button"
                onClick={() => handleSelectEpisode(ep)}
                aria-pressed={isSelected}
                className={`group tactile-card overflow-hidden text-right flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-glow-border ring-1 ring-glow/40'
                    : 'hover:-translate-y-0.5 hover:border-glow-border'
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-surface-recessed">
                  <EpisodeThumb videoId={ep.videoId} alt={ep.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                    الحلقة {toArabicDigits(ep.episodeNumber)}
                  </span>
                  <span
                    className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/75 text-white"
                    dir="ltr"
                  >
                    {ep.duration}
                  </span>
                  <span
                    className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                      isSelected
                        ? 'bg-glow text-white scale-105'
                        : 'bg-black/65 text-white group-hover:scale-105'
                    }`}
                  >
                    <Play size={13} className="fill-current" />
                  </span>
                </div>

                <div className="p-3.5 flex flex-col gap-1.5 flex-1 justify-between">
                  <span className="text-[11px] font-bold text-glow">{ep.categoryLabel}</span>
                  <h3 className="text-sm font-black font-cairo text-ink leading-snug line-clamp-2">
                    {ep.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuranStories;
