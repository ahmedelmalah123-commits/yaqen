/**
 * src/pages/HomeView.jsx
 * Home screen — Quranify-style:
 *   Hero greeting, curated playlists, continue listening, recently viewed
 */

import React, { useMemo } from 'react'
import { BookOpen, Moon, Briefcase } from 'lucide-react'
import { SurahCard } from '../components/Quran/SurahCard'
import { cn } from '../utils/cn'
import { PLAYLISTS } from '../lib/constants'

const PLAYLIST_ICONS = {
  study: BookOpen,
  sleep: Moon,
  work: Briefcase,
}

const PLAYLIST_GRADIENTS = {
  study: 'from-blue-900/60 to-blue-800/30',
  sleep: 'from-purple-900/60 to-purple-800/30',
  work: 'from-amber-900/60 to-amber-800/30',
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 5) return 'مرحباً بك'
  if (h < 12) return 'صباح الخير'
  if (h < 17) return 'طاب نهارك'
  if (h < 21) return 'مساء الخير'
  return 'ليلة مباركة'
}

export function HomeView({
  surahs,
  settings,
  onPlaySurah,
  onOpenSurah,
  onOpenPlaylist,
}) {
  // Get the surah the user last listened to
  const lastSurah = surahs.find(s => s.id === settings.lastSurahId)

  // Featured surahs for quick access
  const FEATURED_IDS = [1, 2, 18, 36, 55, 67, 112, 113, 114]
  const featuredSurahs = surahs.filter(s => FEATURED_IDS.includes(s.id))

  return (
    <div className="pb-4">
      {/* ─── Hero Section ─── */}
      <div className="px-5 pt-4 pb-6">
        <h2 className="text-[28px] font-semibold text-text-primary mb-1">
          {getGreeting()}
        </h2>
        <p className="text-[13px] text-text-secondary">
          {lastSurah
            ? `Continue with ${lastSurah.nameTransliteration}`
            : 'Start your Quran journey'}
        </p>

        {lastSurah && (
          <button
            onClick={() => onPlaySurah(lastSurah)}
            className="
              mt-4 px-6 py-3 rounded-pill
              bg-gold-400 text-bg-primary
              font-semibold text-[13px]
              hover:bg-gold-500
              transition-colors duration-200
              shadow-gold-glow
            "
          >
            Resume Now
          </button>
        )}
      </div>

      {/* ─── Playlists ─── */}
      <section className="mb-6">
        <h3 className="px-5 mb-3 text-[14px] font-semibold text-text-primary">
          Curated for You
        </h3>
        <div className="px-5 space-y-3">
          {PLAYLISTS.map(playlist => {
            const Icon = PLAYLIST_ICONS[playlist.type]
            return (
              <button
                key={playlist.id}
                onClick={() => onOpenPlaylist(playlist)}
                className={cn(
                  'w-full px-5 py-4 rounded-card',
                  'bg-gradient-to-br',
                  PLAYLIST_GRADIENTS[playlist.type],
                  'border border-white/8',
                  'text-left transition-all duration-200',
                  'hover:border-white/15 active:scale-95'
                )}
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <Icon size={20} className="text-gold-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-[13px] font-semibold text-text-primary">
                      {playlist.title}
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-0.5">
                      {playlist.surahIds.length} surahs
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ─── Featured Surahs ─── */}
      <section>
        <h3 className="px-5 mb-3 text-[14px] font-semibold text-text-primary">
          Featured Surahs
        </h3>
        <div className="space-y-1">
          {featuredSurahs.map(surah => (
            <SurahCard
              key={surah.id}
              surah={surah}
              isPlaying={false}
              isActive={false}
              onPlay={onPlaySurah}
              onOpen={onOpenSurah}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
