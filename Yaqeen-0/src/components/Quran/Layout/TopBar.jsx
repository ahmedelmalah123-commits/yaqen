/**
 * src/components/Quran/Layout/TopBar.jsx
 * Top app bar — search, title, settings icon
 */

import React from 'react'
import { Search, Settings, Moon, Sun } from 'lucide-react'
import { cn } from '../../../utils/cn'

export function TopBar({
  title,
  subtitle,
  showSearch = true,
  onSearchClick,
  onSettingsClick,
  isDark,
  onThemeToggle,
  rightAction,
}) {
  return (
    <header className="
      sticky top-0 z-30 flex items-center justify-between
      px-5 h-16
      bg-bg-primary/95 backdrop-blur-md
      border-b border-white/5
    ">
      {/* Left: Theme toggle */}
      <button
        onClick={onThemeToggle}
        className="
          w-9 h-9 flex items-center justify-center rounded-full
          text-text-secondary hover:text-text-primary
          hover:bg-white/8 transition-colors duration-200
        "
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun size={18} strokeWidth={1.5} />
        ) : (
          <Moon size={18} strokeWidth={1.5} />
        )}
      </button>

      {/* Center: Title */}
      <div className="text-center">
        <h1 className="text-[15px] font-semibold text-text-primary tracking-wide">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] text-text-secondary mt-0.5 font-arabic-ui">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: Search or custom action or settings */}
      <div className="flex items-center gap-1">
        {rightAction ?? (
          <>
            {showSearch && (
              <button
                onClick={onSearchClick}
                className="
                  w-9 h-9 flex items-center justify-center rounded-full
                  text-text-secondary hover:text-text-primary
                  hover:bg-white/8 transition-colors duration-200
                "
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
            )}
            <button
              onClick={onSettingsClick}
              className="
                w-9 h-9 flex items-center justify-center rounded-full
                text-text-secondary hover:text-text-primary
                hover:bg-white/8 transition-colors duration-200
              "
              aria-label="Settings"
            >
              <Settings size={18} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
