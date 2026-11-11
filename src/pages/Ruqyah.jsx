import React, { useState, useEffect } from 'react';
import { Shield, Sun, RotateCcw, Check, Copy } from 'lucide-react';
import { ruqyahText, morningAdhkar, eveningAdhkar } from '../lib/data/ruqyahData';
import { SegmentedTabs, SectionHeader } from '../components/ui/Primitives';
import { toArabicDigits } from '../lib/arabicSearch';

const AdhkarList = ({ adhkars, counts, onIncrement, onResetOne }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.text);
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Ignore clipboard error
    }
  };

  return (
    <div className="space-y-4">
      {adhkars.map((dhikr) => {
        const target = dhikr.targetCount || 1;
        const current = counts[dhikr.id] || 0;
        const done = current >= target;

        return (
          <div
            key={dhikr.id}
            className={`tactile-card p-5 flex flex-col gap-4 transition-all ${
              done ? 'active-ayah-glow' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="recessed-well px-3 py-1 text-xs font-bold text-glow">
                {dhikr.title}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopy(dhikr)}
                  aria-label="نسخ الذكر"
                  title="نسخ"
                  className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow"
                >
                  {copiedId === dhikr.id ? (
                    <Check size={14} className="text-emerald-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
                {current > 0 && (
                  <button
                    type="button"
                    onClick={() => onResetOne(dhikr.id)}
                    aria-label="تصفير العداد"
                    title="تصفير"
                    className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-muted hover:text-ink"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>
            </div>

            <p
              className="font-amiri text-xl sm:text-2xl leading-[2.2] text-right text-ink select-text"
              style={{ wordSpacing: '2px' }}
            >
              {dhikr.text}
            </p>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-xs font-bold text-ink-muted">
                التكرار المطلوب: {toArabicDigits(target)}
              </span>

              <button
                type="button"
                onClick={() => onIncrement(dhikr.id, target)}
                className={`tactile-pill px-4 py-1.5 text-xs font-extrabold flex items-center gap-2 ${
                  done ? 'active-ayah-glow text-glow' : 'text-ink hover:text-glow'
                }`}
              >
                {done ? <Check size={14} /> : null}
                <span>
                  {done
                    ? `مكتمل (${toArabicDigits(target)}/${toArabicDigits(target)})`
                    : `تسبيح (${toArabicDigits(current)}/${toArabicDigits(target)})`}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Ruqyah = () => {
  const [activeTab, setActiveTab] = useState('ruqyah');
  const [counts, setCounts] = useState(() => {
    try {
      const stored = window.localStorage.getItem('yaqeen_ruqyah_counts');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('yaqeen_ruqyah_counts', JSON.stringify(counts));
    } catch {
      // Ignore
    }
  }, [counts]);

  const handleIncrement = (id, target) => {
    setCounts((prev) => {
      const next = Math.min(target, (prev[id] || 0) + 1);
      return { ...prev, [id]: next };
    });
  };

  const handleResetOne = (id) => {
    setCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  return (
    <div className="bento-stage p-5 sm:p-8 font-tajawal flex flex-col gap-6" dir="rtl">
      <SectionHeader
        eyebrow="التحصين والذكر اليومي"
        title="حصن المسلم"
        description="الرقية الشرعية وأذكار الصباح والمساء مع عداد تفاعلي لكل ذكر."
        action={
          <SegmentedTabs
            activeId={activeTab}
            onChange={setActiveTab}
            items={[
              { id: 'ruqyah', label: 'الرقية الشرعية', icon: Shield },
              { id: 'adhkar', label: 'أذكار الصباح والمساء', icon: Sun },
            ]}
          />
        }
      />

      {activeTab === 'ruqyah' ? (
        <AdhkarList
          adhkars={ruqyahText}
          counts={counts}
          onIncrement={handleIncrement}
          onResetOne={handleResetOne}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-extrabold font-cairo text-ink px-1">أذكار الصباح</h2>
            <AdhkarList
              adhkars={morningAdhkar}
              counts={counts}
              onIncrement={handleIncrement}
              onResetOne={handleResetOne}
            />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-extrabold font-cairo text-ink px-1">أذكار المساء</h2>
            <AdhkarList
              adhkars={eveningAdhkar}
              counts={counts}
              onIncrement={handleIncrement}
              onResetOne={handleResetOne}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Ruqyah;
