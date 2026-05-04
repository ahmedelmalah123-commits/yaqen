/**
 * src/pages/ReaderView.jsx
 * Immersive reading view for a single surah
 */

import React from 'react'
import { ChevronLeft, Play } from 'lucide-react'
import { useSurahAyahs } from '../hooks/useQuranData'
import { AyahCard } from '../components/Quran/AyahCard'
import { FONT_SIZE_CLASSES } from '../lib/constants'

// Basmallah text
const BASMALLAH = 'بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ'

export function ReaderView({
  surah,
  readingSettings,
  playerState,
  bookmarks,
  onBack,
  onPlaySurah,
  onToggleBookmark,
  onOpenSettings,
}) {
  const { ayahs, loading } = useSurahAyahs(surah.id)
  const fontClass = FONT_SIZE_CLASSES[readingSettings.fontSize]

  return (
    <div>
      {/* Header */}
      <div className="sticky top-16 z-20 flex items-center justify-between px-5 py-4 bg-bg-secondary/95 backdrop-blur-md border-b border-white/4">
        <button
          onClick={onBack}
          className="
            w-9 h-9 flex items-center justify-center rounded-full
            text-text-secondary hover:text-text-primary
            hover:bg-white/8 transition-colors duration-200
          "
          aria-label="Back"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        <div className="text-center">
          <h2 className="text-[14px] font-semibold text-text-primary">
            {surah.nameTransliteration}
          </h2>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            {surah.ayahCount} Ayahs
          </p>
        </div>

        <button
          onClick={() => onPlaySurah(surah)}
          className="
            w-9 h-9 flex items-center justify-center rounded-full
            bg-gold-400 text-bg-primary
            hover:bg-gold-500
            transition-colors duration-200
          "
          aria-label="Play"
        >
          <Play size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Basmallah (except Surah 9) */}
      {surah.id !== 9 && (
        <div className="px-5 py-8 text-center border-b border-white/4">
          <p
            className={cn(
              'font-arabic text-center leading-loose text-gold-300',
              fontClass
            )}
            dir="rtl"
            lang="ar"
          >
            {BASMALLAH}
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="px-5 py-8 text-center">
          <p className="text-[13px] text-text-tertiary">
            Loading ayahs...
          </p>
        </div>
      )}

      {/* Ayahs */}
      {!loading &&
        ayahs.map(ayah => (
          <AyahCard
            key={ayah.id}
            ayah={ayah}
            isActive={
              playerState.currentSurahId === surah.id &&
              playerState.currentAyahId === ayah.id
            }
            isBookmarked={bookmarks.includes(ayah.id)}
            showTranslation={readingSettings.showTranslation}
            fontSize={fontClass}
            onToggleBookmark={onToggleBookmark}
            onTap={() => {
              // Optional: handle tap to play specific ayah
            }}
          />
        ))}
    </div>
  )
}

// Helper for className merging
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
