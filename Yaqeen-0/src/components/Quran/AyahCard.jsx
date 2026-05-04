/**
 * src/components/Quran/AyahCard.jsx
 * Single ayah in reader view — Arabic text + translation + bookmark
 */

import React from 'react'
import { Bookmark } from 'lucide-react'
import { cn } from '../../utils/cn'

export function AyahCard({
  ayah,
  isActive,
  isBookmarked,
  showTranslation,
  fontSize,
  onToggleBookmark,
  onTap,
}) {
  return (
    <div
      className={cn(
        'px-5 py-6 border-b border-white/4',
        'transition-colors duration-300 cursor-pointer',
        isActive ? 'bg-gold-400/8' : 'hover:bg-white/3'
      )}
      onClick={() => onTap(ayah)}
    >
      {/* Ayah number pill — right-aligned (Arabic RTL) */}
      <div className="flex justify-end mb-4">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            'text-[11px] font-medium',
            isActive
              ? 'bg-gold-400 text-bg-primary'
              : 'bg-white/8 text-text-tertiary'
          )}
        >
          {ayah.ayahNumber}
        </div>
      </div>

      {/* Arabic text — RTL */}
      <p
        className={cn(
          'font-arabic text-right leading-loose text-text-primary',
          'transition-colors duration-300',
          fontSize,
          isActive && 'text-gold-100'
        )}
        dir="rtl"
        lang="ar"
      >
        {ayah.textArabic}
      </p>

      {/* Translation */}
      {showTranslation && ayah.textTranslation && (
        <p className="mt-4 text-[13px] text-text-secondary leading-relaxed">
          {ayah.textTranslation}
        </p>
      )}

      {/* Bottom action row */}
      <div className="flex items-center justify-end mt-4">
        <button
          onClick={e => {
            e.stopPropagation()
            onToggleBookmark(ayah.id)
          }}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-full',
            'transition-colors duration-200',
            isBookmarked
              ? 'text-gold-400 bg-gold-400/15'
              : 'text-text-tertiary hover:text-gold-400 hover:bg-gold-400/10'
          )}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark
            size={16}
            strokeWidth={2}
            fill={isBookmarked ? 'currentColor' : 'none'}
          />
        </button>
      </div>
    </div>
  )
}
