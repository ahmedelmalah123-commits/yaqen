import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Volume2, Timer, Zap } from 'lucide-react';

/**
 * Speed & Sleep Timer Controls
 * Provides playback rate adjustment and sleep timer functionality
 */
const AudioControls = () => {
  const { playbackRate, setPlaybackRate, sleepTimer, setSleepTimer, audioState } = useAppStore();
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [customTimer, setCustomTimer] = useState('');

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  // Sleep timer countdown
  useEffect(() => {
    if (!sleepTimer || sleepTimer <= 0) return;

    const interval = setInterval(() => {
      setSleepTimer(sleepTimer - 1);
    }, 60000); // Decrement every minute

    return () => clearInterval(interval);
  }, [sleepTimer, setSleepTimer]);

  // Stop playback when timer reaches 0
  useEffect(() => {
    if (sleepTimer === 0) {
      useAppStore.getState().setAudioState({ isPlaying: false });
      setSleepTimer(null);
    }
  }, [sleepTimer]);

  const handleSetSpeed = (speed) => {
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
    // Apply to audio element if playing
    const audio = document.querySelector('audio');
    if (audio) audio.playbackRate = speed;
  };

  const handleSetTimer = (minutes) => {
    setSleepTimer(minutes);
    setShowTimerMenu(false);
    setCustomTimer('');
  };

  const handleCustomTimer = () => {
    const mins = parseInt(customTimer);
    if (mins > 0 && mins <= 180) {
      handleSetTimer(mins);
    }
  };

  if (!audioState.isPlaying) return null;

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Speed Control */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
          className="flex items-center gap-1 px-3 py-2 rounded-full bg-[#1B4332]/40 hover:bg-[#1B4332]/60 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-sm transition-all"
          title="التحكم في السرعة"
        >
          <Zap size={16} />
          {playbackRate.toFixed(2)}x
        </motion.button>

        {showSpeedMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 right-0 bg-[#05110B] border-2 border-[#D4AF37]/40 rounded-lg shadow-xl z-50"
          >
            {speedOptions.map((speed) => (
              <button
                key={speed}
                onClick={() => handleSetSpeed(speed)}
                className={`w-full text-right px-4 py-2 transition-colors ${
                  playbackRate === speed
                    ? 'bg-[#D4AF37] text-[#1B4332] font-bold'
                    : 'text-[#D4AF37] hover:bg-[#1B4332]/60'
                }`}
              >
                {speed.toFixed(2)}x
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Sleep Timer Control */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTimerMenu(!showTimerMenu)}
          className={`flex items-center gap-1 px-3 py-2 rounded-full border font-bold text-sm transition-all ${
            sleepTimer
              ? 'bg-[#D4AF37] text-[#1B4332] border-[#D4AF37]'
              : 'bg-[#1B4332]/40 hover:bg-[#1B4332]/60 border-[#D4AF37]/30 text-[#D4AF37]'
          }`}
          title="مؤقت النوم"
        >
          <Timer size={16} />
          {sleepTimer ? `${sleepTimer}م` : 'مؤقت'}
        </motion.button>

        {showTimerMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 right-0 bg-[#05110B] border-2 border-[#D4AF37]/40 rounded-lg shadow-xl z-50 w-48"
          >
            {[15, 30, 60, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSetTimer(mins)}
                className={`w-full text-right px-4 py-2 transition-colors ${
                  sleepTimer === mins
                    ? 'bg-[#D4AF37] text-[#1B4332] font-bold'
                    : 'text-[#D4AF37] hover:bg-[#1B4332]/60'
                }`}
              >
                {mins} دقيقة
              </button>
            ))}
            <div className="border-t border-[#D4AF37]/20 p-2 flex gap-1">
              <input
                type="number"
                min="1"
                max="180"
                value={customTimer}
                onChange={(e) => setCustomTimer(e.target.value)}
                placeholder="دقيقة"
                className="flex-1 px-2 py-1 bg-[#1B4332] text-[#D4AF37] border border-[#D4AF37]/30 rounded text-sm"
              />
              <button
                onClick={handleCustomTimer}
                className="px-2 py-1 bg-[#D4AF37] text-[#1B4332] font-bold rounded text-sm hover:bg-[#D4AF37]/80"
              >
                ✓
              </button>
            </div>
            {sleepTimer && (
              <button
                onClick={() => handleSetTimer(null)}
                className="w-full text-right px-4 py-2 text-red-400 hover:bg-[#1B4332]/60 border-t border-[#D4AF37]/20 transition-colors"
              >
                إلغاء المؤقت
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AudioControls;
