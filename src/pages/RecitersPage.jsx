import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { recitersData } from '../lib/data/recitersData';
import { useAppStore } from '../store/useAppStore';
import { Mic, Search, ArrowUpLeft } from 'lucide-react';

const CATEGORY_MAP = {
  all: 'all',
  الكل: 'all',
  murattal: 'murattal',
  مرتل: 'murattal',
  mujawwad: 'mujawwad',
  مجود: 'mujawwad',
  rare: 'rare',
  نادر: 'rare',
};

const RecitersPage = () => {
  const { reciter: activeReciter, setReciter } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = CATEGORY_MAP[searchParams.get('category')] || 'all';

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState(initialCategory);

  useEffect(() => {
    const paramCat = CATEGORY_MAP[searchParams.get('category')];
    if (paramCat) {
      setFilterType(paramCat);
    }
  }, [searchParams]);

  const handleFilterChange = (type) => {
    setFilterType(type);
    if (type === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      const label = type === 'rare' ? 'نادر' : type === 'mujawwad' ? 'مجود' : 'مرتل';
      setSearchParams({ category: label });
    }
  };

  const filteredReciters = recitersData.filter((r) => {
    const matchSearch = r.name.includes(search);
    const matchType = filterType === 'all' || r.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-[1440px] mx-auto w-full bento-stage p-5 sm:p-8 font-tajawal flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <span className="text-xs font-bold text-ink-muted block mb-1">
            المكتبة الصوتية · {recitersData.length.toLocaleString('ar-EG')} قارئاً
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-cairo text-ink">
            القراء والتسجيلات
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary mt-1.5">
            اختر قارئك المفضل للانتقال المباشر وتلاوة المصحف بصوته
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="recessed-well p-1.5 flex flex-wrap items-center gap-1.5 self-start">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'murattal', label: 'مرتل' },
            { id: 'mujawwad', label: 'مجود' },
            { id: 'rare', label: 'نادر' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleFilterChange(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filterType === item.id
                  ? 'tactile-pill text-ink'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recessed Search */}
      <div className="recessed-well h-12 px-4 flex items-center gap-3">
        <Search className="text-ink-secondary shrink-0" size={17} />
        <input
          type="text"
          placeholder="ابحث عن قارئ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-sm font-medium text-ink placeholder:text-ink-muted"
          dir="rtl"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReciters.map((r) => {
          const isCurrent = activeReciter === r.id;
          return (
            <div
              key={r.id}
              className={`p-5 rounded-[24px] flex flex-col justify-between gap-5 transition-all ${
                isCurrent ? 'active-ayah-glow' : 'tactile-card'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl recessed-box flex items-center justify-center shrink-0 ${
                      isCurrent ? 'text-glow' : 'text-ink-secondary'
                    }`}
                  >
                    <Mic size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-extrabold text-ink truncate font-cairo">
                      {r.name}
                    </h3>
                    <span className="text-xs text-ink-secondary font-medium">
                      {r.type === 'murattal'
                        ? 'ترتيل'
                        : r.type === 'mujawwad'
                        ? 'تجويد'
                        : 'تسجيلات نادرة'}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <span className="w-2.5 h-2.5 rounded-full amber-glow-dot shrink-0" />
                )}
              </div>

              <Link
                to="/quran"
                onClick={() => setReciter(r.id)}
                className="tactile-pill py-2.5 px-4 text-xs font-bold text-ink hover:text-glow flex items-center justify-between"
              >
                <span>{isCurrent ? 'القارئ النشط · تصفح السور' : 'اختيار القارئ'}</span>
                <ArrowUpLeft size={15} />
              </Link>
            </div>
          );
        })}
      </div>

      {filteredReciters.length === 0 && (
        <div className="recessed-box text-center py-14 text-ink-secondary font-bold">
          لا توجد نتائج مطابقة لبحثك
        </div>
      )}
    </div>
  );
};

export default RecitersPage;
