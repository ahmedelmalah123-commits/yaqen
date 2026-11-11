import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  fetchDailyAyah,
  fetchSurahBundle,
  findActiveAyahIndexByTime,
  validateSurahTimings,
} from '../src/features/quran/quranApi';
import {
  recitersData,
  normalizeReciterId,
  getSurahAudioUrl,
} from '../src/lib/data/recitersData';

describe('full-surah reciters, timing validation, and immutable Uthmani text contract', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('maps repaired legacy reciter IDs cleanly and uses full-surah CDN for all reciters', () => {
    expect(normalizeReciterId('ar.muhammadayyoob')).toBe('ar.muhammadayyoub');
    expect(normalizeReciterId('ar.khalefa')).toBe('ar.khalifaaltunaiji');
    expect(normalizeReciterId('nonexistent-reciter')).toBe('ar.alafasy');

    expect(recitersData.length).toBeGreaterThanOrEqual(18);
    for (const r of recitersData) {
      expect(r.playbackType).toBe('surahbysurah');
      const surah1 = getSurahAudioUrl(r.id, 1);
      const surah114 = getSurahAudioUrl(r.id, 114);
      expect(surah1).toMatch(/^https:\/\/cdn\.mp3quran\.net\/audio\/.+\/001\.mp3$/);
      expect(surah114).toMatch(/^https:\/\/cdn\.mp3quran\.net\/audio\/.+\/114\.mp3$/);
      expect(surah1).not.toContain('cdn.islamic.network/quran/audio/');
    }
    expect(getSurahAudioUrl('ar.alafasy', 0)).toBeNull();
    expect(getSurahAudioUrl('ar.alafasy', 115)).toBeNull();
  });

  it('keeps quran-uthmani text intact, never calls verse-by-verse audio API, and loads reciter timing when valid', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith('/surah/1/quran-uthmani')) {
        return new Response(
          JSON.stringify({
            code: 200,
            data: {
              number: 1,
              name: 'سُورَةُ ٱلْفَاتِحَةِ',
              englishName: 'Al-Faatiha',
              englishNameTranslation: 'The Opening',
              numberOfAyahs: 2,
              revelationType: 'Meccan',
              ayahs: [
                {
                  number: 1,
                  numberInSurah: 1,
                  text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
                  juz: 1,
                  manzil: 1,
                  page: 1,
                  ruku: 1,
                  hizbQuarter: 1,
                  sajda: false,
                },
                {
                  number: 2,
                  numberInSurah: 2,
                  text: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
                  juz: 1,
                  manzil: 1,
                  page: 1,
                  ruku: 1,
                  hizbQuarter: 1,
                  sajda: false,
                },
              ],
            },
          }),
          { status: 200 }
        );
      }
      if (url.endsWith('/surah/1/ar.muyassar')) {
        return new Response(
          JSON.stringify({
            code: 200,
            data: { ayahs: [{ numberInSurah: 1, text: 'تفسير الفاتحة' }] },
          }),
          { status: 200 }
        );
      }
      if (url.includes('mp3quran.net/api/v3/ayat_timing?surah=1&read=119')) {
        return new Response(
          JSON.stringify([
            { ayah: 1, start_time: 1000, end_time: 5000 },
            { ayah: 2, start_time: 5000, end_time: 10000 },
          ]),
          { status: 200 }
        );
      }
      throw new Error(`Unexpected URL fetched: ${url}`);
    });

    const bundle = await fetchSurahBundle(1, 'ar.hussary_mujawwad_rare');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(bundle.surahData.ayahs[0].text).toBe('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
    expect(bundle.tafsirData?.ayahs[0].text).toBe('تفسير الفاتحة');
    expect(bundle.playbackType).toBe('surahbysurah');
    expect(bundle.surahAudioUrl).toBe('https://cdn.mp3quran.net/audio/mahmoud-husary/r2/001.mp3');
    expect(bundle.timingData.timingAvailable).toBe(true);
    expect(bundle.timingData.segments).toHaveLength(2);
  });

  it('disables timing honestly when a reciter lacks timing metadata or API returns incomplete ayahs', async () => {
    const missingTiming = validateSurahTimings([{ ayah: 1, start_time: 0, end_time: 2000 }], 7, 118);
    expect(missingTiming.timingAvailable).toBe(false);
    expect(missingTiming.segments).toHaveLength(0);

    const brokenSpan = validateSurahTimings([{ ayah: 1, start_time: 5000, end_time: 5000 }], 1, 123);
    expect(brokenSpan.timingAvailable).toBe(false);

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith('/surah/18/quran-uthmani')) {
        return new Response(
          JSON.stringify({
            code: 200,
            data: {
              number: 18,
              name: 'سُورَةُ الْكَهْفِ',
              englishName: 'Al-Kahf',
              englishNameTranslation: 'The Cave',
              numberOfAyahs: 1,
              revelationType: 'Meccan',
              ayahs: [
                {
                  number: 2141,
                  numberInSurah: 1,
                  text: 'ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ',
                  juz: 15,
                  manzil: 4,
                  page: 293,
                  ruku: 25,
                  hizbQuarter: 117,
                  sajda: false,
                },
              ],
            },
          }),
          { status: 200 }
        );
      }
      if (url.endsWith('/surah/18/ar.muyassar')) {
        return new Response(JSON.stringify({ code: 200, data: { ayahs: [] } }), { status: 200 });
      }
      throw new Error(`Should NOT fetch timing for untimed reciter: ${url}`);
    });

    const bundle = await fetchSurahBundle(18, 'ar.mahermuaiqly');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(bundle.surahAudioUrl).toBe('https://cdn.mp3quran.net/audio/maher-muaiqly/r1/018.mp3');
    expect(bundle.timingData.timingAvailable).toBe(false);
  });

  it('finds exact active ayah index from playback seconds without cross-mapping intro silence', () => {
    const segments = [
      { ayah: 1, startTimeMs: 2500, endTimeMs: 7000 },
      { ayah: 2, startTimeMs: 7000, endTimeMs: 13000 },
      { ayah: 3, startTimeMs: 13000, endTimeMs: 19000 },
    ];
    expect(findActiveAyahIndexByTime(segments, 1.0)).toBeNull();
    expect(findActiveAyahIndexByTime(segments, 2.5)).toBe(0);
    expect(findActiveAyahIndexByTime(segments, 6.99)).toBe(0);
    expect(findActiveAyahIndexByTime(segments, 7.0)).toBe(1);
    expect(findActiveAyahIndexByTime(segments, 15.2)).toBe(2);
  });

  it('loads daily ayah audio using full-surah URL and timing bounds instead of single-ayah endpoints', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes('/ayah/') && url.endsWith('/quran-uthmani')) {
        return new Response(
          JSON.stringify({
            code: 200,
            data: {
              number: 1,
              numberInSurah: 1,
              text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
              surah: {
                number: 1,
                name: 'سُورَةُ ٱلْفَاتِحَةِ',
                englishName: 'Al-Faatiha',
                englishNameTranslation: 'The Opening',
                numberOfAyahs: 1,
                revelationType: 'Meccan',
              },
            },
          }),
          { status: 200 }
        );
      }
      if (url.includes('mp3quran.net/api/v3/ayat_timing?surah=1&read=123')) {
        return new Response(JSON.stringify([{ ayah: 1, start_time: 1200, end_time: 4800 }]), {
          status: 200,
        });
      }
      throw new Error(`Unexpected URL fetched: ${url}`);
    });

    const daily = await fetchDailyAyah();
    expect(daily.surahAudioUrl).toBe('https://cdn.mp3quran.net/audio/mishary-alafasy/r1/001.mp3');
    expect(daily.startTimeSeconds).toBe(1.2);
    expect(daily.endTimeSeconds).toBe(4.8);
  });
});
