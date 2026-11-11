import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Mic2,
  Radio,
  ShieldCheck,
  Sparkles,
  Landmark,
  Users,
  Film,
  Bookmark,
  Play,
  Pause,
  ArrowUpLeft,
  Headphones,
  Download,
  BookOpenText,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { fetchDailyAyah } from '../features/quran/quranApi';
import { recitersData } from '../lib/data/recitersData';
import { radioData } from '../lib/data/radioData';
import { useAudioStore } from '../store/useAudioStore';
import { useAppStore } from '../store/useAppStore';
import { usePwaInstall } from '../lib/usePwaInstall';
import { stripSurahPrefix, toArabicDigits } from '../lib/arabicSearch';
import SeasonalWidget from '../components/SeasonalWidget';
import PwaInstallModal from '../components/pwa/PwaInstallModal';

const FarewellMedia = lazy(() => import('../components/FarewellMedia'));

export const Home = () => {
  const audioSource = useAudioStore((s) => s.source);
  const audioStatus = useAudioStore((s) => s.status);
  const playSurahStream = useAudioStore((s) => s.playSurahStream);
  const playRadioStation = useAudioStore((s) => s.playRadioStation);
  const togglePlayPause = useAudioStore((s) => s.togglePlayPause);
  const lastSession = useAudioStore((s) => s.lastSession);
  const savedPlayback = useAudioStore((s) => s.savedPlayback);
  const setBookmarksDrawerOpen = useAppStore((s) => s.setBookmarksDrawerOpen);

  const {
    platform,
    isStandalone,
    canInstallNatively,
    canShowInstallAction,
    isInstallModalOpen,
    triggerNativeInstall,
    openInstallGuide,
    closeInstallGuide,
  } = usePwaInstall();

  const { data: dailyAyah, isLoading } = useQuery({
    queryKey: ['daily-ayah'],
    queryFn: fetchDailyAyah,
    staleTime: 1000 * 60 * 60 * 6,
  });

  const canPlayDailyClip = Boolean(
    dailyAyah?.surahAudioUrl &&
      dailyAyah.startTimeSeconds !== null &&
      dailyAyah.endTimeSeconds !== null
  );

  const isDailyAyahPlaying =
    dailyAyah &&
    audioSource?.kind === 'surah-stream' &&
    audioSource.surahNumber === dailyAyah.surah.number &&
    audioSource.clipAyahNumber === dailyAyah.numberInSurah &&
    (audioStatus === 'playing' || audioStatus === 'loading');

  const handleToggleDailyAyah = () => {
    if (!dailyAyah || !canPlayDailyClip) return;
    if (
      audioSource?.kind === 'surah-stream' &&
      audioSource.surahNumber === dailyAyah.surah.number &&
      audioSource.clipAyahNumber === dailyAyah.numberInSurah
    ) {
      togglePlayPause();
      return;
    }

    playSurahStream({
      surahNumber: dailyAyah.surah.number,
      surahName: stripSurahPrefix(dailyAyah.surah.name),
      reciterId: 'ar.alafasy',
      reciterName: 'مشاري العفاسي',
      streamUrl: dailyAyah.surahAudioUrl,
      totalAyahs: dailyAyah.surah.numberOfAyahs || 0,
      startSeconds: dailyAyah.startTimeSeconds,
      clipAyahNumber: dailyAyah.numberInSurah,
      clipStartSeconds: dailyAyah.startTimeSeconds,
      clipEndSeconds: dailyAyah.endTimeSeconds,
    });
  };

  const handleResumeAudio = () => {
    if (!savedPlayback) return;
    playSurahStream({
      surahNumber: savedPlayback.surahNumber,
      surahName: stripSurahPrefix(savedPlayback.surahName),
      reciterId: savedPlayback.reciterId,
      reciterName: savedPlayback.reciterName,
      streamUrl: `https://cdn.mp3quran.net/audio/mishary-alafasy/r1/${String(savedPlayback.surahNumber).padStart(3, '0')}.mp3`,
      totalAyahs: 114,
      startSeconds: savedPlayback.currentTime,
    });
  };

  const activeRadioCount = radioData.filter((r) => r.status === 'active').length;

  return (
    <div className="flex flex-col gap-6 font-tajawal text-ink" dir="rtl">
      {/* Brand & Introduction Bar */}
      <section className="bento-stage p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 min-w-0">
          <div className="shrink-0 flex items-center">
            <img
              src="/logo-wide.png"
              alt="يقين | قرآن كريم"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain dark:brightness-100 brightness-0 transition-all select-none"
            />
          </div>
          <div className="min-w-0 sm:border-r sm:border-[var(--border-tactile)] sm:pr-5">
            <h1 className="text-sm sm:text-base font-bold font-cairo text-ink leading-tight">
              ملاذك القرآني الهادئ
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1 leading-relaxed">
              المصحف الشريف بالرسم العثماني · تلاوات كاملة وإذاعات مباشرة · واحة السيرة والمعرفة
            </p>
          </div>
        </div>

        {canShowInstallAction && (
          <button
            type="button"
            onClick={openInstallGuide}
            className="tactile-pill px-4 py-2 text-xs font-bold text-glow hover:text-glow flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <Download size={14} className="text-glow" />
            <span>تثبيت تطبيق يقين</span>
          </button>
        )}
      </section>

      {/* Continue Listening Bar (متابعة الاستماع والتلاوة) */}
      {savedPlayback && (
        <section aria-label="متابعة الاستماع" className="bento-stage p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/25">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl tactile-pill flex items-center justify-center text-glow shrink-0 overflow-hidden shadow-sm">
              <img src="/audio-artwork-96.png" alt="شعار يقين الصوتي" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>متابعة الاستماع من آخر موضع توقفت عنده</span>
              </span>
              <h3 className="text-sm sm:text-base font-black font-cairo text-ink truncate">
                سورة {stripSurahPrefix(savedPlayback.surahName)} — القارئ {savedPlayback.reciterName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleResumeAudio}
              className="tactile-pill active-ayah-glow px-4 py-2.5 text-xs font-black text-glow flex items-center gap-2 hover:scale-102 active:scale-95 transition-all shadow-sm"
            >
              <Play size={13} fill="currentColor" />
              <span>استئناف التلاوة</span>
            </button>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PRIMARY SECTION: QURAN FIRST — THREE CORE GATEWAYS
          1. اقرأ القرآن
          2. استمع للقرآن
          3. استمع إلى المحطات الإذاعية
          ═══════════════════════════════════════════════════════════════════ */}
      <section aria-label="بوابات القرآن الكريم الأساسية" className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[11px] font-bold text-ink-muted block">
              القرآن محور التجربة
            </span>
            <h2 className="text-lg sm:text-xl font-black font-cairo text-ink">
              بوابات التلاوة والاستماع
            </h2>
          </div>
          <span className="recessed-well px-3 py-1 text-[11px] font-bold text-glow hidden sm:inline">
            بلا إعلانات ولا مشتتات
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. اقرأ القرآن */}
          <div className="tactile-card p-5 sm:p-6 flex flex-col justify-between gap-4 border-2 border-transparent hover:border-glow-border transition-all">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl recessed-box flex items-center justify-center text-glow shrink-0">
                  <BookOpen size={24} />
                </div>
                <span className="recessed-well px-2.5 py-1 text-[11px] font-bold text-glow">
                  قراءة وتفسير
                </span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold font-cairo text-ink">
                  اقرأ القرآن الكريم
                </h3>
                <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                  تصفح المصحف بالرسم العثماني الأصيل مع التفسير الميسر لكل آية وحفظ موضع القراءة.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--glass-border-subtle)]">
              {lastSession ? (
                <Link
                  to={`/surah/${lastSession.surahNumber}?ayah=${lastSession.ayahNumber}`}
                  className="tactile-pill active-ayah-glow px-4 py-2.5 text-xs font-extrabold text-glow flex items-center justify-between gap-2"
                >
                  <span className="truncate">
                    متابعة: سورة {lastSession.surahName} ({toArabicDigits(lastSession.ayahNumber)})
                  </span>
                  <ArrowUpLeft size={14} className="shrink-0" />
                </Link>
              ) : (
                <Link
                  to="/quran"
                  className="tactile-pill active-ayah-glow px-4 py-2.5 text-xs font-extrabold text-glow flex items-center justify-between gap-2"
                >
                  <span>فتح المصحف الشريف</span>
                  <ArrowUpLeft size={14} />
                </Link>
              )}

              <div className="flex items-center justify-between text-[11px] text-ink-muted px-1">
                <Link to="/quran" className="hover:text-ink transition-colors font-semibold">
                  فهرس السور (١١٤ سورة)
                </Link>
                <span>·</span>
                <Link to="/quran" className="hover:text-ink transition-colors font-semibold">
                  فهرس الأجزاء (٣٠ جزءاً)
                </Link>
              </div>
            </div>
          </div>

          {/* 2. استمع للقرآن */}
          <div className="tactile-card p-5 sm:p-6 flex flex-col justify-between gap-4 border-2 border-transparent hover:border-glow-border transition-all">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl recessed-box flex items-center justify-center text-glow shrink-0">
                  <Mic2 size={24} />
                </div>
                <span className="recessed-well px-2.5 py-1 text-[11px] font-bold text-glow">
                  {toArabicDigits(recitersData.length)} قارئاً
                </span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold font-cairo text-ink">
                  استمع للقرآن الكريم
                </h3>
                <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                  تلاوات كاملة متصلة ومجودة بأصوات كبار قراء العالم الإسلامي عبر المشغل الصوتي المستمر.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--glass-border-subtle)]">
              {savedPlayback ? (
                <button
                  type="button"
                  onClick={handleResumeAudio}
                  className="tactile-pill active-ayah-glow px-4 py-2.5 text-xs font-extrabold text-glow flex items-center justify-between gap-2 text-right"
                >
                  <span className="truncate">
                    استئناف: سورة {savedPlayback.surahName} ({savedPlayback.reciterName})
                  </span>
                  <Play size={13} fill="currentColor" className="shrink-0" />
                </button>
              ) : (
                <Link
                  to="/reciters"
                  className="tactile-pill px-4 py-2.5 text-xs font-extrabold text-ink hover:text-glow flex items-center justify-between gap-2"
                >
                  <span>استعراض القراء والتلاوات</span>
                  <ArrowUpLeft size={14} />
                </Link>
              )}

              <div className="flex items-center justify-between text-[11px] text-ink-muted px-1">
                <Link to="/reciters" className="hover:text-ink transition-colors font-semibold">
                  العفاسي
                </Link>
                <span>·</span>
                <Link to="/reciters" className="hover:text-ink transition-colors font-semibold">
                  المنشاوي
                </Link>
                <span>·</span>
                <Link to="/reciters" className="hover:text-ink transition-colors font-semibold">
                  عبدالباسط
                </Link>
                <span>·</span>
                <Link to="/reciters" className="hover:text-ink transition-colors font-semibold">
                  الحصري
                </Link>
              </div>
            </div>
          </div>

          {/* 3. استمع إلى المحطات الإذاعية */}
          <div className="tactile-card p-5 sm:p-6 flex flex-col justify-between gap-4 border-2 border-transparent hover:border-glow-border transition-all">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl recessed-box flex items-center justify-center text-glow shrink-0">
                  <Radio size={24} />
                </div>
                <span className="recessed-well px-2.5 py-1 text-[11px] font-bold text-glow flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full amber-glow-dot animate-pulse" />
                  <span>بث مباشر</span>
                </span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold font-cairo text-ink">
                  المحطات الإذاعية
                </h3>
                <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                  بث متواصل لإذاعة القاهرة والرياض وتلاوات خاشعة وإذاعات التفسير على مدار الساعة.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--glass-border-subtle)]">
              <Link
                to="/radio"
                className="tactile-pill px-4 py-2.5 text-xs font-extrabold text-ink hover:text-glow flex items-center justify-between gap-2"
              >
                <span>فتح المحطات الإذاعية ({toArabicDigits(activeRadioCount)})</span>
                <ArrowUpLeft size={14} />
              </Link>

              <div className="flex items-center justify-between text-[11px] text-ink-muted px-1">
                <Link to="/radio" className="hover:text-ink transition-colors font-semibold">
                  إذاعة القاهرة
                </Link>
                <span>·</span>
                <Link to="/radio" className="hover:text-ink transition-colors font-semibold">
                  الإذاعة العامة
                </Link>
                <span>·</span>
                <Link to="/radio" className="hover:text-ink transition-colors font-semibold">
                  تلاوات خاشعة
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECONDARY SECTIONS: DAILY AYAH & COMPLEMENTARY BENTO
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main 8-col Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Daily Ayah Spotlight Card */}
          <section className="tactile-card p-5 sm:p-8 flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <span className="recessed-well px-3.5 py-1 text-[11px] font-bold text-glow">
                آية اليوم للتدبر
              </span>

              {dailyAyah && (
                <Link
                  to={`/surah/${dailyAyah.surah.number}?ayah=${dailyAyah.numberInSurah}`}
                  className="tactile-pill px-3.5 py-1.5 text-xs font-bold text-ink-secondary hover:text-ink flex items-center gap-1.5"
                >
                  <span>
                    سورة {stripSurahPrefix(dailyAyah.surah.name)} · الآية{' '}
                    {toArabicDigits(dailyAyah.numberInSurah)}
                  </span>
                  <ArrowUpLeft size={13} />
                </Link>
              )}
            </div>

            {isLoading || !dailyAyah ? (
              <div className="py-6 flex flex-col items-center gap-3">
                <div className="h-7 w-4/5 rounded-xl recessed-box animate-pulse" />
                <div className="h-7 w-3/5 rounded-xl recessed-box animate-pulse" />
              </div>
            ) : (
              <>
                <p className="font-uthmanic quran-text-render text-2xl sm:text-3xl md:text-4xl leading-[2.2] text-ink text-center py-2 select-text">
                  {dailyAyah.text}
                </p>

                <div className="recessed-well p-2.5 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={!canPlayDailyClip}
                    onClick={handleToggleDailyAyah}
                    className={`tactile-pill px-5 py-2 text-xs font-bold flex items-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed ${
                      isDailyAyahPlaying
                        ? 'active-ayah-glow text-glow'
                        : 'text-ink hover:text-glow'
                    }`}
                  >
                    {isDailyAyahPlaying ? (
                      <Pause size={14} fill="currentColor" />
                    ) : (
                      <Play size={14} fill="currentColor" />
                    )}
                    <span>
                      {!canPlayDailyClip
                        ? 'التلاوة متاحة في المصحف'
                        : isDailyAyahPlaying
                        ? 'إيقاف التلاوة'
                        : 'استمع لمقطع الآية'}
                    </span>
                  </button>

                  <span className="text-[11px] text-ink-muted px-2">
                    بصوت الشيخ مشاري العفاسي · مشغل صوتي دقيق المقطع
                  </span>
                </div>
              </>
            )}
          </section>

          {/* Featured Islamic Knowledge & Stories Hub Gateway */}
          <section className="bento-stage p-5 sm:p-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-ink-muted block">
                  واحة المعرفة المتكاملة
                </span>
                <h2 className="text-xl font-extrabold font-cairo text-ink">
                  القصص والسيرة وعِبر الصحابة
                </h2>
              </div>
              <Link
                to="/knowledge"
                className="tactile-pill px-3.5 py-1.5 text-xs font-bold text-glow flex items-center gap-1"
              >
                <span>دخول الواحة</span>
                <ArrowUpLeft size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Link to="/stories" className="group">
                <div className="tactile-card p-4 h-full flex items-center justify-between gap-3 group-hover:-translate-y-0.5 group-hover:border-glow-border transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl recessed-box flex items-center justify-center text-ink-secondary group-hover:text-glow shrink-0">
                      <Film size={19} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-ink font-cairo">
                        قصص القرآن
                      </h3>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        ٨٨ حلقة موثقة للإنسان والنساء والحيوان
                      </p>
                    </div>
                  </div>
                  <ArrowUpLeft size={15} className="text-ink-muted group-hover:text-glow shrink-0" />
                </div>
              </Link>

              <Link to="/seerah" className="group">
                <div className="tactile-card p-4 h-full flex items-center justify-between gap-3 group-hover:-translate-y-0.5 group-hover:border-glow-border transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl recessed-box flex items-center justify-center text-ink-secondary group-hover:text-glow shrink-0">
                      <Landmark size={19} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-ink font-cairo">
                        السيرة النبوية
                      </h3>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        محطات مضيئة موثقة بالصور من حياة المصطفى ﷺ
                      </p>
                    </div>
                  </div>
                  <ArrowUpLeft size={15} className="text-ink-muted group-hover:text-glow shrink-0" />
                </div>
              </Link>

              <Link to="/sahaba" className="group">
                <div className="tactile-card p-4 h-full flex items-center justify-between gap-3 group-hover:-translate-y-0.5 group-hover:border-glow-border transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl recessed-box flex items-center justify-center text-ink-secondary group-hover:text-glow shrink-0">
                      <Users size={19} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-ink font-cairo">
                        سير الصحابة
                      </h3>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        مواقف وعِبر خالدة من حياة الرعيل الأول
                      </p>
                    </div>
                  </div>
                  <ArrowUpLeft size={15} className="text-ink-muted group-hover:text-glow shrink-0" />
                </div>
              </Link>

              <Link to="/ruqyah" className="group">
                <div className="tactile-card p-4 h-full flex items-center justify-between gap-3 group-hover:-translate-y-0.5 group-hover:border-glow-border transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl recessed-box flex items-center justify-center text-ink-secondary group-hover:text-glow shrink-0">
                      <ShieldCheck size={19} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-ink font-cairo">
                        حصن المسلم والرقية
                      </h3>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        الرقية الشرعية وأذكار الصباح والمساء بذاكرة دائمة
                      </p>
                    </div>
                  </div>
                  <ArrowUpLeft size={15} className="text-ink-muted group-hover:text-glow shrink-0" />
                </div>
              </Link>
            </div>
          </section>

          {/* Secondary Calm Services: وضع اليقين & المحفوظات */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/yaqeen" className="group">
              <div className="tactile-card p-5 flex items-center justify-between gap-3 group-hover:-translate-y-0.5 group-hover:border-glow-border transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl recessed-box flex items-center justify-center text-glow shrink-0">
                    <Sparkles size={22} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-glow block">خلوة تأملية</span>
                    <h3 className="text-base font-extrabold text-ink font-cairo">
                      وضع اليقين
                    </h3>
                    <p className="text-xs text-ink-secondary mt-0.5">
                      تأمل وتثبيت القلب مع الآيات المرتلة بهدوء
                    </p>
                  </div>
                </div>
                <ArrowUpLeft size={16} className="text-ink-muted group-hover:text-glow shrink-0" />
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setBookmarksDrawerOpen(true)}
              className="group text-right"
            >
              <div className="tactile-card p-5 flex items-center justify-between gap-3 group-hover:-translate-y-0.5 group-hover:border-glow-border transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl recessed-box flex items-center justify-center text-ink-secondary group-hover:text-glow shrink-0">
                    <Bookmark size={22} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-ink-muted block">العلامات المرجعية</span>
                    <h3 className="text-base font-extrabold text-ink font-cairo">
                      الآيات المحفوظة
                    </h3>
                    <p className="text-xs text-ink-secondary mt-0.5">
                      سجل آياتك المفضلة للرجوع إليها سريعاً
                    </p>
                  </div>
                </div>
                <ArrowUpLeft size={16} className="text-ink-muted group-hover:text-glow shrink-0" />
              </div>
            </button>
          </section>
        </div>

        {/* 4-col Sidebar Column: Seasonal Widget & Media */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <SeasonalWidget />
          <Suspense
            fallback={<div className="h-64 rounded-[22px] recessed-box animate-pulse" />}
          >
            <FarewellMedia />
          </Suspense>
        </aside>
      </div>

      {/* PWA Install Modal */}
      <PwaInstallModal
        open={isInstallModalOpen}
        onClose={closeInstallGuide}
        platform={platform}
        canInstallNatively={canInstallNatively}
        isStandalone={isStandalone}
        onNativeInstall={triggerNativeInstall}
      />
    </div>
  );
};

export default Home;
