import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Video,
  Headphones,
} from 'lucide-react';

const FarewellMedia = () => {
  const [mode, setMode] = useState('video'); // 'video' or 'audio'
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef(null);

  const videoUrl = 'https://youtu.be/lDeF9l_pdcU?si=QkTNzbLNSVKIe4Fo';

  useEffect(() => {
    setIsPlaying(false);
  }, [mode]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleProgress = (state) => {
    if (!playerRef.current?.isSeeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (dur) => {
    setDuration(dur);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    if (playerRef.current) {
      playerRef.current.isSeeking = false;
      playerRef.current.seekTo(parseFloat(e.target.value));
    }
  };

  const handleSeekMouseDown = () => {
    if (playerRef.current) {
      playerRef.current.isSeeking = true;
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return '00:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <section className="tactile-card p-5 sm:p-6 flex flex-col gap-4" dir="rtl">
      <div>
        <span className="text-[11px] font-bold text-ink-muted block">
          مرئيات وصوتيات السيرة
        </span>
        <h2 className="text-lg font-extrabold font-cairo text-ink">
          خطبة الوداع ويوم فتح مكة
        </h2>
        <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
          استمع وشاهد أعظم الخطب والمواقف في تاريخ الإسلام.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="recessed-well p-1 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setMode('video')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-bold text-xs transition-all ${
            mode === 'video' ? 'tactile-pill text-ink' : 'text-ink-secondary hover:text-ink'
          }`}
        >
          <Video size={14} className={mode === 'video' ? 'text-glow' : ''} />
          <span>مشاهدة مرئية</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('audio')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-bold text-xs transition-all ${
            mode === 'audio' ? 'tactile-pill text-ink' : 'text-ink-secondary hover:text-ink'
          }`}
        >
          <Headphones size={14} className={mode === 'audio' ? 'text-glow' : ''} />
          <span>استماع صوتي</span>
        </button>
      </div>

      {/* Always-mounted background ReactPlayer for audio mode */}
      <div className="fixed top-0 left-0 w-[200px] h-[200px] opacity-[0.01] pointer-events-none z-[-1]">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={mode === 'audio' && isPlaying}
          volume={isMuted ? 0 : 1}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={() => setIsPlaying(false)}
          config={{
            youtube: {
              playerVars: { modestbranding: 1, playsinline: 1 },
            },
          }}
        />
      </div>

      {/* Video Mode */}
      {mode === 'video' && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden recessed-box">
          {!isPlaying ? (
            <div
              className="absolute inset-0 cursor-pointer group"
              onClick={() => setIsPlaying(true)}
            >
              <img
                src="https://img.youtube.com/vi/lDeF9l_pdcU/hqdefault.jpg"
                alt="خطبة الوداع ويوم فتح مكة"
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <div className="w-14 h-14 rounded-full tactile-pill flex items-center justify-center text-glow group-hover:scale-110 transition-transform">
                  <Play size={24} className="ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
          ) : (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/lDeF9l_pdcU?autoplay=1&rel=0&modestbranding=1&showinfo=0"
              title="خطبة الوداع ويوم فتح مكة"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      )}

      {/* Audio Mode */}
      {mode === 'audio' && (
        <div className="recessed-box p-4 flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full gap-3">
            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              className={`w-10 h-10 rounded-full tactile-pill flex items-center justify-center ${
                isMuted ? 'text-red-500' : 'text-ink-secondary hover:text-ink'
              }`}
              title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <button
              type="button"
              onClick={handlePlayPause}
              className={`w-14 h-14 rounded-full tactile-pill flex items-center justify-center ${
                isPlaying ? 'active-ayah-glow text-glow' : 'text-ink hover:text-glow'
              }`}
            >
              {isPlaying ? (
                <Pause size={22} fill="currentColor" />
              ) : (
                <Play size={22} className="ml-0.5" fill="currentColor" />
              )}
            </button>

            <div className="w-10 h-10 rounded-full recessed-well flex items-center justify-center text-ink-muted">
              <Headphones size={16} className={isPlaying ? 'text-glow animate-pulse' : ''} />
            </div>
          </div>

          <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-ink-secondary" dir="ltr">
            <span>{formatTime(played * duration)}</span>
            <div className="relative flex-1 h-2.5 recessed-well overflow-hidden p-0.5">
              <div
                className="h-full rounded-full amber-glow-dot"
                style={{ width: `${played * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                onTouchStart={handleSeekMouseDown}
                onTouchEnd={handleSeekMouseUp}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default FarewellMedia;
