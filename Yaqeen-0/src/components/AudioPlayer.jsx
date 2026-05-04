import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Play, Pause, SkipForward, SkipBack, X, Volume2, Settings, History } from 'lucide-react';
import AudioControls from './AudioControls';
import AdvancedAudioFeatures from './AdvancedAudioFeatures';
import ReciterComparison from './ReciterComparison';

const RECITER_NAMES = {
  'ar.alafasy':            'مشاري العفاسي',
  'ar.abdulbasitmurattal': 'عبدالباسط عبدالصمد (مرتل)',
  'ar.abdulbasitmujawwad': 'عبدالباسط عبدالصمد (مجوّد)',
  'ar.mahermuaiqly':       'ماهر المعيقلي',
  'ar.abdurrahmaansudais': 'عبدالرحمن السديس',
  'ar.saoodshuraym':       'سعود الشريم',
  'ar.minshawi':           'المنشاوي (مرتل)',
  'ar.minshawimujawwad':   'المنشاوي (مجوّد)',
  'ar.husary':             'محمود خليل الحصري (مرتل)',
  'ar.husarymujawwad':     'الحصري (مجوّد)',
  'ar.hudhaify':           'علي الحذيفي',
  'ar.ahmedajamy':         'أحمد العجمي',
  'ar.shaatree':           'أبو بكر الشاطري',
  'ar.muhammadayyoob':     'محمد أيوب',
  'ar.muhammadjibreel':    'محمد جبريل',
  'ar.hanirifai':          'هاني الرفاعي',
  'ar.khalefa':            'خليفة الطنيجي',
  'ar.parhizgar':          'محمد پرهيزگار',
  'ar.hussary_mujawwad_rare': 'الحصري (تسجيلات الإذاعة)',
};

const AudioPlayer = () => {
  const { audioState, setAudioState, theme, playbackRate, loopMode, loopCount } = useAppStore();
  const { isPlaying, surah, ayahs, currentIndex, reciter, isRadio } = audioState;

  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loopIteration, setLoopIteration] = useState(1);

  const ayahsRef    = useRef(ayahs);
  const indexRef    = useRef(currentIndex);
  const playingRef  = useRef(isPlaying);
  const isRadioRef  = useRef(isRadio);

  useEffect(() => { ayahsRef.current   = ayahs;        }, [ayahs]);
  useEffect(() => { indexRef.current   = currentIndex; }, [currentIndex]);
  useEffect(() => { playingRef.current = isPlaying;    }, [isPlaying]);
  useEffect(() => { isRadioRef.current = isRadio;      }, [isRadio]);

  const currentAyah = ayahs[currentIndex];

  const skipTo = useCallback((idx) => {
    const audio = audioRef.current;
    if (!audio) return;
    const ayah = ayahsRef.current[idx];
    if (!ayah) return;

    audio.setAttribute('src', ayah.audio);
    audio.load();
    audio.play().catch(() => {});
    setAudioState({ currentIndex: idx, isPlaying: true });
  }, [setAudioState]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (isRadioRef.current) return;
      
      const next = indexRef.current + 1;
      if (next >= ayahsRef.current.length) {
        if (loopMode === 'surah' && loopIteration < loopCount) {
          setLoopIteration(prev => prev + 1);
          skipTo(0);
        } else {
          setAudioState({ isPlaying: false, currentIndex: 0 });
          setLoopIteration(1);
        }
      } else {
        skipTo(next);
      }
    };

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onMetadata = () => setDuration(audio.duration);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
    };
  }, [skipTo, setAudioState, loopMode, loopCount, loopIteration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAyah) return;

    if (audio.getAttribute('src') !== currentAyah.audio) {
      audio.setAttribute('src', currentAyah.audio);
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentIndex, currentAyah]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  if (!surah || !currentAyah) return null;

  const surahName = surah.name?.replace('سُورَةُ ', '') ?? surah.name;
  const reciterLabel = RECITER_NAMES[reciter] || 'القارئ';

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '00:00';
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={`fixed bottom-32 md:bottom-8 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[500px] z-[60] backdrop-blur-3xl transition-all duration-500 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border overflow-hidden
        ${theme === 'dark'
          ? 'bg-[#0f1c2c]/90 border-[#d6a54a]/30 text-[#FAF8F5]'
          : 'bg-white/90 border-[#0f1c2c]/20 text-[#0f1c2c] shadow-[0_20px_60px_rgba(27,79,59,0.1)]'}
      `}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/5 group cursor-pointer">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        />
        <div 
          className="h-full bg-[#d6a54a] transition-all duration-300 relative"
          style={{ width: `${(progress / (duration || 1)) * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#d6a54a] rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-amiri text-lg md:text-xl font-bold truncate leading-none">
               {isRadio ? surah.name : `سورة ${surahName}`}
               {!isRadio && <span className="text-xs opacity-50 mr-2 font-sans font-normal">({currentIndex + 1}/{ayahs.length})</span>}
            </h4>
            <p className="text-xs opacity-60 truncate mt-1">
              {isRadio ? 'إذاعة القرآن الكريم' : `${reciterLabel} • آية ${currentAyah.numberInSurah}`}
            </p>
          </div>

          {/* Time Display */}
          {!isRadio && (
            <div className="hidden sm:block tabular-nums text-[10px] font-medium opacity-40">
              {formatTime(progress)} / {formatTime(duration)}
            </div>
          )}

          {/* Close/Minimize */}
          <button 
            onClick={() => setAudioState({ isPlaying: false, surah: null })}
            className="p-2 hover:bg-black/5 rounded-full transition-colors opacity-40 hover:opacity-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 md:gap-2">
            <AudioControls />
            <AdvancedAudioFeatures />
          </div>

          <div className="flex items-center gap-3 md:gap-5" dir="ltr">
            {!isRadio && (
              <button 
                onClick={() => skipTo(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="p-2 transition-all hover:scale-110 active:scale-90 disabled:opacity-20"
              >
                <SkipBack size={22} fill="currentColor" />
              </button>
            )}

            <button
              onClick={() => setAudioState({ isPlaying: !isPlaying })}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95
                ${theme === 'dark' ? 'bg-[#d6a54a] text-[#0f1c2c]' : 'bg-[#0f1c2c] text-white'}
              `}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-1" />
              )}
            </button>

            {!isRadio && (
              <button 
                onClick={() => skipTo(currentIndex + 1)}
                disabled={currentIndex === ayahs.length - 1}
                className="p-2 transition-all hover:scale-110 active:scale-90 disabled:opacity-20"
              >
                <SkipForward size={22} fill="currentColor" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {!isRadio && <ReciterComparison />}
            <button className="p-2 opacity-40 hover:opacity-100 transition-opacity">
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="auto" />
    </div>
  );
};

export default AudioPlayer;
