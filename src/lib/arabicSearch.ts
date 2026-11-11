const DIACRITICS_AND_MARKS_REGEX =
  /[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06ED\uFEFF]/g;

const ARABIC_INDIC_DIGITS: Record<string, string> = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
};

/**
 * Normalizes Arabic text for accent-insensitive search across Uthmani and simple scripts.
 */
export function normalizeArabic(input = ''): string {
  if (!input) return '';

  return String(input)
    .replace(DIACRITICS_AND_MARKS_REGEX, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ىئ]/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ة/g, 'ه')
    .replace(/[٠-٩۰-۹]/g, (digit) => ARABIC_INDIC_DIGITS[digit] || digit)
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Strips leading "سورة" / "سُورَةُ" labels so UI typography remains consistent.
 */
export function stripSurahPrefix(name = ''): string {
  return String(name)
    .replace(/\uFEFF/g, '')
    .replace(/^س[\u064B-\u065F\u0670]*و[\u064B-\u065F\u0670]*ر[\u064B-\u065F\u0670]*[ةه][\u064B-\u065F\u0670]*\s*/u, '')
    .trim();
}

/**
 * Returns true if `target` contains `query` after full Arabic normalization.
 */
export function matchesNormalized(target: string, query: string): boolean {
  const cleanQuery = normalizeArabic(query);
  if (!cleanQuery) return true;
  return normalizeArabic(target).includes(cleanQuery);
}

/**
 * Formats a number in Eastern Arabic digits for localized UI display.
 */
export function toArabicDigits(value: number | string): string {
  const num = Number(value);
  if (Number.isFinite(num)) {
    return num.toLocaleString('ar-EG');
  }
  return String(value);
}

/**
 * Safely removes the opening Bismillah prepended to ayah 1 in Uthmani API payloads
 * (except Surah 1 where Bismillah IS ayah 1, and Surah 9 which has no Bismillah).
 * Handles BOM, Alef-Wasl (ٱ), tatweel, dagger alef, and all diacritic variants.
 */
export function stripBismillah(
  text = '',
  surahNumber: number,
  isFirstAyah: boolean
): string {
  if (!text) return '';
  if (!isFirstAyah || Number(surahNumber) === 1 || Number(surahNumber) === 9) {
    return text.replace(/^\uFEFF/, '').trim();
  }

  const raw = text.replace(/^\uFEFF/, '').trimStart();

  // Build normalized string alongside end-indices back into `raw` so any diacritic/tatweel
  // spelling of "بسم الله الرحمن الرحيم" strips precisely before the verse text begins.
  const normChars: string[] = [];
  const endIndices: number[] = [];

  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    if (/[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06ED\uFEFF]/.test(ch)) {
      if (endIndices.length > 0) {
        endIndices[endIndices.length - 1] = i + 1;
      }
      continue;
    }

    let mapped = ch;
    if (/[أإآٱ]/.test(ch)) mapped = 'ا';
    else if (/[ىئ]/.test(ch)) mapped = 'ي';
    else if (ch === 'ة') mapped = 'ه';
    else if (/\s/.test(ch)) mapped = ' ';

    if (mapped === ' ' && normChars[normChars.length - 1] === ' ') {
      endIndices[endIndices.length - 1] = i + 1;
      continue;
    }

    normChars.push(mapped);
    endIndices.push(i + 1);
  }

  const normalized = normChars.join('');
  const bismillahVariants = [
    'بسم الله الرحمن الرحيم',
    'بسم الله الرحمان الرحيم',
  ];

  for (const variant of bismillahVariants) {
    if (normalized === variant) {
      return '';
    }
    if (normalized.startsWith(`${variant} `)) {
      const cutPos = endIndices[variant.length - 1] ?? 0;
      return raw.slice(cutPos).trim();
    }
  }

  return raw;
}

