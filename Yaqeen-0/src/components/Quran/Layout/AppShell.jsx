/**
 * src/components/Quran/Layout/AppShell.jsx
 * Root layout wrapper — Quranify style:
 *   [Top App Bar] → [Scrollable Content] → [Bottom Nav] → [Mini Player]
 */

import React, { createContext, useContext } from 'react'

// ─── CONTEXT ─────────────────────────────────────────────────
const AppContext = createContext({})
export const useApp = () => useContext(AppContext)

// ─── COMPONENT ───────────────────────────────────────────────
export function AppShell({ children, playerState, miniPlayer, bottomNav }) {
  return (
    <div className="
      relative flex flex-col h-screen w-full max-w-md mx-auto
      bg-bg-primary text-text-primary
      overflow-hidden
      dark:bg-bg-primary dark:text-text-primary
      light:bg-surface-light light:text-text-inverse
    ">
      {/* Main scrollable content area */}
      <main className="
        flex-1 overflow-y-auto overscroll-contain
        pb-[calc(var(--bottom-bar)+var(--player-height))]
        scroll-smooth
      ">
        {children}
      </main>

      {/* Mini player sits above bottom nav */}
      {miniPlayer && (
        <div className="absolute bottom-[72px] left-0 right-0 z-40">
          {miniPlayer}
        </div>
      )}

      {/* Bottom navigation bar */}
      {bottomNav && (
        <div className="absolute bottom-0 left-0 right-0 z-50">
          {bottomNav}
        </div>
      )}
    </div>
  )
}
