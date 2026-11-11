import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Radio as RadioIcon, Play, Pause, AlertTriangle, Loader2 } from 'lucide-react';
import { radioData } from '../lib/data/radioData';
import { useAudioStore } from '../store/useAudioStore';
import { SectionHeader } from '../components/ui/Primitives';

const Radio = () => {
  const [searchParams] = useSearchParams();
  const requestedStation = searchParams.get('station');

  const source = useAudioStore((s) => s.source);
  const status = useAudioStore((s) => s.status);
  const playRadio = useAudioStore((s) => s.playRadio);
  const togglePlayPause = useAudioStore((s) => s.togglePlayPause);

  const activeStationId = source?.kind === 'radio' ? source.stationId : null;

  useEffect(() => {
    if (!requestedStation) return;
    const found = radioData.find(
      (s) => s.id === requestedStation && s.status !== 'unavailable'
    );
    if (found && activeStationId !== found.id) {
      playRadio({
        stationId: found.id,
        stationName: found.name,
        stationType: found.type,
        streamUrl: found.url,
      });
    }
  }, [requestedStation, activeStationId, playRadio]);

  const handleStationClick = (station) => {
    if (station.status === 'unavailable') return;
    if (activeStationId === station.id) {
      togglePlayPause();
      return;
    }
    playRadio({
      stationId: station.id,
      stationName: station.name,
      stationType: station.type,
      streamUrl: station.url,
    });
  };

  return (
    <div className="bento-stage p-5 sm:p-8 flex flex-col gap-6 font-tajawal" dir="rtl">
      <SectionHeader
        eyebrow="البث الإذاعي المباشر"
        title="إذاعات القرآن الكريم"
        description="استمع إلى الإذاعات القرآنية المباشرة في الخلفية بشكل متواصل أثناء تنقلك بين صفحات المنصة."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {radioData.map((station) => {
          const isUnavailable = station.status === 'unavailable';
          const isSelected = activeStationId === station.id;
          const isPlaying = isSelected && status === 'playing';
          const isLoading = isSelected && status === 'loading';
          const isErrored = isSelected && status === 'error';

          return (
            <button
              key={station.id}
              type="button"
              disabled={isUnavailable}
              onClick={() => handleStationClick(station)}
              className={`tactile-card p-5 text-right flex items-center justify-between gap-4 transition-all ${
                isUnavailable
                  ? 'opacity-65 cursor-not-allowed'
                  : isSelected
                  ? 'active-ayah-glow border-glow-border'
                  : 'hover:-translate-y-0.5 hover:border-glow-border'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl recessed-box flex items-center justify-center shrink-0 ${
                    isPlaying ? 'text-glow' : 'text-ink-muted'
                  }`}
                >
                  {isUnavailable ? (
                    <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />
                  ) : (
                    <RadioIcon size={20} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="recessed-well px-2.5 py-0.5 text-[10px] font-bold text-ink-secondary">
                      {station.type}
                    </span>
                    {isPlaying && (
                      <span className="text-[10px] font-bold text-glow flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full amber-glow-dot animate-pulse" />
                        يبث الآن
                      </span>
                    )}
                  </div>

                  <h2 className="text-base font-extrabold font-cairo text-ink truncate">
                    {station.name}
                  </h2>

                  {isUnavailable && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 font-semibold">
                      {station.statusNote || 'البث متوقف مؤقتاً من المصدر'}
                    </p>
                  )}

                  {isErrored && (
                    <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 font-semibold">
                      تعذر الاتصال بالبث، اضغط لإعادة المحاولة
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`w-11 h-11 rounded-full tactile-pill flex items-center justify-center shrink-0 ${
                  isUnavailable
                    ? 'text-ink-muted'
                    : isPlaying
                    ? 'active-ayah-glow text-glow'
                    : 'text-ink'
                }`}
              >
                {isLoading ? (
                  <Loader2 size={17} className="animate-spin text-glow" />
                ) : isPlaying ? (
                  <Pause size={17} fill="currentColor" />
                ) : (
                  <Play size={17} fill="currentColor" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Radio;
