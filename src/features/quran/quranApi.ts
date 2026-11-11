import { getReciterById, getSurahAudioUrl } from '../../lib/data/recitersData';
import { normalizeArabic } from '../../lib/arabicSearch';

const API_BASE = 'https://api.alquran.cloud/v1';
const MP3QURAN_TIMING_BASE = 'https://www.mp3quran.net/api/v3/ayat_timing';

export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface QuranAyah {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface AyahTimingSegment {
  ayah: number;
  startTimeMs: number;
  endTimeMs: number;
}

export interface SurahTimingData {
  timingAvailable: boolean;
  moshafId: number | null;
  segments: AyahTimingSegment[];
}

export interface SurahBundle {
  surahData: SurahSummary & { ayahs: QuranAyah[] };
  tafsirData: { ayahs: Array<{ numberInSurah: number; text: string }> } | null;
  surahAudioUrl: string;
  playbackType: 'surahbysurah';
  timingData: SurahTimingData;
}

interface RawTimingEntry {
  ayah?: number;
  start_time?: number;
  end_time?: number;
}

async function fetchJson(url: string, signal?: AbortSignal) {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} loading ${url}`);
  }
  const json = await res.json();
  if (!json || json.code !== 200 || !json.data) {
    throw new Error(`Invalid API response from ${url}`);
  }
  return json.data;
}

/**
 * Validates raw MP3Quran ayah-timing entries against expected Hafs verse count.
 * Any missing verse, reversed span, or mismatched total disables timing honestly
 * rather than cross-mapping or highlighting the wrong ayah.
 */
export function validateSurahTimings(
  rawEntries: unknown,
  expectedAyahCount: number,
  moshafId: number | null
): SurahTimingData {
  if (
    !moshafId ||
    !Array.isArray(rawEntries) ||
    !Number.isInteger(expectedAyahCount) ||
    expectedAyahCount <= 0
  ) {
    return { timingAvailable: false, moshafId: moshafId ?? null, segments: [] };
  }

  const byAyah = new Map<number, AyahTimingSegment>();
  for (const item of rawEntries as RawTimingEntry[]) {
    const ayah = Number(item?.ayah);
    const startTimeMs = Number(item?.start_time);
    const endTimeMs = Number(item?.end_time);

    if (
      Number.isInteger(ayah) &&
      ayah >= 1 &&
      ayah <= expectedAyahCount &&
      Number.isFinite(startTimeMs) &&
      Number.isFinite(endTimeMs) &&
      startTimeMs >= 0 &&
      endTimeMs > startTimeMs &&
      !byAyah.has(ayah)
    ) {
      byAyah.set(ayah, { ayah, startTimeMs, endTimeMs });
    }
  }

  if (byAyah.size !== expectedAyahCount) {
    return { timingAvailable: false, moshafId, segments: [] };
  }

  const segments: AyahTimingSegment[] = [];
  for (let i = 1; i <= expectedAyahCount; i += 1) {
    const seg = byAyah.get(i);
    if (!seg) {
      return { timingAvailable: false, moshafId, segments: [] };
    }
    segments.push(seg);
  }

  return {
    timingAvailable: true,
    moshafId,
    segments,
  };
}

export async function fetchSurahAyahTiming(
  timingMoshafId: number | null,
  surahNumber: number,
  expectedAyahCount: number,
  signal?: AbortSignal
): Promise<SurahTimingData> {
  if (!timingMoshafId) {
    return { timingAvailable: false, moshafId: null, segments: [] };
  }

  try {
    const res = await fetch(
      `${MP3QURAN_TIMING_BASE}?surah=${surahNumber}&read=${timingMoshafId}`,
      { signal }
    );
    if (!res.ok) {
      return { timingAvailable: false, moshafId: timingMoshafId, segments: [] };
    }
    const raw = await res.json();
    return validateSurahTimings(raw, expectedAyahCount, timingMoshafId);
  } catch (err: unknown) {
    if ((err as { name?: string })?.name === 'AbortError') throw err;
    return { timingAvailable: false, moshafId: timingMoshafId, segments: [] };
  }
}

export function findActiveAyahIndexByTime(
  segments: AyahTimingSegment[],
  currentTimeSeconds: number
): number | null {
  if (!segments.length || !Number.isFinite(currentTimeSeconds) || currentTimeSeconds < 0) {
    return null;
  }
  const currentMs = currentTimeSeconds * 1000;
  if (currentMs < segments[0].startTimeMs) {
    return null;
  }

  let low = 0;
  let high = segments.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    const seg = segments[mid];
    const isLast = mid === segments.length - 1;
    if (currentMs < seg.startTimeMs) {
      high = mid - 1;
    } else if (isLast ? currentMs > seg.endTimeMs + 4000 : currentMs >= seg.endTimeMs) {
      low = mid + 1;
    } else {
      return mid;
    }
  }
  return null;
}

export async function fetchAllSurahs(signal?: AbortSignal): Promise<SurahSummary[]> {
  return fetchJson(`${API_BASE}/surah`, signal);
}

/**
 * Fetches Surah Uthmani text (immutable from quran-uthmani), optional Tafsir Al-Muyassar,
 * verified full-surah MP3 URL, and optional reciter-specific ayah timing boundaries.
 */
export async function fetchSurahBundle(
  surahId: number | string,
  reciterId: string,
  signal?: AbortSignal
): Promise<SurahBundle> {
  const numericId = Number(surahId);
  if (!Number.isInteger(numericId) || numericId < 1 || numericId > 114) {
    throw new Error(`Invalid Surah number: ${surahId}`);
  }

  const reciter = getReciterById(reciterId);
  const surahAudioUrl = getSurahAudioUrl(reciter.id, numericId);
  if (!surahAudioUrl) {
    throw new Error(`No full-surah audio URL for reciter ${reciter.id}`);
  }

  const [uthmaniData, tafsirResult] = await Promise.all([
    fetchJson(`${API_BASE}/surah/${numericId}/quran-uthmani`, signal),
    fetchJson(`${API_BASE}/surah/${numericId}/ar.muyassar`, signal).catch(() => null),
  ]);

  const timingData = await fetchSurahAyahTiming(
    reciter.timingMoshafId ?? null,
    numericId,
    Array.isArray(uthmaniData?.ayahs) ? uthmaniData.ayahs.length : 0,
    signal
  );

  return {
    surahData: uthmaniData,
    tafsirData: tafsirResult,
    surahAudioUrl,
    playbackType: 'surahbysurah',
    timingData,
  };
}

export interface DailyAyahPayload {
  number: number;
  numberInSurah: number;
  text: string;
  surahAudioUrl: string;
  startTimeSeconds: number | null;
  endTimeSeconds: number | null;
  surah: SurahSummary;
}

export async function fetchDailyAyah(): Promise<DailyAyahPayload> {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const globalAyahNumber = ((dayOfYear * 17) % 6236) + 1;

  const textData = await fetchJson(`${API_BASE}/ayah/${globalAyahNumber}/quran-uthmani`);
  const surahNumber = Number(textData?.surah?.number) || 1;
  const numberOfAyahs = Number(textData?.surah?.numberOfAyahs) || 0;
  const surahAudioUrl = getSurahAudioUrl('ar.alafasy', surahNumber) || '';

  const timingData = await fetchSurahAyahTiming(123, surahNumber, numberOfAyahs).catch(() => ({
    timingAvailable: false,
    moshafId: 123,
    segments: [],
  }));
  const matchedSeg = timingData.segments.find((s) => s.ayah === textData.numberInSurah) || null;

  return {
    number: textData.number,
    numberInSurah: textData.numberInSurah,
    text: textData.text,
    surahAudioUrl,
    startTimeSeconds: matchedSeg ? matchedSeg.startTimeMs / 1000 : null,
    endTimeSeconds: matchedSeg ? matchedSeg.endTimeMs / 1000 : null,
    surah: textData.surah,
  };
}

export interface VerseSearchMatch {
  number: number;
  numberInSurah: number;
  text: string;
  surah: {
    number: number;
    name: string;
  };
}

export async function searchQuranVerses(
  query: string,
  signal?: AbortSignal
): Promise<VerseSearchMatch[]> {
  const normalized = normalizeArabic(query);
  if (normalized.length < 2) return [];

  try {
    const res = await fetch(
      `${API_BASE}/search/${encodeURIComponent(normalized)}/all/quran-simple-clean`,
      { signal }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (data?.code === 200 && Array.isArray(data?.data?.matches)) {
      return data.data.matches.slice(0, 15);
    }
    return [];
  } catch (err: unknown) {
    if ((err as { name?: string })?.name === 'AbortError') throw err;
    return [];
  }
}
