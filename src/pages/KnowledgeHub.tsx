import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Landmark,
  Users,
  Sparkles,
  ShieldCheck,
  ArrowUpLeft,
  Search,
  ChevronLeft,
} from 'lucide-react';
import { SectionHeader, SegmentedTabs } from '../components/ui/Primitives';
import { quranStoriesData, QuranStoryEpisode } from '../lib/data/quranStoriesData';
import { seerahData } from '../lib/data/seerahData';
import { sahabaData } from '../lib/data/sahabaData';
import { normalizeArabic, toArabicDigits } from '../lib/arabicSearch';

interface HubSection {
  id: string;
  title: string;
  subtitle: string;
  count: string;
  desc: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tag: string;
}

export const KnowledgeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = normalizeArabic(searchQuery.trim());

  const filteredStories = quranStoriesData.filter((item: QuranStoryEpisode) =>
    normalizedQuery
      ? normalizeArabic(item.title).includes(normalizedQuery) ||
        normalizeArabic(item.categoryLabel).includes(normalizedQuery)
      : true
  );

  const filteredSahaba = sahabaData.filter((item: (typeof sahabaData)[number]) =>
    normalizedQuery
      ? normalizeArabic(item.name).includes(normalizedQuery) ||
        normalizeArabic(item.title).includes(normalizedQuery)
      : true
  );

  const filteredSeerah = seerahData.filter((item: (typeof seerahData)[number]) =>
    normalizedQuery
      ? normalizeArabic(item.title).includes(normalizedQuery) ||
        normalizeArabic(item.phase).includes(normalizedQuery)
      : true
  );

  return (
    <div className="flex flex-col gap-6 font-tajawal text-ink" dir="rtl">
      {/* Hero Header */}
      <section className="bento-stage p-6 sm:p-8 flex flex-col gap-5">
        <SectionHeader
          eyebrow="بوابات العلم والتزكية"
          title="واحة المعرفة الإسلامية والقصص"
          description="وجهة موحدة تجمع قصص القرآن الكريم، محطات السيرة النبوية الشريفة، سير الصحابة الأطهار، معالجة ضعف اليقين، وحصن المسلم."
          action={
            <div className="flex items-center gap-2">
              <Link
                to="/stories"
                className="tactile-pill px-4 py-2 text-xs font-bold text-ink hover:text-glow flex items-center gap-1.5"
              >
                <Film size={14} className="text-glow" />
                <span>قصص القرآن</span>
              </Link>
              <Link
                to="/seerah"
                className="tactile-pill px-4 py-2 text-xs font-bold text-ink hover:text-glow flex items-center gap-1.5"
              >
                <Landmark size={14} className="text-glow" />
                <span>السيرة النبوية</span>
              </Link>
            </div>
          }
        />

        {/* Search Bar within Hub */}
        <div className="recessed-well p-2.5 sm:p-3 flex items-center gap-3">
          <Search size={18} className="text-glow shrink-0 mr-1" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في القصص، شخصيات الصحابة، محطات السيرة..."
            className="flex-1 bg-transparent border-0 outline-none text-sm text-ink placeholder:text-ink-muted"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-ink-muted hover:text-ink px-2"
            >
              مسح
            </button>
          )}
        </div>

        {/* Tab Selector */}
        <SegmentedTabs
          activeId={activeTab}
          onChange={setActiveTab}
          items={[
            { id: 'all', label: 'كافة الأقسام' },
            { id: 'stories', label: 'قصص القرآن' },
            { id: 'seerah', label: 'السيرة النبوية' },
            { id: 'sahaba', label: 'سير الصحابة' },
            { id: 'yaqeen-ruqyah', label: 'اليقين والأذكار' },
          ]}
        />
      </section>

      {/* Main Categories Cards Grid */}
      {(activeTab === 'all' || activeTab === 'stories') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black font-cairo text-ink flex items-center gap-2">
                <Film size={20} className="text-glow" />
                <span>قصص الإنسان والنساء والحيوان في القرآن</span>
              </h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                {toArabicDigits(quranStoriesData.length)} حلقة موثقة من التنزيل الحكيم
              </p>
            </div>
            <Link
              to="/stories"
              className="tactile-pill px-3.5 py-1.5 text-xs font-bold text-glow flex items-center gap-1"
            >
              <span>مشاهدة الكل</span>
              <ChevronLeft size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredStories.slice(0, 6).map((episode: QuranStoryEpisode) => (
              <Link
                key={episode.id}
                to={`/stories?episode=${episode.id}`}
                className="tactile-card p-4 flex flex-col justify-between gap-3 group hover:-translate-y-0.5 hover:border-glow-border transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="recessed-well px-2.5 py-1 text-[11px] font-bold text-glow">
                    {episode.categoryLabel} · حلقة {toArabicDigits(episode.episodeNumber)}
                  </span>
                  <span className="text-[11px] text-ink-muted">{episode.duration}</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold font-cairo text-ink group-hover:text-glow line-clamp-2">
                    {episode.title}
                  </h3>
                </div>
                <div className="pt-2 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs text-ink-secondary">
                  <span>مشاهدة الحلقة</span>
                  <ArrowUpLeft size={14} className="text-ink-muted group-hover:text-glow" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Seerah Section */}
      {(activeTab === 'all' || activeTab === 'seerah') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black font-cairo text-ink flex items-center gap-2">
                <Landmark size={20} className="text-glow" />
                <span>محطات السيرة النبوية الشريفة</span>
              </h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                تتبع مسيرة الحبيب المصطفى ﷺ موثقة بالتواريخ والصور
              </p>
            </div>
            <Link
              to="/seerah"
              className="tactile-pill px-3.5 py-1.5 text-xs font-bold text-glow flex items-center gap-1"
            >
              <span>استكشف السيرة كاملة</span>
              <ChevronLeft size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSeerah.slice(0, 3).map((station: (typeof seerahData)[number]) => (
              <Link
                key={station.id}
                to="/seerah"
                className="tactile-card p-4 flex flex-col justify-between gap-3 group hover:-translate-y-0.5 hover:border-glow-border transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="recessed-well px-2.5 py-1 font-bold text-glow">
                    {station.phase}
                  </span>
                  <span className="text-ink-muted text-[11px]">{station.year}</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold font-cairo text-ink group-hover:text-glow">
                    {station.title}
                  </h3>
                  <p className="text-xs text-ink-secondary mt-1.5 line-clamp-3 leading-relaxed">
                    {station.content[0]}
                  </p>
                </div>
                <div className="pt-2 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs text-ink-secondary">
                  <span>قراءة المحطة</span>
                  <ArrowUpLeft size={14} className="text-ink-muted group-hover:text-glow" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sahaba Section */}
      {(activeTab === 'all' || activeTab === 'sahaba') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black font-cairo text-ink flex items-center gap-2">
                <Users size={20} className="text-glow" />
                <span>سير الصحابة الكرام رضي الله عنهم</span>
              </h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                مواقف خالدة وعِبر حية من حياة الرعيل الأول
              </p>
            </div>
            <Link
              to="/sahaba"
              className="tactile-pill px-3.5 py-1.5 text-xs font-bold text-glow flex items-center gap-1"
            >
              <span>استعرض كافة الصحابة</span>
              <ChevronLeft size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSahaba.slice(0, 3).map((companion: (typeof sahabaData)[number]) => (
              <Link
                key={companion.id}
                to={`/sahaba/${companion.id}`}
                className="tactile-card p-4 flex flex-col justify-between gap-3 group hover:-translate-y-0.5 hover:border-glow-border transition-all"
              >
                <div>
                  <span className="recessed-well px-2.5 py-1 text-[11px] font-bold text-glow block w-fit mb-2">
                    صحابي جليل
                  </span>
                  <h3 className="text-base font-extrabold font-cairo text-ink group-hover:text-glow">
                    {companion.name}
                  </h3>
                  <p className="text-xs text-ink-secondary mt-1 font-semibold">
                    {companion.title}
                  </p>
                  <p className="text-xs text-ink-muted mt-2 line-clamp-2 leading-relaxed">
                    {companion.slides[0]?.text}
                  </p>
                </div>
                <div className="pt-2 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs text-ink-secondary">
                  <span>سيرة ومواقف {companion.name}</span>
                  <ArrowUpLeft size={14} className="text-ink-muted group-hover:text-glow" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Yaqeen & Ruqyah Section */}
      {(activeTab === 'all' || activeTab === 'yaqeen-ruqyah') && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/yaqeen" className="tactile-card p-5 flex flex-col justify-between gap-4 group hover:-translate-y-0.5 hover:border-glow-border transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl recessed-box flex items-center justify-center text-glow shrink-0">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-base font-extrabold font-cairo text-ink group-hover:text-glow">
                  وضع اليقين والتأمل
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  خلوة هادئة للاستماع والتأمل في آيات الله بلا مشتتات
                </p>
              </div>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              صمم وضع اليقين ليكون ملاذاً روحانياً عندما يعتريك الفتور أو تشتت الذهن، حيث تتوالى الآيات مصحوبة بالتلاوة الخاشعة والتفسير.
            </p>
            <div className="pt-2 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs font-bold text-glow">
              <span>الدخول إلى وضع اليقين</span>
              <ArrowUpLeft size={15} />
            </div>
          </Link>

          <Link to="/ruqyah" className="tactile-card p-5 flex flex-col justify-between gap-4 group hover:-translate-y-0.5 hover:border-glow-border transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl recessed-box flex items-center justify-center text-glow shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-base font-extrabold font-cairo text-ink group-hover:text-glow">
                  حصن المسلم والرقية الشرعية
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  أذكار الصباح والمساء والرقية مع عداد تفاعلي مستمر
                </p>
              </div>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              تحصين يومي من هدي النبوة، يشمل آيات وأدعية الرقية وأذكار اليوم والليلة مع حفظ تقدمك ومرات التسبيح في ذاكرة جهازك.
            </p>
            <div className="pt-2 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs font-bold text-glow">
              <span>فتح حصن المسلم</span>
              <ArrowUpLeft size={15} />
            </div>
          </Link>
        </section>
      )}
    </div>
  );
};

export default KnowledgeHub;
