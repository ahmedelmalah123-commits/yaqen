/**
 * src/components/Quran/AudioPlayer.jsx
 * Full-screen expanded player — Quranify's immersive mode
 */

import React from 'react'
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
} from 'lucide-react'
import { cn } from '../../utils/cn'

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function RepeatIcon({ mode }) {
  if (mode === 'one') return <Repeat1 size={20} strokeWidth={1.5} />
  return <Repeat size={20} strokeWidth={1.5} />
}

export function AudioPlayer({
  state,
  currentSurah,
  onToggle,
  onSeek,
  onNext,
  onPrev,
  onVolumeChange,
  onRepeatCycle,
  onShuffleToggle,
  onCollapse,
  reciterName,
}) {
  const handleProgressClick = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    const progress = (e.clientX - rect.left) / rect.width
    onSeek(Math.max(0, Math.min(1, progress)))
  }

  return (
    <div className="
      fixed inset-0 z-50 flex flex-col
      bg-bg-primary
      animate-slide-up
    ">
      {/* Background art — subtle radial glow */}
      <div className="
        absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_at_top,rgba(232,168,0,0.08)_0%,transparent_60%)]
      " />

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 pt-14 pb-4">
        <button
          onClick={onCollapse}
          className="
            w-9 h-9 flex items-center justify-center rounded-full
            text-text-secondary hover:text-text-primary
            hover:bg-white/8 transition-colors duration-200
          "
          aria-label="Collapse player"
        >
          <ChevronDown size={20} strokeWidth={1.5} />
        </button>
        <h2 className="text-[14px] font-semibold text-text-primary">
          Now Playing
        </h2>
        <div className="w-9" />
      </div>

      {/* Album art — decorative Quran motif */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="
          w-48 h-48 rounded-3xl
          bg-gradient-to-br from-gold-400/20 to-gold-400/5
          border border-gold-400/30
          flex items-center justify-center
          shadow-golden animate-pulse-gold
        ">
          <svg
            className="w-20 h-20 text-gold-400 opacity-60"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            {/* Quran/book icon */}
            <path d="M19 1H5c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H5V3h14v16z" />
          </svg>
        </div>
      </div>

      {/* Surah info */}
      <div className="px-8 text-center mb-6">
        <h3 className="text-[20px] font-semibold text-text-primary">
          {currentSurah?.nameTransliteration || 'Select Surah'}
        </h3>
        <p className="text-[12px] text-text-tertiary mt-1">
          {currentSurah?.name} • {reciterName}
        </p>
      </div>

      {/* Progress bar */}
      <div className="px-6 mb-3">
        <div
          className="h-1 bg-white/10 rounded-pill cursor-pointer hover:h-1.5 transition-all"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gold-400 rounded-pill"
            style={{ width: `${state.progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-text-tertiary">
          <span>{formatTime(state.currentTime)}</span>
          <span>{formatTime(state.duration)}</span>
        </div>
      </div>

      {/* Main controls */}
      <div className="flex items-center justify-between px-8 mb-6">
        {/* Repeat button */}
        <button
          onClick={onRepeatCycle}
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-full',
            'transition-colors duration-200',
            state.repeatMode === 'none'
              ? 'text-text-tertiary hover:text-text-secondary'
              : 'text-gold-400 bg-gold-400/15'
          )}
          aria-label="Repeat mode"
        >
          <RepeatIcon mode={state.repeatMode} />
        </button>

        {/* Previous button */}
        <button
          onClick={onPrev}
          className="
            w-10 h-10 flex items-center justify-center rounded-full
            text-text-secondary hover:text-text-primary
            transition-colors duration-200
          "
          aria-label="Previous"
        >
          <SkipBack size={20} strokeWidth={1.5} />
        </button>

        {/* Play/Pause button — large center button */}
        <button
          onClick={onToggle}
          disabled={state.isLoading}
          className="
            w-16 h-16 flex items-center justify-center rounded-full
            bg-gradient-to-br from-gold-400 to-gold-500
            text-bg-primary
            hover:from-gold-300 hover:to-gold-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            shadow-gold-glow
          "
          aria-label={state.isPlaying ? 'Pause' : 'Play'}
        >
          {state.isLoading ? (
            <div className="animate-spin">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : state.isPlaying ? (
            <Pause size={24} strokeWidth={2} />
          ) : (
            <Play size={24} strokeWidth={2} />
          )}
        </button>

        {/* Next button */}
        <button
          onClick={onNext}
          className="
            w-10 h-10 flex items-center justify-center rounded-full
            text-text-secondary hover:text-text-primary
            transition-colors duration-200
          "
          aria-label="Next"
        >
          <SkipForward size={20} strokeWidth={1.5} />
        </button>

        {/* Shuffle button */}
        <button
          onClick={onShuffleToggle}
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-full',
            'transition-colors duration-200',
            state.isShuffle
              ? 'text-gold-400 bg-gold-400/15'
              : 'text-text-tertiary hover:text-text-secondary'
          )}
          aria-label="Shuffle"
        >
          <Shuffle size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-8 mb-8">
        <Volume2 size={16} strokeWidth={1.5} className="text-text-tertiary" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={state.volume}
          onChange={e => onVolumeChange(parseFloat(e.target.value))}
          className="
            flex-1 h-1 appearance-none bg-white/10 rounded-pill cursor-pointer
            accent-gold-400
          "
          aria-label="Volume"
        />
        <Volume2 size={16} strokeWidth={1.5} className="text-text-tertiary" />
      </div>
    </div>
  )
}
