/**
 * src/lib/constants.js
 * Core constants including reciters, playlists, and configuration
 */

// ─── RECITERS ────────────────────────────────────────────────

export const RECITERS = [
  {
    id: 'ar.alafasy',
    name: 'Mishary Alafasy',
    nameArabic: 'مشاري راشد العفاسي',
    style: 'murattal',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/',
  },
  {
    id: 'ar.abdurrahmaansudais',
    name: 'Abdurrahmaan As-Sudais',
    nameArabic: 'عبدالرحمن السديس',
    style: 'murattal',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/',
  },
  {
    id: 'ar.minshawi',
    name: 'Mohamed Siddiq Al-Minshawi',
    nameArabic: 'محمد صديق المنشاوي',
    style: 'murattal',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.minshawi/',
  },
  {
    id: 'ar.husary',
    name: 'Mahmoud Khalil Al-Husary',
    nameArabic: 'محمود خليل الحصري',
    style: 'murattal',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.husary/',
  },
  {
    id: 'ar.maher',
    name: 'Maher Al Muaiqly',
    nameArabic: 'ماهر المعيقلي',
    style: 'murattal',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.maher/',
  },
  {
    id: 'ar.parhizgar',
    name: 'Hossein Parhizgar',
    nameArabic: 'حسين پرهیزگار',
    style: 'murattal',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.parhizgar/',
  },
];

// ─── PLAYLISTS ───────────────────────────────────────────────

export const PLAYLISTS = [
  {
    id: 'study',
    title: 'Quran for Study',
    titleArabic: 'للدراسة والتركيز',
    type: 'study',
    surahIds: [2, 18, 55, 56, 67, 78],
    icon: '📚',
  },
  {
    id: 'sleep',
    title: 'Quran for Sleep',
    titleArabic: 'للنوم والراحة',
    type: 'sleep',
    surahIds: [1, 2, 3, 112, 113, 114],
    icon: '🌙',
  },
  {
    id: 'work',
    title: 'Quran for Work',
    titleArabic: 'للعمل والإنتاجية',
    type: 'work',
    surahIds: [20, 28, 29, 39],
    icon: '⚡',
  },
];

// ─── FONT SIZE CLASSES ───────────────────────────────────────

export const FONT_SIZE_CLASSES = {
  sm: 'text-quran-sm',
  md: 'text-quran-md',
  lg: 'text-quran-lg',
  xl: 'text-quran-xl',
};

// ─── DEFAULT PLAYER STATE ────────────────────────────────────

export const DEFAULT_PLAYER_STATE = {
  isPlaying: false,
  currentSurahId: null,
  currentAyahId: null,
  currentReciterId: 'ar.alafasy',
  progress: 0,
  duration: 0,
  currentTime: 0,
  volume: 0.8,
  repeatMode: 'none', // 'none' | 'all' | 'one'
  isShuffle: false,
  isLoading: false,
  error: null,
};

// ─── DEFAULT SETTINGS ────────────────────────────────────────

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  language: 'en',
  lastSurahId: 1,
  lastAyahId: 1,
  lastReciterId: 'ar.alafasy',
  bookmarks: [],
  readingSettings: {
    fontSize: 'md',
    showTranslation: true,
    showTransliteration: false,
    readingMode: 'continuous',
    nightMode: false,
  },
};

// ─── API CONFIGURATION ───────────────────────────────────────

export const API_BASE = 'https://api.alquran.cloud/v1';

// ─── STORAGE KEYS ────────────────────────────────────────────

export const STORAGE_KEY_SETTINGS = 'yaaqeen_settings';
