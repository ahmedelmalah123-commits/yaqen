import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import { useAudioStore } from '../store/useAudioStore';
import { fetchSurahBundle, findActiveAyahIndexByTime } from '../features/quran/quranApi';
import { getReciterById } from '../lib/data/recitersData';
import { getBookmarks, toggleBookmark, BOOKMARKS_EVENT } from '../lib/bookmarks';
import { stripBismillah, stripSurahPrefix } from '../lib/arabicSearch';
import { SurahHeader } from '../features/quran/SurahHeader';
import { MushafReader } from '../features/quran/MushafReader';
import { StudyPanelsContent, StudyPanelsDrawer } from '../features/quran/StudyPanelsDrawer';
import { ErrorState } from '../components/ui/StateViews';

const Surah = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const surahNumber = Number(id) || 1;

  const reciterId = useAppStore((s) => s.reciter);
  const setReciter = useAppStore((s) => s.setReciter);
  const readingViewMode = useAppStore((s) => s.readingViewMode);
  const setReadingViewMode = useAppStore((s) => s.setReadingViewMode);
  const setSettingsDrawerOpen = useAppStore((s) => s.setSettingsDrawerOpen);

  const audioSource = useAudioStore((s) => s.source);
  const audioStatus = useAudioStore((s) => s.status);
  const audioCurrentTime = useAudioStore((s) => s.currentTime);
  const playSurahStream = useAudioStore((s) => s.playSurahStream);
  const seekAndPlaySurahStream = useAudioStore((s) => s.seekAndPlaySurahStream);
  const togglePlayPause = useAudioStore((s) => s.togglePlayPause);
  const enqueueTrack = useAudioStore((s) => s.enqueueTrack);
  const recordReadingPosition = useAudioStore((s) => s.recordReadingPosition);

  const [selectedAyahIndex, setSelectedAyahIndex] = useState(0);
  const [selectedPage, setSelectedPage] = useState(null);
  const [studyDrawerOpen, setStudyDrawerOpen] = useState(false);
  const [studySidebarOpen, setStudySidebarOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const activeAyahRef = useRef(null);
  const lastSyncedIndexRef = useRef(null);

  useEffect(() => {
    const sync = () => setBookmarks(getBookmarks());
    window.addEventListener(BOOKMARKS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['surah-bundle', surahNumber, reciterId],
    queryFn: ({ signal }) => fetchSurahBundle(surahNumber, reciterId, signal),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const surahData = data?.surahData;
  const tafsirData = data?.tafsirData;
  const timingData = data?.timingData;
  const currentReciter = getReciterById(reciterId);

  const pageNumbers = useMemo(() => {
    if (!surahData?.ayahs) return [];
    const set = new Set(surahData.ayahs.map((a) => a.page || 1));
    return Array.from(set).sort((a, b) => a - b);
  }, [surahData]);

  const initializedSurahKeyRef = useRef('');

  // Reset initial page / apply deep-linked ?ayah=N or location.state highlight once per surah/navigation
  useEffect(() => {
    if (!surahData?.ayahs?.length) return;
    const navKey = `${surahData.number}|${searchParams.toString()}|${location.key || ''}`;
    if (initializedSurahKeyRef.current === navKey) return;
    initializedSurahKeyRef.current = navKey;

    const queryAyah = Number(searchParams.get('ayah'));
    const stateIdx = location.state?.highlightAyahIndex;

    let targetIdx = 0;
    if (Number.isInteger(queryAyah) && queryAyah >= 1 && queryAyah <= surahData.ayahs.length) {
      targetIdx = queryAyah - 1;
    } else if (typeof stateIdx === 'number' && stateIdx >= 0 && stateIdx < surahData.ayahs.length) {
      targetIdx = stateIdx;
    }

    setSelectedAyahIndex(targetIdx);
    const targetPage = surahData.ayahs[targetIdx]?.page || pageNumbers[0] || 1;
    setSelectedPage(targetPage);

    const ayahObj = surahData.ayahs[targetIdx];
    recordReadingPosition({
      surahNumber: surahData.number,
      surahName: stripSurahPrefix(surahData.name),
      ayahNumber: ayahObj.numberInSurah,
      ayahIndex: targetIdx,
      reciterId,
      updatedAt: new Date().toISOString(),
    });
  }, [surahData, searchParams, location.state, location.key, pageNumbers, reciterId, recordReadingPosition]);

  const isSameStreamLoaded =
    audioSource?.kind === 'surah-stream' &&
    audioSource.surahNumber === surahNumber &&
    audioSource.reciterId === currentReciter.id &&
    audioSource.clipAyahNumber === undefined;

  const isPlayingThisSurah =
    isSameStreamLoaded && (audioStatus === 'playing' || audioStatus === 'loading');

  const timingAvailable = Boolean(timingData?.timingAvailable && timingData.segments.length > 0);

  // Sync active ayah highlight ONLY when same reciter+surah full stream is active and validated timings exist
  const activePlayingIndex = useMemo(() => {
    if (!isSameStreamLoaded || !timingAvailable || !timingData?.segments) return null;
    if (audioStatus === 'idle') return null;
    return findActiveAyahIndexByTime(timingData.segments, audioCurrentTime);
  }, [isSameStreamLoaded, timingAvailable, timingData, audioStatus, audioCurrentTime]);

  useEffect(() => {
    if (!isPlayingThisSurah || activePlayingIndex === null || !surahData?.ayahs?.[activePlayingIndex]) {
      lastSyncedIndexRef.current = null;
      return;
    }
    if (lastSyncedIndexRef.current === activePlayingIndex) return;
    lastSyncedIndexRef.current = activePlayingIndex;

    setSelectedAyahIndex(activePlayingIndex);
    const p = surahData.ayahs[activePlayingIndex].page;
    if (p && p !== selectedPage) {
      setSelectedPage(p);
    }
    if (activeAyahRef.current) {
      activeAyahRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isPlayingThisSurah, activePlayingIndex, surahData, selectedPage]);

  // Header full-surah play CTA always starts complete surah from 0:00 (or toggles if already loaded)
  const handleToggleSurahPlayback = () => {
    if (!surahData || !data?.surahAudioUrl) return;
    if (isSameStreamLoaded) {
      togglePlayPause();
      return;
    }
    playSurahStream({
      surahNumber: surahData.number,
      surahName: stripSurahPrefix(surahData.name),
      reciterId: currentReciter.id,
      reciterName: currentReciter.name,
      streamUrl: data.surahAudioUrl,
      totalAyahs: surahData.ayahs.length,
      startSeconds: 0,
    });
  };

  // Seek directly to a specific ayah's verified timestamp inside the full-surah recording
  const handlePlayFromAyah = (idx) => {
    if (!surahData || !data?.surahAudioUrl || !timingAvailable || !timingData?.segments) {
      return;
    }
    const segment = timingData.segments[idx];
    if (!segment) return;

    if (isPlayingThisSurah && activePlayingIndex === idx) {
      togglePlayPause();
      return;
    }

    const startSeconds = segment.startTimeMs / 1000;
    if (isSameStreamLoaded) {
      seekAndPlaySurahStream(startSeconds);
      return;
    }

    playSurahStream({
      surahNumber: surahData.number,
      surahName: stripSurahPrefix(surahData.name),
      reciterId: currentReciter.id,
      reciterName: currentReciter.name,
      streamUrl: data.surahAudioUrl,
      totalAyahs: surahData.ayahs.length,
      startSeconds,
    });
  };

  const handleReciterChange = (nextReciterId) => {
    setReciter(nextReciterId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 py-2" aria-label="جاري تحميل السورة">
        <div className="h-44 rounded-[28px] recessed-box animate-pulse" />
        <div className="h-[460px] rounded-[22px] recessed-box animate-pulse" />
      </div>
    );
  }

  if (error || !surahData) {
    return (
      <ErrorState
        title="تعذر تحميل السورة"
        message="حدث خطأ أثناء جلب نص السورة أو التفسير من المصدر، يرجى المحاولة مرة أخرى."
        onRetry={() => refetch()}
      />
    );
  }

  const activeAyah = surahData.ayahs[selectedAyahIndex] || surahData.ayahs[0];
  const activeAyahClean = stripBismillah(
    activeAyah.text,
    surahData.number,
    selectedAyahIndex === 0
  );
  const activeTafsirText =
    tafsirData?.ayahs?.[selectedAyahIndex]?.text ||
    'التفسير الميسر غير متوفر حالياً لهذه الآية.';

  const activePageNum = selectedPage || pageNumbers[0] || 1;
  const activeJuz = activeAyah?.juz || 1;

  return (
    <div className="flex flex-col gap-5 font-tajawal" dir="rtl">
      <SurahHeader
        surah={surahData}
        activeJuz={activeJuz}
        activeViewMode={readingViewMode}
        onChangeViewMode={setReadingViewMode}
        totalAyahs={surahData.ayahs.length}
        selectedAyahIndex={selectedAyahIndex}
        onJumpToAyah={(idx) => {
          setSelectedAyahIndex(idx);
          const p = surahData.ayahs[idx]?.page;
          if (p) setSelectedPage(p);
        }}
        isSurahPlaying={isPlayingThisSurah}
        onTogglePlaySurah={handleToggleSurahPlayback}
        studyOpen={studySidebarOpen || studyDrawerOpen}
        onToggleStudy={() => {
          if (window.innerWidth >= 1280) {
            setStudySidebarOpen((prev) => !prev);
          } else {
            setStudyDrawerOpen((prev) => !prev);
          }
        }}
        onOpenSettings={() => setSettingsDrawerOpen(true)}
        reciterName={currentReciter.name}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className={studySidebarOpen ? 'xl:col-span-8' : 'xl:col-span-12'}>
          <MushafReader
            surah={surahData}
            tafsirAyahs={tafsirData?.ayahs}
            viewMode={readingViewMode}
            timingAvailable={timingAvailable}
            selectedAyahIndex={selectedAyahIndex}
            activePlayingIndex={activePlayingIndex}
            isSurahPlaying={isPlayingThisSurah}
            onSelectAyah={(idx) => {
              setSelectedAyahIndex(idx);
              const ayahObj = surahData.ayahs[idx];
              if (ayahObj) {
                recordReadingPosition({
                  surahNumber: surahData.number,
                  surahName: stripSurahPrefix(surahData.name),
                  ayahNumber: ayahObj.numberInSurah,
                  ayahIndex: idx,
                  reciterId,
                  updatedAt: new Date().toISOString(),
                });
              }
            }}
            onPlayAyah={handlePlayFromAyah}
            onOpenStudyForAyah={(idx) => {
              setSelectedAyahIndex(idx);
              if (window.innerWidth >= 1280) {
                setStudySidebarOpen(true);
              } else {
                setStudyDrawerOpen(true);
              }
            }}
            onEnqueueAyah={() => {
              if (!data?.surahAudioUrl) return;
              const cleanSurahName = stripSurahPrefix(surahData.name);
              enqueueTrack({
                id: `surah-${surahData.number}-${currentReciter.id}`,
                label: `سورة ${cleanSurahName} (تلاوة كاملة)`,
                subtitle: currentReciter.name,
                source: {
                  kind: 'surah-stream',
                  surahNumber: surahData.number,
                  surahName: cleanSurahName,
                  reciterId: currentReciter.id,
                  reciterName: currentReciter.name,
                  streamUrl: data.surahAudioUrl,
                  totalAyahs: surahData.ayahs.length,
                },
              });
            }}
            isBookmarked={(ayahNum) =>
              bookmarks.some(
                (b) =>
                  Number(b.surah_id) === Number(surahData.number) &&
                  Number(b.ayah_num) === Number(ayahNum)
              )
            }
            onToggleBookmark={(ayah, cleanText) =>
              toggleBookmark({
                surah_id: surahData.number,
                surah_name: stripSurahPrefix(surahData.name),
                ayah_num: ayah.numberInSurah,
                ayah_text: cleanText,
                saved_at: new Date().toISOString(),
              })
            }
            pageNumbers={pageNumbers}
            activePage={activePageNum}
            onChangePage={(p) => {
              setSelectedPage(p);
              const firstOnPageIdx = surahData.ayahs.findIndex((a) => (a.page || 1) === p);
              if (firstOnPageIdx >= 0) {
                setSelectedAyahIndex(firstOnPageIdx);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            activeAyahRef={activeAyahRef}
          />
        </div>

        {/* Desktop Optional Study Mode Column */}
        {studySidebarOpen && (
          <aside className="hidden xl:block xl:col-span-4 xl:sticky xl:top-4 bento-stage p-4">
            <StudyPanelsContent
              surahNumber={surahData.number}
              surahName={surahData.name}
              ayahNumber={activeAyah.numberInSurah}
              ayahText={activeAyahClean}
              tafsirText={activeTafsirText}
              currentReciterId={reciterId}
              onSelectReciter={handleReciterChange}
            />
          </aside>
        )}
      </div>

      {/* Responsive Study Mode Drawer (Tablet/Mobile or fallback trigger) */}
      <StudyPanelsDrawer
        open={studyDrawerOpen}
        onClose={() => setStudyDrawerOpen(false)}
        surahNumber={surahData.number}
        surahName={surahData.name}
        ayahNumber={activeAyah.numberInSurah}
        ayahText={activeAyahClean}
        tafsirText={activeTafsirText}
        currentReciterId={reciterId}
        onSelectReciter={handleReciterChange}
      />
    </div>
  );
};

export default Surah;
