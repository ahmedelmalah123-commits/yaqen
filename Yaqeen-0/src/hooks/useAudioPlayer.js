/**
 * src/hooks/useAudioPlayer.js
 * Central audio engine — handles play/pause, seeking, next/prev, repeat, shuffle
 * Uses the free Islamic Network CDN for audio
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import { RECITERS, DEFAULT_PLAYER_STATE } from '../lib/constants'

// Builds audio URL: https://cdn.islamic.network/quran/audio/128/ar.alafasy/001001.mp3
function buildAudioUrl(reciterId, surahId, ayahNumber) {
  const reciter = RECITERS.find(r => r.id === reciterId)
  if (!reciter) throw new Error(`Unknown reciter: ${reciterId}`)
  // Islamic Network uses surahId padded to 3 digits + ayah padded to 3 digits
  const surahPadded = String(surahId).padStart(3, '0')
  const ayahPadded = String(ayahNumber).padStart(3, '0')
  return `${reciter.audioBaseUrl}${surahPadded}${ayahPadded}.mp3`
}

// Full surah audio (no ayah breakdown)
function buildSurahUrl(reciterId, surahId) {
  const reciter = RECITERS.find(r => r.id === reciterId)
  if (!reciter) return ''
  return `https://download.quranicaudio.com/quran/${reciterId.replace('ar.', '')}/${String(surahId).padStart(3, '0')}.mp3`
}

export function useAudioPlayer() {
  const audioRef = useRef(null)
  const [state, setState] = useState(DEFAULT_PLAYER_STATE)

  // Init audio element once
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = DEFAULT_PLAYER_STATE.volume

    audio.addEventListener('timeupdate', () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        progress: audio.duration ? audio.currentTime / audio.duration : 0,
      }))
    })

    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({ ...prev, duration: audio.duration }))
    })

    audio.addEventListener('ended', () => {
      setState(prev => ({ ...prev, isPlaying: false }))
    })

    audio.addEventListener('error', () => {
      setState(prev => ({
        ...prev,
        error: 'Failed to load audio',
        isPlaying: false,
      }))
    })

    audio.addEventListener('waiting', () => {
      setState(prev => ({ ...prev, isLoading: true }))
    })

    audio.addEventListener('playing', () => {
      setState(prev => ({ ...prev, isLoading: false }))
    })

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Auto-handle repeat on end
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      if (state.repeatMode === 'one') {
        audio.currentTime = 0
        audio.play()
      }
    }

    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [state.repeatMode])

  const play = useCallback((surahId, reciterId) => {
    const audio = audioRef.current
    if (!audio) return

    const rid = reciterId ?? state.currentReciterId
    const url = buildSurahUrl(rid, surahId)

    setState(prev => ({
      ...prev,
      isLoading: true,
      isPlaying: true,
      currentSurahId: surahId,
      currentReciterId: rid,
      error: null,
      progress: 0,
      currentTime: 0,
    }))

    audio.src = url
    audio.load()
    audio.play().catch(err => {
      setState(prev => ({
        ...prev,
        error: err.message,
        isPlaying: false,
      }))
    })
  }, [state.currentReciterId])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setState(prev => ({ ...prev, isPlaying: false }))
  }, [])

  const resume = useCallback(() => {
    audioRef.current?.play()
    setState(prev => ({ ...prev, isPlaying: true }))
  }, [])

  const toggle = useCallback(() => {
    if (state.isPlaying) pause()
    else resume()
  }, [state.isPlaying, pause, resume])

  const seek = useCallback((progress) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = progress * audio.duration
    setState(prev => ({ ...prev, progress, currentTime: audio.currentTime }))
  }, [])

  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v))
    if (audioRef.current) audioRef.current.volume = clamped
    setState(prev => ({ ...prev, volume: clamped }))
  }, [])

  const setReciter = useCallback((id) => {
    setState(prev => {
      const newState = { ...prev, currentReciterId: id }
      if (prev.isPlaying) {
        play(prev.currentSurahId, id)
      }
      return newState
    })
  }, [play])

  const nextSurah = useCallback((surahs) => {
    setState(prev => {
      if (!prev.currentSurahId) return prev
      const current = surahs.find(s => s.id === prev.currentSurahId)
      if (!current) return prev
      const currentIndex = surahs.indexOf(current)
      let nextIndex
      if (prev.isShuffle) {
        nextIndex = Math.floor(Math.random() * surahs.length)
      } else {
        nextIndex = (currentIndex + 1) % surahs.length
      }
      const nextSurah = surahs[nextIndex]
      if (nextSurah) {
        play(nextSurah.id, prev.currentReciterId)
      }
      return prev
    })
  }, [play])

  const prevSurah = useCallback((surahs) => {
    const audio = audioRef.current
    // If > 3s in, restart current; else go previous
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    setState(prev => {
      if (!prev.currentSurahId) return prev
      const current = surahs.find(s => s.id === prev.currentSurahId)
      if (!current) return prev
      const currentIndex = surahs.indexOf(current)
      const prevIndex = (currentIndex - 1 + surahs.length) % surahs.length
      const prevSurah = surahs[prevIndex]
      if (prevSurah) {
        play(prevSurah.id, prev.currentReciterId)
      }
      return prev
    })
  }, [play])

  const setRepeatMode = useCallback((mode) => {
    setState(prev => ({ ...prev, repeatMode: mode }))
  }, [])

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, isShuffle: !prev.isShuffle }))
  }, [])

  return {
    state,
    play,
    pause,
    resume,
    toggle,
    seek,
    setVolume,
    setReciter,
    nextSurah,
    prevSurah,
    setRepeatMode,
    toggleShuffle,
  }
}
