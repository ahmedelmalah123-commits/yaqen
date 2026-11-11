import { describe, it, expect } from 'vitest';
import {
  normalizeArabic,
  matchesNormalized,
  stripBismillah,
  stripSurahPrefix,
} from '../src/lib/arabicSearch';

describe('arabicSearch utilities', () => {
  it('strips diacritics and normalizes alef, ya, ta marbuta, and digits', () => {
    expect(normalizeArabic('سُورَةُ الْبَقَرَةِ')).toBe('سوره البقره');
    expect(normalizeArabic('آلِ عِمْرَانَ')).toBe('ال عمران');
    expect(normalizeArabic('إِيَّاكَ نَعْبُدُ ٢')).toBe('اياك نعبد 2');
  });

  it('matches Uthmani Surah names against un-diacriticized user search queries', () => {
    expect(matchesNormalized('سُورَةُ ٱلْبَقَرَةِ', 'البقره')).toBe(true);
    expect(matchesNormalized('سُورَةُ آلِ عِمْرَانَ', 'ال عمران')).toBe(true);
    expect(matchesNormalized('سُورَةُ يُوسُفَ', 'يوسف')).toBe(true);
    expect(matchesNormalized('سُورَةُ يُوسُفَ', 'مريم')).toBe(false);
  });

  it('strips leading Surah label cleanly across Tashkeel variants', () => {
    expect(stripSurahPrefix('سُورَةُ الفَاتِحَةِ')).toBe('الفَاتِحَةِ');
    expect(stripSurahPrefix('سورة البقرة')).toBe('البقرة');
  });

  it('preserves Surah 1 and Surah 9 Ayah 1 while stripping Bismillah variants in other Surahs', () => {
    const fatiha1 = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
    expect(stripBismillah(fatiha1, 1, true)).toBe(fatiha1);

    const tawbah1 = 'بَرَآءَةٌ مِّنَ ٱللَّهِ وَرَسُولِهِ';
    expect(stripBismillah(tawbah1, 9, true)).toBe(tawbah1);

    const baqarah1WithBomAndTatweel =
      '\uFEFFبِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ الٓمٓ';
    expect(stripBismillah(baqarah1WithBomAndTatweel, 2, true)).toBe('الٓمٓ');
    expect(stripBismillah('ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ', 2, false)).toBe(
      'ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ'
    );
  });
});

