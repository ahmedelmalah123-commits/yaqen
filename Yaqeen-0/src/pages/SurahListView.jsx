/**
 * src/pages/SurahListView.jsx
 * Searchable scrollable list of all 114 surahs
 */

import React, { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { SurahCard } from '../components/Quran/SurahCard'
import { cn } from '../utils/cn'

export function SurahListView({
  surahs,
  playerState,
  onPlay,
  onOpen,
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return surahs.filter(s => {
      const matchesQuery =
        !q ||
        s.nameTransliteration.toLowerCase().includes(q) ||
        s.nameTranslation.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        String(s.id) === q

      const matchesFilter =
        filter === 'all' || s.revelationType === filter

      return matchesQuery && matchesFilter
    })
  }, [surahs, query, filter])

  return (
    <div>
      {/* Search bar */}
      <div className="sticky top-16 z-20 px-5 py-4 bg-bg-primary/95 backdrop-blur-md border-b border-white/4">
        <div className="relative mb-3">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="search"
            placeholder="Search surahs..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="
              w-full pl-9 pr-9 py-2 rounded-pill
              bg-white/8 border border-white/12
              text-text-primary placeholder:text-text-tertiary
              focus:outline-none focus:border-gold-400/50
              transition-colors duration-200
            "
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {['all', 'meccan', 'medinan'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-pill text-[11px] font-medium',
                'transition-colors duration-200',
                filter === f
                  ? 'bg-gold-400 text-bg-primary'
                  : 'bg-white/8 text-text-secondary hover:bg-white/12'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Surah list */}
      <div className="divide-y divide-white/4">
        {filtered.length > 0 ? (
          filtered.map(surah => (
            <SurahCard
              key={surah.id}
              surah={surah}
              isPlaying={
                playerState.currentSurahId === surah.id &&
                playerState.isPlaying
              }
              isActive={playerState.currentSurahId === surah.id}
              onPlay={onPlay}
              onOpen={onOpen}
            />
          ))
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="text-[13px] text-text-tertiary">
              No surahs found
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
