import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { radioData } from '../lib/data/radioData';
import { Radio as RadioIcon, Play, Pause, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

const Radio = () => {
  const { theme } = useAppStore();
  const audioRef = useRef(null);
  const [playingStation, setPlayingStation] = useState(null);

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 font-ibm">
      
      {/* Hero Header */}
      <div className={`relative rounded-[3rem] p-12 mb-12 overflow-hidden text-center border shadow-2xl transition-colors duration-500
        ${theme === 'dark' ? 'bg-gradient-to-br from-[#022c22] to-[#064e3b] border-primary/30 text-white' 
          : 'bg-gradient-to-br from-white to-[#FAF8F5] border-secondary/20 text-secondary'}
      `}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay border-none"></div>
        <div className="relative z-10 flex flex-col items-center">
           <RadioIcon size={64} className={`mb-6 p-4 rounded-full ${theme === 'dark' ? 'text-primary bg-primary/10' : 'text-secondary bg-secondary/10'}`} />
           <h1 className={`text-4xl md:text-[6rem] font-bold mb-4 drop-shadow-lg font-reem tracking-wide ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
             إذاعة القرآن الكريم
           </h1>
           <p className="text-2xl opacity-90 font-light flex items-center justify-center gap-2">
             بث مباشر على مدار الساعة <Waves size={24} className="animate-pulse" />
           </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-32">
        {radioData.map((station, index) => {
          
          const isCurrentStationPlaying = playingStation === station.name;
          const isCurrentStationPaused = false;

          return (
            <motion.div 
              key={station.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                 if (isCurrentStationPlaying) {
                    audioRef.current.pause();
                    setPlayingStation(null);
                 } else {
                    if (playingStation) audioRef.current.pause();
                    audioRef.current.src = station.url;
                    audioRef.current.play();
                    setPlayingStation(station.name);
                 }
              }}
              className={`group flex items-center justify-between p-8 rounded-3xl border-2 cursor-pointer transition-all shadow-lg hover:-translate-y-2 hover:shadow-2xl
                ${(isCurrentStationPlaying || isCurrentStationPaused) 
                  ? (theme === 'dark' ? 'bg-[#064e3b] border-primary shadow-[0_0_30px_rgba(200,169,106,0.2)] scale-[1.02]' : 'bg-[#e9e9db] border-secondary shadow-xl scale-[1.02]')
                  : (theme === 'dark' ? 'bg-[#064e3b]/40 border-primary/20 hover:border-primary/60' : 'bg-white border-secondary/10 hover:border-secondary/40')
                }
              `}
            >
              <div className="flex flex-col gap-2 relative z-10">
                <span className={`text-sm font-bold tracking-widest px-3 py-1 rounded-full w-max opacity-80
                   ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-secondary/10 text-secondary'}
                `}>
                  {station.type}
                </span>
                <h3 className={`text-3xl font-bold font-ibm ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
                  {station.name}
                </h3>
              </div>

              <div className={`p-4 rounded-full transition-all border shrink-0 relative z-10
                ${isCurrentStationPlaying 
                   ? (theme === 'dark' ? 'bg-primary text-secondary border-transparent' : 'bg-secondary text-white border-transparent')
                   : (theme === 'dark' ? 'bg-transparent text-primary border-primary/50 group-hover:bg-primary group-hover:text-secondary' : 'bg-transparent text-secondary border-secondary/40 group-hover:bg-secondary group-hover:text-white')
                }
              `}>
                {isCurrentStationPlaying ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor" size={32} className="ml-1" />}
              </div>

               {/* Absolute active glow backdrop */}
               {(isCurrentStationPlaying) && (
                  <div className={`absolute right-0 top-0 bottom-0 w-32 rounded-l-3xl mix-blend-screen opacity-20 pointer-events-none 
                    ${theme === 'dark' ? 'bg-gradient-to-l from-primary' : 'bg-gradient-to-l from-secondary'}
                  `}></div>
               )}
            </motion.div>
          );
        })}
      </div>

      <audio ref={audioRef} onEnded={() => setPlayingStation(null)} />
    </div>
  );
};

export default Radio;
