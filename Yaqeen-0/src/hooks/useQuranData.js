/**
 * src/hooks/useQuranData.js
 * Fetches surah list and ayahs from alquran.cloud API
 */

import { useState, useEffect } from 'react'
import { API_BASE } from '../lib/constants'

export function useSurahList() {
  const [surahs, setSurahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/surah`)
      .then(r => r.json())
      .then(data => {
        if (data.code === 200 && data.data) {
          setSurahs(
            data.data.map(s => ({
              id: s.number,
              name: s.name,
              nameTransliteration: s.englishName,
              nameTranslation: s.englishNameTranslation,
              ayahCount: s.numberOfAyahs,
              revelationType: s.revelationType.toLowerCase(),
              pageNumber: 1, // API doesn't provide this
            }))
          )
        }
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  return { surahs, loading, error }
}

export function useSurahAyahs(surahId) {
  const [ayahs, setAyahs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!surahId) return
    setLoading(true)
    // Fetch Arabic + English in one call using edition
    Promise.all([
      fetch(`${API_BASE}/surah/${surahId}/ar.alafasy`).then(r => r.json()),
      fetch(`${API_BASE}/surah/${surahId}/en.asad`).then(r => r.json()),
    ])
      .then(([arabicData, translationData]) => {
        if (arabicData.code === 200 && translationData.code === 200) {
          const arabic = arabicData.data.ayahs
          const translation = translationData.data.ayahs
          setAyahs(
            arabic.map((a, i) => ({
              id: a.number,
              surahId: surahId,
              ayahNumber: a.numberInSurah,
              textArabic: a.text,
              textTransliteration: a.transliteration || '',
              textTranslation: translation[i]?.text || '',
            }))
          )
        }
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [surahId])

  return { ayahs, loading, error }
}
