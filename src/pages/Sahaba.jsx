import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpLeft, Search, Users, X } from 'lucide-react';
import { sahabaData } from '../lib/data/sahabaData';
import { matchesNormalized } from '../lib/arabicSearch';
import { SectionHeader } from '../components/ui/Primitives';
import { EmptyState } from '../components/ui/StateViews';

const Sahaba = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return sahabaData;
    return sahabaData.filter(
      (s) =>
        matchesNormalized(s.name, query) ||
        matchesNormalized(s.title, query) ||
        s.slides.some((sl) => matchesNormalized(sl.text, query))
    );
  }, [query]);

  return (
    <div className="bento-stage p-5 sm:p-8 font-tajawal flex flex-col gap-6" dir="rtl">
      <SectionHeader
        eyebrow="القدوة والسير العطرة"
        title="قصص الصحابة"
        description="نجوم اهتدى بها السالكون، استمدوا نورهم من النبوة الخاتمة. اكتشف مواقفهم الخالدة عبر شرائح تفاعلية."
      />

      <div className="recessed-well px-4 py-2.5 flex items-center gap-2.5 max-w-md">
        <Search size={16} className="text-glow shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن صحابي أو موقف..."
          aria-label="ابحث في قصص الصحابة"
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={22} />}
          title="لا توجد سير مطابقة لبحثك"
          description="جرب البحث باسم صحابي آخر مثل أبو بكر، عمر، خالد بن الوليد."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((sahabi, index) => (
            <Link key={sahabi.id} to={`/sahaba/${sahabi.id}`} className="group">
              <div className="tactile-card p-6 h-full min-h-[210px] flex flex-col justify-between gap-5 group-hover:-translate-y-0.5 group-hover:border-glow-border">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl recessed-box flex items-center justify-center font-mono font-bold text-sm text-ink-secondary group-hover:text-glow">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-muted group-hover:text-glow">
                    <ArrowUpLeft size={15} />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-black font-cairo text-ink mb-1.5">
                    {sahabi.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                    {sahabi.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sahaba;
