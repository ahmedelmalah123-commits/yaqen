import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { radioData } from '../lib/data/radioData';
import { Radio as RadioIcon, Play, Pause, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

const Radio = () => {
  const [searchParams] = useSearchParams();
  const audioRef = useRef(null);
  const [playingStationId, setPlayingStationId] = useState(null);
  const [selectedStationId, setSelectedStationId] = useState(null);

  const playStation = useCallback(
    (station) => {
      const audio = audioRef.current;
      if (!audio || !station) return;

      setSelectedStationId(station.id);

      if (playingStationId === station.id) {
        audio.pause();
        setPlayingStationId(null);
        return;
      }

      audio.pause();
      audio.src = station.url;
      audio
        .play()
        .then(() => {
          setPlayingStationId(station.id);
        })
        .catch(() => {
          setPlayingStationId(null);
        });
    },
    [playingStationId]
  );

  // Handle ?station=<id> deep-link from SearchOverlay
  useEffect(() => {
    const stationParam = searchParams.get('station');
    if (!stationParam) return;
    const found = radioData.find((s) => s.id === stationParam);
    if (found && audioRef.current) {
      setSelectedStationId(found.id);
      audioRef.current.pause();
      audioRef.current.src = found.url;
      audioRef.current
        .play()
        .then(() => setPlayingStationId(found.id))
        .catch(() => setPlayingStationId(null));
    }
  }, [searchParams]);

  // Cleanup audio on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  const activeStation = radioData.find(
    (s) => s.id === (playingStationId || selectedStationId)
  );

  return (
    <div className="max-w-[1440px] mx-auto w-full bento-stage p-5 sm:p-8 font-tajawal flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-ink-muted flex items-center gap-1.5 mb-1">
            <Waves size={14} className="text-glow" />
            بث مباشر على مدار الساعة
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-cairo text-ink">
            إذاعة القرآن الكريم
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary mt-1.5">
            استمع إلى أشهر الإذاعات القرآنية والمختارات المباركة مباشرة
          </p>
        </div>

        {activeStation && (
          <div className="recessed-well px-4 py-2 flex items-center gap-2.5 self-start sm:self-auto">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                playingStationId ? 'amber-glow-dot animate-pulse' : 'bg-ink-muted'
              }`}
            />
            <span className="text-xs font-bold text-ink truncate max-w-[220px]">
              {playingStationId ? `يبث الآن: ${activeStation.name}` : `محدد: ${activeStation.name}`}
            </span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {radioData.map((station, index) => {
          const isCurrentPlaying = playingStationId === station.id;
          const isSelected = selectedStationId === station.id;

          return (
            <motion.button
              type="button"
              key={station.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => playStation(station)}
              className={`text-right p-5 sm:p-6 rounded-[24px] flex items-center justify-between gap-4 transition-all group ${
                isCurrentPlaying || isSelected ? 'active-ayah-glow' : 'tactile-card'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl recessed-box flex items-center justify-center shrink-0 ${
                    isCurrentPlaying ? 'text-glow' : 'text-ink-secondary'
                  }`}
                >
                  <RadioIcon size={20} />
                </div>

                <div className="min-w-0">
                  <span className="recessed-well px-2.5 py-0.5 text-[11px] font-bold text-ink-secondary inline-block mb-1.5">
                    {station.type}
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold font-cairo text-ink truncate">
                    {station.name}
                  </h3>
                </div>
              </div>

              <div
                className={`w-12 h-12 rounded-full tactile-pill flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                  isCurrentPlaying ? 'text-glow border-glow-border' : 'text-ink'
                }`}
              >
                {isCurrentPlaying ? (
                  <Pause fill="currentColor" size={18} />
                ) : (
                  <Play fill="currentColor" size={18} className="ml-0.5" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <audio
        ref={audioRef}
        onEnded={() => setPlayingStationId(null)}
        onError={() => setPlayingStationId(null)}
      />
    </div>
  );
};

export default Radio;
