import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Video, Headphones, Compass } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const FarewellMedia = () => {
  const { theme } = useAppStore();
  const [mode, setMode] = useState('video'); // 'video' or 'audio'
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef(null);

  const videoUrl = "https://youtu.be/lDeF9l_pdcU?si=QkTNzbLNSVKIe4Fo";

  // Pause playback when switching modes
  useEffect(() => {
    setIsPlaying(false);
  }, [mode]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state) => {
    // We only update the progress bar if the user isn't actively seeking
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto mt-16 px-4"
      dir="rtl"
    >
      <div className={`relative overflow-hidden rounded-[2.5rem] p-6 md:p-10 border transition-all duration-500
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-[#022c22]/90 to-[#043e2f]/80 border-primary/30 shadow-[0_0_40px_rgba(2,44,34,0.3)]' 
          : 'bg-gradient-to-br from-[#FAF8F5] to-white border-secondary/15 shadow-xl'
        }
      `}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.04] mix-blend-multiply pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center mb-8">
          <div className={`p-4 rounded-2xl mb-4 ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
            <Compass size={32} />
          </div>
          <h2 className={`text-3xl md:text-4xl font-black font-reem mb-4 ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
            خطبة الوداع ويوم فتح مكة
          </h2>
          <p className={`text-base md:text-lg font-tajawal opacity-80 max-w-2xl ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
            استمع وشاهد أعظم الخطب والمواقف في تاريخ الإسلام، حيث أرسى النبي ﷺ مبادئ الرحمة والمساواة.
          </p>

          {/* Mode Switcher */}
          <div className={`flex p-1.5 mt-8 rounded-2xl border ${theme === 'dark' ? 'bg-black/20 border-primary/20' : 'bg-gray-100 border-gray-200'}`}>
             <button
                onClick={() => setMode('video')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all
                  ${mode === 'video' 
                    ? (theme === 'dark' ? 'bg-primary text-secondary shadow-md' : 'bg-secondary text-white shadow-md')
                    : (theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-secondary/60 hover:text-secondary')
                  }
                `}
             >
                <Video size={18} />
                مشاهدة مرئية
             </button>
             <button
                onClick={() => setMode('audio')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all
                  ${mode === 'audio' 
                    ? (theme === 'dark' ? 'bg-primary text-secondary shadow-md' : 'bg-secondary text-white shadow-md')
                    : (theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-secondary/60 hover:text-secondary')
                  }
                `}
             >
                <Headphones size={18} />
                استماع صوتي
             </button>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
           {/* Video Mode Container */}
           <div className={`transition-all duration-500 ${mode === 'video' ? 'opacity-100 scale-100' : 'hidden opacity-0 scale-95'}`}>
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-[6px] border-black/10 bg-black group">
                {mode === 'video' && !isPlaying && (
                  <div 
                    className="absolute inset-0 cursor-pointer group" 
                    onClick={() => setIsPlaying(true)}
                  >
                    <img 
                      src="https://img.youtube.com/vi/lDeF9l_pdcU/hqdefault.jpg" 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/90 text-secondary rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.6)] backdrop-blur-md transition-transform duration-300 group-hover:scale-110 border-4 border-white/20">
                        <Play size={40} className="ml-2" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                )}
                {mode === 'video' && isPlaying && (
                  <iframe 
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/lDeF9l_pdcU?autoplay=1&rel=0&modestbranding=1&showinfo=0" 
                    title="خطبة الوداع ويوم فتح مكة" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen>
                  </iframe>
                )}
              </div>
           </div>

           {/* Audio Mode Container */}
           <div className={`transition-all duration-500 ${mode === 'audio' ? 'block' : 'hidden'}`}>
             <div className={`p-8 md:p-12 rounded-[2.5rem] flex flex-col items-center gap-8 shadow-xl border
               ${theme === 'dark' ? 'bg-black/30 border-white/5' : 'bg-white/80 border-black/5 backdrop-blur-md'}
             `}>
                
                {/* Hidden YouTube Player for Audio Extraction */}
                {mode === 'audio' && (
                  <div className="fixed top-[-9999px] left-[-9999px] w-[200px] h-[200px]">
                    <ReactPlayer
                      ref={playerRef}
                      url={videoUrl}
                      width="100%"
                      height="100%"
                      playing={isPlaying}
                      volume={isMuted ? 0 : 1}
                      onProgress={handleProgress}
                      onDuration={handleDuration}
                      onEnded={() => setIsPlaying(false)}
                      config={{
                        youtube: {
                          playerVars: { modestbranding: 1, playsinline: 1 }
                        }
                      }}
                    />
                  </div>
                )}

                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-inner relative
                  ${theme === 'dark' ? 'bg-white/5 text-primary' : 'bg-black/5 text-secondary'}
                `}>
                  <div className="absolute inset-0 rounded-full border border-dashed border-current opacity-30 animate-spin-slow" style={{ animationDuration: '8s' }}></div>
                  <Headphones size={48} className={isPlaying ? 'animate-pulse' : 'opacity-70'} />
                </div>

                {/* Progress Bar & Timers */}
                <div className="w-full max-w-xl flex items-center gap-4 text-sm md:text-base font-tajawal font-bold" dir="ltr">
                  <span className={theme === 'dark' ? 'text-white/60' : 'text-black/60'}>
                    {formatTime(played * duration)}
                  </span>
                  
                  <div className="relative w-full h-2 bg-gray-300/30 rounded-lg flex-1">
                    {/* Fill portion */}
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-lg ${theme === 'dark' ? 'bg-primary' : 'bg-secondary'}`}
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
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  <span className={theme === 'dark' ? 'text-white/60' : 'text-black/60'}>
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-8 md:gap-12 mt-2">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full transition-all 
                      ${theme === 'dark' 
                        ? 'text-white/60 hover:text-white hover:bg-white/10' 
                        : 'text-black/60 hover:text-black hover:bg-black/5'
                      }
                      ${isMuted ? 'text-red-500' : ''}
                    `}
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>

                  <button 
                    onClick={handlePlayPause}
                    className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 active:scale-95
                      ${theme === 'dark' ? 'bg-primary text-secondary shadow-[0_0_30px_rgba(212,175,55,0.2)]' : 'bg-secondary text-white'}
                    `}
                  >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-2" fill="currentColor" />}
                  </button>

                  {/* Empty div for visual balance */}
                  <div className="w-[48px]" />
                </div>
             </div>
           </div>

        </div>
      </div>
    </motion.div>
  );
};

export default FarewellMedia;
