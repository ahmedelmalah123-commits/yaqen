/**
 * src/components/Quran/SurahCard.jsx
 * Surah list item — Quranify style:
 *   [Number Badge] [Arabic Name + Latin + Ayah count] [Revelation type]
 */

import React from 'react'
import { Play, Pause } from 'lucide-react'
import { cn } from '../../utils/cn'

export function SurahCard({ surah, isPlaying, isActive, onPlay, onOpen }) {
  return (
    <div
      className={cn(
        'relative flex items-center gap-4 px-5 py-4',
        'cursor-pointer active:scale-[0.99]',
        'transition-all duration-200',
        'border-b border-white/4',
        // Highlight active surah
        isActive && 'bg-gold-400/6',
        'hover:bg-white/4'
      )}
      onClick={() => onOpen(surah)}
    >
      {/* Left: Surah number badge — octagon shape via CSS */}
      <div
        className={cn(
          'relative flex-shrink-0 w-10 h-10 flex items-center justify-center',
          'font-mono text-[13px] font-semibold',
          isActive ? 'text-gold-400' : 'text-text-secondary'
        )}
      >
        <svg
          viewBox="0 0 40 40"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <path
            d="M14 2 L26 2 L38 14 L38 26 L26 38 L14 38 L2 26 L2 14 Z"
            fill="none"
            stroke={isActive ? 'rgb(232 168 0 / 0.6)' : 'rgb(255 255 255 / 0.12)'}
            strokeWidth="1"
          />
        </svg>
        <span className="relative z-10">{surah.id}</span>
      </div>

      {/* Center: Names */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-arabic-ui text-[15px] leading-snug',
            isActive ? 'text-gold-300' : 'text-text-primary'
          )}
        >
          {surah.name}
        </p>
        <p className="text-[12px] text-text-tertiary mt-0.5 flex items-center gap-1.5">
          <span>{surah.nameTransliteration}</span>
          <span className="w-1 h-1 rounded-full bg-text-tertiary/50" />
          <span className="capitalize text-[10px]">
            {surah.revelationType === 'meccan' ? 'Meccan' : 'Medinan'}
          </span>
        </p>
      </div>

      {/* Right: Ayah count + Play button */}
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <p className="text-[11px] text-text-tertiary font-arabic-ui">
          {surah.ayahCount} آيات
        </p>
        <button
          onClick={e => {
            e.stopPropagation()
            onPlay(surah)
          }}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            'transition-all duration-200',
            isPlaying
              ? 'bg-gold-400 text-bg-primary shadow-gold-glow'
              : 'bg-white/8 text-text-secondary hover:bg-gold-400/20 hover:text-gold-400'
          )}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={16} strokeWidth={2} />
          ) : (
            <Play size={16} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  )
}
