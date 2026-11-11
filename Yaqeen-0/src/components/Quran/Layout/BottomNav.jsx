/**
 * src/components/Quran/Layout/BottomNav.jsx
 * Bottom navigation — Quranify has 4 tabs:
 *   Home | Surahs | Player | Settings
 */

import React from 'react'
import { Home, BookOpen, Music2, Sliders } from 'lucide-react'
import { cn } from '../../../utils/cn'

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'surah-list', label: 'Surahs', Icon: BookOpen },
  { id: 'player', label: 'Player', Icon: Music2 },
  { id: 'settings', label: 'Settings', Icon: Sliders },
]

export function BottomNav({ activeTab, onTabChange, isPlaying }) {
  return (
    <nav className="
      flex items-stretch h-[72px]
      bg-bg-secondary/95 backdrop-blur-md
      border-t border-white/6
      pb-[env(safe-area-inset-bottom)]
    ">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1',
              'transition-colors duration-200',
              isActive
                ? 'text-gold-400'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Player tab: show animated wave when playing */}
            {id === 'player' && isPlaying && !isActive ? (
              <div className="relative w-5 h-5 flex items-end justify-center gap-[2px]">
                {[1, 2, 3, 4].map(i => (
                  <span
                    key={i}
                    className={cn(
                      'w-[3px] rounded-full bg-gold-400 origin-bottom',
                      `animate-wave-${i}`
                    )}
                    style={{ height: '12px' }}
                  />
                ))}
              </div>
            ) : (
              <Icon
                size={20}
                strokeWidth={isActive ? 2 : 1.5}
                className={isActive ? 'drop-shadow-[0_0_6px_rgba(232,168,0,0.5)]' : ''}
              />
            )}
            <span
              className={cn(
                'text-[10px] font-medium tracking-wide',
                isActive ? 'text-gold-400' : ''
              )}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
