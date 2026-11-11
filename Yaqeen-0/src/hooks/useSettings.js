/**
 * src/hooks/useSettings.js
 * Persists user settings to localStorage
 */

import { useState, useCallback } from 'react'
import { DEFAULT_SETTINGS, STORAGE_KEY_SETTINGS } from '../lib/constants'

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS)
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings)

  const save = useCallback((next) => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(next))
      setSettings(next)
    } catch (err) {
      console.error('Failed to save settings:', err)
    }
  }, [])

  const setTheme = (theme) => save({ ...settings, theme })

  const setFontSize = (fontSize) =>
    save({
      ...settings,
      readingSettings: { ...settings.readingSettings, fontSize },
    })

  const setReadingMode = (readingMode) =>
    save({
      ...settings,
      readingSettings: { ...settings.readingSettings, readingMode },
    })

  const toggleTranslation = () =>
    save({
      ...settings,
      readingSettings: {
        ...settings.readingSettings,
        showTranslation: !settings.readingSettings.showTranslation,
      },
    })

  const toggleTranslit = () =>
    save({
      ...settings,
      readingSettings: {
        ...settings.readingSettings,
        showTransliteration: !settings.readingSettings.showTransliteration,
      },
    })

  const setLastPosition = (surahId, ayahId) =>
    save({ ...settings, lastSurahId: surahId, lastAyahId: ayahId })

  const setLastReciter = (id) => save({ ...settings, lastReciterId: id })

  const toggleBookmark = (ayahId) => {
    const bookmarks = settings.bookmarks.includes(ayahId)
      ? settings.bookmarks.filter(id => id !== ayahId)
      : [...settings.bookmarks, ayahId]
    save({ ...settings, bookmarks })
  }

  const isBookmarked = (ayahId) => settings.bookmarks.includes(ayahId)

  return {
    settings,
    setTheme,
    setFontSize,
    setReadingMode,
    toggleTranslation,
    toggleTranslit,
    setLastPosition,
    setLastReciter,
    toggleBookmark,
    isBookmarked,
  }
}
