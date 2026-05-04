/**
 * src/components/Quran/MiniPlayer.jsx
 * Compact player bar above bottom nav — tap to expand
 */

import React from 'react'
import { Play, Pause, SkipForward } from 'lucide-react'
import { cn } from '../../utils/cn'

export function MiniPlayer({ state, currentSurah, onToggle, onNext, onExpand }) {
  if (!currentSurah) return null

  return (
    <div
      className="
        mx-3 mb-1 rounded-card
        bg-bg-tertiary/95 backdrop-blur-md
        border border-white/8
        shadow-player
        overflow-hidden
        animate-slide-up
      "
    >
      {/* Progress bar at top */}
      <div className="h-[2px] bg-white/8">
        <div
          className="h-full bg-gold-400 transition-all duration-1000 ease-linear"
          style={{ width: `${state.progress * 100}%` }}
        />
      </div>

      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={onExpand}
      >
        {/* Album art placeholder */}
        <div className="w-10 h-10 rounded-sm bg-gold-400/20 flex items-center justify-center flex-shrink-0">
          <Music size={18} className="text-gold-400" strokeWidth={1.5} />
        </div>

        {/* Surah info */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-text-primary truncate">
            {currentSurah.nameTransliteration}
          </p>
          <p className="text-[11px] text-text-tertiary truncate">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </p>
        </div>

        {/* Play/Pause button */}
        <button
          onClick={e => {
            e.stopPropagation()
            onToggle()
          }}
          className="
            w-8 h-8 flex items-center justify-center rounded-full
            bg-gold-400 text-bg-primary
            hover:bg-gold-500
            transition-colors duration-200
          "
          aria-label={state.isPlaying ? 'Pause' : 'Play'}
        >
          {state.isPlaying ? (
            <Pause size={16} strokeWidth={2} />
          ) : (
            <Play size={16} strokeWidth={2} />
          )}
        </button>

        {/* Next button */}
        <button
          onClick={e => {
            e.stopPropagation()
            onNext()
          }}
          className="
            w-6 h-6 flex items-center justify-center
            text-text-secondary hover:text-gold-400
            transition-colors duration-200
          "
          aria-label="Next"
        >
          <SkipForward size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

// Import Music icon if using lucide-react
import { Music } from 'lucide-react'
