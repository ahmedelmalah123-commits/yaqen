import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic2, ArrowUpLeft, Check, X } from 'lucide-react';
import { recitersData, RECITER_GROUP_ORDER, getReciterById } from '../lib/data/recitersData';
import { useAppStore } from '../store/useAppStore';
import { matchesNormalized, toArabicDigits } from '../lib/arabicSearch';
import { SectionHeader } from '../components/ui/Primitives';
import { EmptyState } from '../components/ui/StateViews';

const RecitersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');

  const navigate = useNavigate();
  const currentReciterId = useAppStore((s) => s.reciter);
  const setReciter = useAppStore((s) => s.setReciter);

  const currentReciter = getReciterById(currentReciterId);

  const filtered = useMemo(() => {
    return recitersData.filter((r) => {
      if (activeGroup !== 'all' && r.group !== activeGroup) return false;
      if (!searchQuery.trim()) return true;
      return (
        matchesNormalized(r.name, searchQuery) ||
        matchesNormalized(r.group, searchQuery) ||
        matchesNormalized(r.narration, searchQuery)
      );
    });
  }, [searchQuery, activeGroup]);

  return (
    <div className="bento-stage p-5 sm:p-8 flex flex-col gap-6 font-tajawal" dir="rtl">
      <SectionHeader
        eyebrow="أصوات من نور"
        title="قراء القرآن الكريم"
        description={`اختر القارئ المفضل لاعتماده في المصحف الشريف والمشغل العام (${toArabicDigits(recitersData.length)} قارئاً بتلاوات كاملة متصلة لجميع السور).`}
        action={
          <span className="recessed-well px-4 py-2 text-xs font-bold text-ink flex items-center gap-2">
            <Mic2 size={14} className="text-glow" />
            <span>المعتمد حالياً: {currentReciter.name}</span>
          </span>
        }
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="recessed-well px-4 py-2.5 flex items-center gap-2.5 flex-1 max-w-md">
          <Search size={16} className="text-glow shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم القارئ..."
            aria-label="ابحث باسم القارئ"
            className="flex-1 bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink-muted"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="مسح"
              className="text-ink-muted hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['all', ...RECITER_GROUP_ORDER].map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => setActiveGroup(group)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeGroup === group
                  ? 'tactile-pill active-ayah-glow text-glow'
                  : 'recessed-box text-ink-secondary hover:text-ink'
              }`}
            >
              {group === 'all' ? 'الكل' : group}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Mic2 size={22} />}
          title="لا توجد نتائج مطابقة للبحث"
          description="جرب البحث باسم قارئ آخر أو اعرض جميع الفئات."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((rec) => {
            const isSelected = rec.id === currentReciter.id;
            return (
              <div
                key={rec.id}
                className={`tactile-card p-5 flex flex-col justify-between gap-4 transition-all ${
                  isSelected ? 'active-ayah-glow border-glow-border' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl recessed-box flex items-center justify-center text-glow shrink-0">
                      <Mic2 size={18} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-extrabold font-cairo text-ink truncate">
                        {rec.name}
                      </h2>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        {rec.group} · {rec.narration}
                      </p>
                    </div>
                  </div>
                  <span className="recessed-well px-2.5 py-0.5 text-[10px] font-bold text-ink-muted shrink-0">
                    {rec.timingMoshafId ? 'سورة كاملة · مزامنة' : 'سورة كاملة'}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setReciter(rec.id)}
                    className={`flex-1 tactile-pill py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 ${
                      isSelected ? 'active-ayah-glow text-glow' : 'text-ink hover:text-glow'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    <span>{isSelected ? 'مختار حالياً' : 'اعتماد القارئ'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReciter(rec.id);
                      navigate('/quran');
                    }}
                    className="tactile-pill py-2 px-3 text-xs font-bold text-ink-secondary hover:text-ink flex items-center gap-1"
                  >
                    <span>المصحف</span>
                    <ArrowUpLeft size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecitersPage;
