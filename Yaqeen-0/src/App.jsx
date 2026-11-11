/**
 * src/App.jsx
 * Root component wiring everything together
 * Manages app state, navigation, and player controls
 */

import React, { useState } from 'react'
import { useSurahList } from './hooks/useQuranData'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useSettings } from './hooks/useSettings'
import { RECITERS } from './lib/constants'

// Layout
import { AppShell } from './components/Quran/Layout/AppShell'
import { TopBar } from './components/Quran/Layout/TopBar'
import { BottomNav } from './components/Quran/Layout/BottomNav'

// Components
import { MiniPlayer } from './components/Quran/MiniPlayer'
import { AudioPlayer } from './components/Quran/AudioPlayer'

// Views
import { HomeView } from './pages/HomeView'
import { SurahListView } from './pages/SurahListView'
import { ReaderView } from './pages/ReaderView'
import { SettingsView } from './pages/SettingsView'

export default function App() {
  const { surahs, loading: surahsLoading } = useSurahList()
  const {
    settings,
    setTheme,
    setFontSize,
    setLastReciter,
    toggleTranslation,
    toggleTranslit,
    toggleBookmark,
    isBookmarked,
    setLastPosition,
  } = useSettings()
  const player = useAudioPlayer()

  // Navigation
  const [activeTab, setActiveTab] = useState('home')
  const [activeSurah, setActiveSurah] = useState(null)
  const [playerExpanded, setPlayerExpanded] = useState(false)
  const [isDark, setIsDark] = useState(settings.theme !== 'light')

  // Helper refs
  const currentSurah = surahs.find(s => s.id === player.state.currentSurahId) ?? null
  const readerSurah = surahs.find(s => s.id === activeSurah) ?? null
  const currentReciter = RECITERS.find(r => r.id === player.state.currentReciterId)

  // Handlers
  const handleThemeToggle = () => {
    const next = isDark ? 'light' : 'dark'
    setIsDark(!isDark)
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  const handleReciterChange = (id) => {
    player.setReciter(id)
    setLastReciter(id)
  }

  const handleRepeatCycle = () => {
    const modes = ['none', 'all', 'one']
    const next = modes[(modes.indexOf(player.state.repeatMode) + 1) % 3]
    player.setRepeatMode(next)
  }

  const handlePlaySurah = (surah) => {
    player.play(surah.id)
    setActiveSurah(null) // Close reader if open
  }

  const handleOpenSurah = (surah) => {
    setActiveSurah(surah.id)
    setActiveTab('reader')
  }

  const handleOpenPlaylist = () => {
    setActiveTab('surah-list')
  }

  // Tab titles
  const topBarTitles = {
    home: { title: 'يَقِين', subtitle: 'Your Daily Quran' },
    'surah-list': { title: 'Surahs', subtitle: 'القرآن الكريم' },
    reader: {
      title: readerSurah?.nameTransliteration ?? 'Reading',
      subtitle: readerSurah?.name,
    },
    settings: { title: 'Settings' },
  }

  const { title, subtitle } = topBarTitles[activeTab]

  return (
    <div className={isDark ? 'dark' : ''}>
      <AppShell
        playerState={player.state}
        miniPlayer={
          currentSurah && !playerExpanded && (
            <MiniPlayer
              state={player.state}
              currentSurah={currentSurah}
              onToggle={player.toggle}
              onNext={() => player.nextSurah(surahs)}
              onExpand={() => setPlayerExpanded(true)}
            />
          )
        }
        bottomNav={
          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isPlaying={player.state.isPlaying}
          />
        }
      >
        {/* Header */}
        <TopBar
          title={title}
          subtitle={subtitle}
          showSearch={activeTab === 'surah-list'}
          onSearchClick={() => {}} // Search focus handled in components
          onSettingsClick={() => setActiveTab('settings')}
          isDark={isDark}
          onThemeToggle={handleThemeToggle}
        />

        {/* Content */}
        <div className="flex-1">
          {surahsLoading ? (
            <div className="flex items-center justify-center h-screen">
              <p className="text-text-tertiary">Loading Quran...</p>
            </div>
          ) : activeTab === 'home' ? (
            <HomeView
              surahs={surahs}
              settings={settings}
              onPlaySurah={handlePlaySurah}
              onOpenSurah={handleOpenSurah}
              onOpenPlaylist={handleOpenPlaylist}
            />
          ) : activeTab === 'surah-list' ? (
            <SurahListView
              surahs={surahs}
              playerState={player.state}
              onPlay={handlePlaySurah}
              onOpen={handleOpenSurah}
            />
          ) : activeTab === 'reader' && readerSurah ? (
            <ReaderView
              surah={readerSurah}
              readingSettings={settings.readingSettings}
              playerState={player.state}
              bookmarks={settings.bookmarks}
              onBack={() => {
                setActiveSurah(null)
                setActiveTab('surah-list')
              }}
              onPlaySurah={handlePlaySurah}
              onToggleBookmark={toggleBookmark}
              onOpenSettings={() => setActiveTab('settings')}
            />
          ) : activeTab === 'settings' ? (
            <SettingsView
              settings={settings}
              currentReciterId={player.state.currentReciterId}
              onReciterChange={handleReciterChange}
              onFontSizeChange={setFontSize}
              onThemeToggle={handleThemeToggle}
              onToggleTranslation={toggleTranslation}
              onToggleTranslit={toggleTranslit}
            />
          ) : null}
        </div>
      </AppShell>

      {/* Full-screen audio player */}
      {playerExpanded && (
        <AudioPlayer
          state={player.state}
          currentSurah={currentSurah}
          reciterName={currentReciter?.name ?? 'Select a reciter'}
          onToggle={player.toggle}
          onSeek={player.seek}
          onNext={() => player.nextSurah(surahs)}
          onPrev={() => player.prevSurah(surahs)}
          onVolumeChange={player.setVolume}
          onRepeatCycle={handleRepeatCycle}
          onShuffleToggle={player.toggleShuffle}
          onCollapse={() => setPlayerExpanded(false)}
        />
      )}
    </div>
  )
}
