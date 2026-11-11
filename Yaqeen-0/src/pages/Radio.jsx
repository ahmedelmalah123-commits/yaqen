import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { radioData } from '../lib/data/radioData';
import { Radio as RadioIcon, Play, Pause, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

const Radio = () => {
  const { theme, audioState, playRadio, setAudioState } = useAppStore();

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 font-ibm">
      
      {/* Hero Header */}
      <div className={`relative rounded-[3rem] p-12 mb-12 overflow-hidden text-center border shadow-2xl transition-colors duration-500
        ${theme === 'dark' ? 'bg-gradient-to-br from-[#0c1622] to-[#0f1c2c] border-[#d6a54a]/30 text-white' 
          : 'bg-gradient-to-br from-white to-[#F5F5DC] border-[#0f1c2c]/20 text-[#0f1c2c]'}
      `}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay border-none"></div>
        <div className="relative z-10 flex flex-col items-center">
           <RadioIcon size={64} className={`mb-6 p-4 rounded-full ${theme === 'dark' ? 'text-[#d6a54a] bg-[#d6a54a]/10' : 'text-[#0f1c2c] bg-[#0f1c2c]/10'}`} />
           <h1 className={`text-4xl md:text-[6rem] font-bold mb-4 drop-shadow-lg font-reem tracking-wide ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>
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
          
          const isCurrentStationPlaying = audioState.isRadio && audioState.isPlaying && audioState.surah?.name === station.name;
          const isCurrentStationPaused = audioState.isRadio && !audioState.isPlaying && audioState.surah?.name === station.name;

          return (
            <motion.div 
              key={station.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                 if (isCurrentStationPlaying) {
                    setAudioState({ isPlaying: false });
                 } else {
                    playRadio(station.name, station.url);
                 }
              }}
              className={`group flex items-center justify-between p-8 rounded-3xl border-2 cursor-pointer transition-all shadow-lg hover:-translate-y-2 hover:shadow-2xl
                ${(isCurrentStationPlaying || isCurrentStationPaused) 
                  ? (theme === 'dark' ? 'bg-[#0c1622] border-[#d6a54a] shadow-[0_0_30px_rgba(200,169,106,0.2)] scale-[1.02]' : 'bg-[#e9e9db] border-[#0f1c2c] shadow-xl scale-[1.02]')
                  : (theme === 'dark' ? 'bg-[#0f1c2c]/40 border-[#d6a54a]/20 hover:border-[#d6a54a]/60' : 'bg-white border-[#0f1c2c]/10 hover:border-[#0f1c2c]/40')
                }
              `}
            >
              <div className="flex flex-col gap-2 relative z-10">
                <span className={`text-sm font-bold tracking-widest px-3 py-1 rounded-full w-max opacity-80
                   ${theme === 'dark' ? 'bg-[#d6a54a]/20 text-[#d6a54a]' : 'bg-[#0f1c2c]/10 text-[#0f1c2c]'}
                `}>
                  {station.type}
                </span>
                <h3 className={`text-3xl font-bold font-ibm ${theme === 'dark' ? 'text-white' : 'text-[#0f1c2c]'}`}>
                  {station.name}
                </h3>
              </div>

              <div className={`p-4 rounded-full transition-all border shrink-0 relative z-10
                ${isCurrentStationPlaying 
                   ? (theme === 'dark' ? 'bg-[#d6a54a] text-[#0c1622] border-transparent' : 'bg-[#0f1c2c] text-white border-transparent')
                   : (theme === 'dark' ? 'bg-transparent text-[#d6a54a] border-[#d6a54a]/50 group-hover:bg-[#d6a54a] group-hover:text-[#0c1622]' : 'bg-transparent text-[#0f1c2c] border-[#0f1c2c]/40 group-hover:bg-[#0f1c2c] group-hover:text-white')
                }
              `}>
                {isCurrentStationPlaying ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor" size={32} className="ml-1" />}
              </div>

               {/* Absolute active glow backdrop */}
               {(isCurrentStationPlaying) && (
                  <div className={`absolute right-0 top-0 bottom-0 w-32 rounded-l-3xl mix-blend-screen opacity-20 pointer-events-none 
                    ${theme === 'dark' ? 'bg-gradient-to-l from-[#d6a54a]' : 'bg-gradient-to-l from-[#0f1c2c]'}
                  `}></div>
               )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default Radio;
