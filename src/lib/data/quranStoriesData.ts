export type StoryCategoryId = 'human' | 'women' | 'animals';

export interface StoryCategoryMeta {
  id: StoryCategoryId;
  label: string;
  description: string;
  count: number;
}

export interface QuranStoryEpisode {
  id: string;
  position: number;
  videoId: string;
  category: StoryCategoryId;
  categoryLabel: string;
  episodeNumber: number;
  title: string;
  rawTitle: string;
  duration: string;
  channel: string;
}

export const QURAN_STORIES_PLAYLIST = {
  id: 'PLSDc2nCH-1IJ5B50itQixOFNYGGhephu8',
  url: 'https://www.youtube.com/playlist?list=PLSDc2nCH-1IJ5B50itQixOFNYGGhephu8',
  title: 'مسلسل قصص الانسان و النساء و الحيوان في القرآن',
  channel: 'Cedars Art Production',
  totalVideos: 88,
} as const;

export const STORY_CATEGORIES: StoryCategoryMeta[] = [
  {
    id: 'human',
    label: 'قصص الإنسان في القرآن',
    description: 'حلقات قصص الإنسان في القرآن المتوفرة في القائمة الرسمية (الحلقات ١–٢٧ و٣٠)',
    count: 28,
  },
  {
    id: 'women',
    label: 'قصص النساء في القرآن',
    description: 'سير ومواقف النساء الصالحات والقصص القرآنية المرتبطة بهن',
    count: 30,
  },
  {
    id: 'animals',
    label: 'قصص الحيوان في القرآن',
    description: 'قصص المخلوقات والحيوانات التي ورد ذكرها وعبرتها في القرآن الكريم',
    count: 30,
  },
];

export const quranStoriesData: QuranStoryEpisode[] = [
  {
    "id": "human-1",
    "position": 1,
    "videoId": "fyHqHof8-xU",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 1,
    "title": "أصحاب الأخدود - ج 1",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 1 | أصحاب الأخدود - ج 1 | Human Stories from Qur'an",
    "duration": "18:09",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-2",
    "position": 2,
    "videoId": "qE48KorARKA",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 2,
    "title": "أصحاب الأخدود - ج 2",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 2 | أصحاب الأخدود - ج 2 | Human Stories from Qur'an",
    "duration": "16:29",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-3",
    "position": 3,
    "videoId": "nfMyHAHJBA8",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 3,
    "title": "أصحاب الأخدود - ج 3",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 3 | أصحاب الأخدود - ج 3 | Human Stories from Qur'an",
    "duration": "16:34",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-4",
    "position": 4,
    "videoId": "lNH895SAgfE",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 4,
    "title": "طالوت و جالوت - ج 1",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 4 | طالوت و جالوت - ج 1 | Human Stories from Qur'an",
    "duration": "17:12",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-5",
    "position": 5,
    "videoId": "7auvxwMN2KU",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 5,
    "title": "طالوت و جالوت - ج 2",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 5 | طالوت و جالوت - ج 2 | Human Stories from Qur'an",
    "duration": "17:39",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-6",
    "position": 6,
    "videoId": "znWXjMQZb58",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 6,
    "title": "طالوت و جالوت - ج 3",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 6 | طالوت و جالوت - ج 3 | Human Stories from Qur'an",
    "duration": "15:50",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-7",
    "position": 7,
    "videoId": "vuYGxD6Pl6c",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 7,
    "title": "قارون - ج 1",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 7 | قارون - ج 1 | Human Stories from Qur'an",
    "duration": "17:19",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-8",
    "position": 8,
    "videoId": "3itHU26w92o",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 8,
    "title": "قارون - ج 2",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 8 | قارون - ج 2 | Human Stories from Qur'an",
    "duration": "17:42",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-9",
    "position": 9,
    "videoId": "O1x4q3s_77U",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 9,
    "title": "قارون - ج 3",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 9 | قارون - ج 3 | Human Stories from Qur'an",
    "duration": "17:41",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-10",
    "position": 10,
    "videoId": "hvm2ThLwYko",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 10,
    "title": "ذو القرنين - ج 1",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 10 | ذو القرنين - ج 1 | Human Stories from Qur'an",
    "duration": "17:55",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-11",
    "position": 11,
    "videoId": "kCImYSW49u0",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 11,
    "title": "ذو القرنين - ج 2",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 11 | ذو القرنين - ج 2 | Human Stories from Qur'an",
    "duration": "15:52",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-12",
    "position": 12,
    "videoId": "xx3nficBU2A",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 12,
    "title": "ذو القرنين - ج 3",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 12 | ذو القرنين - ج 3 | Human Stories from Qur'an",
    "duration": "16:46",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-13",
    "position": 13,
    "videoId": "vuW3VAZ2VP8",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 13,
    "title": "أصحاب الجنة - ج 1",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 13 | أصحاب الجنة - ج 1 | Human Stories from Qur'an",
    "duration": "16:34",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-14",
    "position": 14,
    "videoId": "XAWA1LQESWE",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 14,
    "title": "أصحاب الجنة - ج 2",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 14 | أصحاب الجنة - ج 2 | Human Stories from Qur'an",
    "duration": "15:36",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-15",
    "position": 15,
    "videoId": "Gt15cpRQ9iI",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 15,
    "title": "أصحاب الجنة - ج 3",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 15 | أصحاب الجنة - ج 3 | Human Stories from Qur'an",
    "duration": "16:07",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-16",
    "position": 16,
    "videoId": "As53yjPktJ4",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 16,
    "title": "سيدنا الخضر - ج 1",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 16 | سيدنا الخضر - ج 1 | Human Stories from Qur'an",
    "duration": "16:36",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-17",
    "position": 17,
    "videoId": "WQebE2gulSc",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 17,
    "title": "سيدنا الخضر - ج 2",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 17 | سيدنا الخضر - ج 2 | Human Stories from Qur'an",
    "duration": "16:08",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-18",
    "position": 18,
    "videoId": "mLL3xflXIH4",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 18,
    "title": "سيدنا الخضر - ج 3",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 18 | سيدنا الخضر - ج 3 | Human Stories from Qur'an",
    "duration": "17:17",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-19",
    "position": 19,
    "videoId": "qrygFOLd1Os",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 19,
    "title": "سيدنا الخضر - ج 4",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 19 | سيدنا الخضر - ج 4 | Human Stories from Qur'an",
    "duration": "17:04",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-20",
    "position": 20,
    "videoId": "QYbMumxH_ww",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 20,
    "title": "السيل العرم - ج 1",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 20 | السيل العرم - ج 1 | Human Stories from Qur'an",
    "duration": "15:42",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-21",
    "position": 21,
    "videoId": "2TTi4-jyTCo",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 21,
    "title": "السيل العرم - ج 2",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 21 | السيل العرم - ج 2 | Human Stories from Qur'an",
    "duration": "16:56",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-22",
    "position": 22,
    "videoId": "chmon0iDhWQ",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 22,
    "title": "السيل العرم - ج 3",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 22 | السيل العرم - ج 3 | Human Stories from Qur'an",
    "duration": "16:46",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-23",
    "position": 23,
    "videoId": "SsfRswwXEhw",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 23,
    "title": "السامري - ج 1",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 23 | السامري - ج 1 | Human Stories from Qur'an",
    "duration": "17:25",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-24",
    "position": 24,
    "videoId": "InmLzPOjz5E",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 24,
    "title": "السامري - ج 2",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 24 | السامري - ج 2 | Human Stories from Qur'an",
    "duration": "17:24",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-25",
    "position": 25,
    "videoId": "qGXSkwdVReg",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 25,
    "title": "السامري - ج 3",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 25 | السامري - ج 3 | Human Stories from Qur'an",
    "duration": "16:44",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-26",
    "position": 26,
    "videoId": "Vd-hP23O3sU",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 26,
    "title": "النمرود - ج 1",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 26 | النمرود - ج 1 | Human Stories from Qur'an",
    "duration": "16:28",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-27",
    "position": 27,
    "videoId": "aebLGAcdsKE",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 27,
    "title": "النمرود - ج 2",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 27 | النمرود - ج 2 | Human Stories from Qur'an",
    "duration": "16:06",
    "channel": "Cedars Art Production"
  },
  {
    "id": "human-30",
    "position": 28,
    "videoId": "761vFLTVL5U",
    "category": "human",
    "categoryLabel": "قصص الإنسان في القرآن",
    "episodeNumber": 30,
    "title": "صاحب الجنتين - ج 3",
    "rawTitle": "قصص الإنسان في القرآن | الحلقة 30 | صاحب الجنتين - ج 3 | Human Stories from Qur'an",
    "duration": "16:17",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-1",
    "position": 29,
    "videoId": "hV42DbzZzx4",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 1,
    "title": "السيدة حواء أم البشر - ج 1",
    "rawTitle": "قصص النساء في القرآن | الحلقة 1 | السيدة حواء أم البشر - ج 1 | Women Stories from Qur'an",
    "duration": "18:14",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-2",
    "position": 30,
    "videoId": "w6wKvn0a2JE",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 2,
    "title": "السيدة حواء أم البشر - ج 2",
    "rawTitle": "قصص النساء في القرآن | الحلقة 2 | السيدة حواء أم البشر - ج 2 | Women Stories from Qur'an",
    "duration": "15:28",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-3",
    "position": 31,
    "videoId": "S-R2fGn1MJU",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 3,
    "title": "امرأة نوح - ج 1",
    "rawTitle": "قصص النساء في القرآن | الحلقة 3 | امرأة نوح - ج 1 | Women Stories from Qur'an",
    "duration": "15:37",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-4",
    "position": 32,
    "videoId": "-7c-BcEDevk",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 4,
    "title": "امرأة نوح - ج 2",
    "rawTitle": "قصص النساء في القرآن | الحلقة 4 | امرأة نوح - ج 2 | Women Stories from Qur'an",
    "duration": "15:25",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-5",
    "position": 33,
    "videoId": "iqB6Lz-PIKU",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 5,
    "title": "امرأة نوح - ج 3",
    "rawTitle": "قصص النساء في القرآن | الحلقة 5 | امرأة نوح - ج 3 | Women Stories from Qur'an",
    "duration": "16:33",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-6",
    "position": 34,
    "videoId": "6vrJZPZIz20",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 6,
    "title": "امرأة فرعون - ج 1",
    "rawTitle": "قصص النساء في القرآن | الحلقة 6 | امرأة فرعون - ج 1 | Women Stories from Qur'an",
    "duration": "17:28",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-7",
    "position": 35,
    "videoId": "TUICVcFMd_E",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 7,
    "title": "امرأة فرعون - ج 2",
    "rawTitle": "قصص النساء في القرآن | الحلقة 7 | امرأة فرعون - ج 2 | Women Stories from Qur'an",
    "duration": "17:43",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-8",
    "position": 36,
    "videoId": "wKCDFGm_F1c",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 8,
    "title": "امرأة فرعون - ج 3",
    "rawTitle": "قصص النساء في القرآن | الحلقة 8 |  امرأة فرعون - ج 3 | Women Stories from Qur'an",
    "duration": "15:17",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-9",
    "position": 37,
    "videoId": "3fgk9Cnxuks",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 9,
    "title": "امرأة فرعون - ج 4",
    "rawTitle": "قصص النساء في القرآن | الحلقة 9 |  امرأة فرعون - ج 4 | Women Stories from Qur'an",
    "duration": "15:58",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-10",
    "position": 38,
    "videoId": "JjILh2FJSp8",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 10,
    "title": "امرأة فرعون - ج 5",
    "rawTitle": "قصص النساء في القرآن | الحلقة 10 |  امرأة فرعون - ج 5 | Women Stories from Qur'an",
    "duration": "17:12",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-11",
    "position": 39,
    "videoId": "t1EDMEFFj9w",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 11,
    "title": "امرأة العزيز - ج 1",
    "rawTitle": "قصص النساء في القرآن | الحلقة 11 |  امرأة العزيز - ج 1 | Women Stories from Qur'an",
    "duration": "15:30",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-12",
    "position": 40,
    "videoId": "Fby1DMJFKA8",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 12,
    "title": "امرأة العزيز - ج 2",
    "rawTitle": "قصص النساء في القرآن | الحلقة 12 |  امرأة العزيز - ج 2 | Women Stories from Qur'an",
    "duration": "17:00",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-13",
    "position": 41,
    "videoId": "g9Ui8U2vo1o",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 13,
    "title": "امرأة العزيز - ج 3",
    "rawTitle": "قصص النساء في القرآن | الحلقة 13 |  امرأة العزيز - ج 3 | Women Stories from Qur'an",
    "duration": "16:31",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-14",
    "position": 42,
    "videoId": "yehr4coJCZQ",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 14,
    "title": "امرأة العزيز - ج 4",
    "rawTitle": "قصص النساء في القرآن | الحلقة 14 | امرأة العزيز - ج 4 | Women Stories from Qur'an",
    "duration": "15:38",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-15",
    "position": 43,
    "videoId": "AZaEKa9Inao",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 15,
    "title": "السيدتان سارة و هاجر - ج 1",
    "rawTitle": "قصص النساء في القرآن | الحلقة 15 | السيدتان سارة و هاجر - ج 1 | Women Stories from Qur'an",
    "duration": "15:31",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-16",
    "position": 44,
    "videoId": "plQZMPpPphc",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 16,
    "title": "السيدتان سارة و هاجر - ج 2",
    "rawTitle": "قصص النساء في القرآن | الحلقة 16 | السيدتان سارة و هاجر - ج 2 | Women Stories from Qur'an",
    "duration": "15:29",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-17",
    "position": 45,
    "videoId": "k_Z8Gm37_IQ",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 17,
    "title": "السيدتان سارة و هاجر - ج 3",
    "rawTitle": "قصص النساء في القرآن | الحلقة 17 | السيدتان سارة و هاجر - ج 3 | Women Stories from Qur'an",
    "duration": "15:57",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-18",
    "position": 46,
    "videoId": "8hJFlaH2gCs",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 18,
    "title": "السيدة مريم - ج 1",
    "rawTitle": "قصص النساء في القرآن | الحلقة 18 | السيدة مريم - ج 1 | Women Stories from Qur'an",
    "duration": "17:02",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-19",
    "position": 47,
    "videoId": "CXfkG3FlVIA",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 19,
    "title": "السيدة مريم - ج 2",
    "rawTitle": "قصص النساء في القرآن | الحلقة 19 | السيدة مريم - ج 2 | Women Stories from Qur'an",
    "duration": "16:11",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-20",
    "position": 48,
    "videoId": "6VCRX9TGI1U",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 20,
    "title": "السيدة مريم - ج 3",
    "rawTitle": "قصص النساء في القرآن | الحلقة 20 | السيدة مريم - ج 3 | Women Stories from Qur'an",
    "duration": "14:38",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-21",
    "position": 49,
    "videoId": "kyIVDxZTJc8",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 21,
    "title": "زوجة أيوب - ج 1",
    "rawTitle": "قصص النساء في القرآن | الحلقة 21 | زوجة أيوب - ج 1 | Women Stories from Qur'an",
    "duration": "15:26",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-22",
    "position": 50,
    "videoId": "b68y_C3Wr34",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 22,
    "title": "زوجة أيوب - ج 2",
    "rawTitle": "قصص النساء في القرآن | الحلقة 22 | زوجة أيوب - ج 2 | Women Stories from Qur'an",
    "duration": "16:22",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-23",
    "position": 51,
    "videoId": "ruwwGKvHbrQ",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 23,
    "title": "زوجة أيوب - ج 3",
    "rawTitle": "قصص النساء في القرآن | الحلقة 23 | زوجة أيوب - ج 3 | Women Stories from Qur'an",
    "duration": "15:41",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-24",
    "position": 52,
    "videoId": "Mxrf_aEJ-Dg",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 24,
    "title": "الملكة بلقيس - ج 1",
    "rawTitle": "قصص النساء في القرآن | الحلقة 24 | الملكة بلقيس - ج 1 | Women Stories from Qur'an",
    "duration": "15:36",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-25",
    "position": 53,
    "videoId": "Z8lx_AW3zeQ",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 25,
    "title": "الملكة بلقيس - ج 2",
    "rawTitle": "قصص النساء في القرآن | الحلقة 25 | الملكة بلقيس - ج 2 | Women Stories from Qur'an",
    "duration": "15:45",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-26",
    "position": 54,
    "videoId": "Mo2_29jw1ys",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 26,
    "title": "الملكة بلقيس - ج 3",
    "rawTitle": "قصص النساء في القرآن | الحلقة 26 | الملكة بلقيس - ج 3 | Women Stories from Qur'an",
    "duration": "14:18",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-27",
    "position": 55,
    "videoId": "E_0hkXU2PlQ",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 27,
    "title": "أم عمار",
    "rawTitle": "قصص النساء في القرآن | الحلقة 27 |  أم عمار  | Women Stories from Qur'an",
    "duration": "16:32",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-28",
    "position": 56,
    "videoId": "nNwhC3TNQuE",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 28,
    "title": "أم جميل - ج 1",
    "rawTitle": "قصص النساء في القرآن | الحلقة 28 |  أم جميل - ج 1 | Women Stories from Qur'an",
    "duration": "16:43",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-29",
    "position": 57,
    "videoId": "Ir3iI9PDBBU",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 29,
    "title": "أم كلثوم بنت عقبة",
    "rawTitle": "قصص النساء في القرآن | الحلقة 29 |  أم كلثوم بنت عقبة | Women Stories from Qur'an",
    "duration": "17:15",
    "channel": "Cedars Art Production"
  },
  {
    "id": "women-30",
    "position": 58,
    "videoId": "486Ktw0aXNA",
    "category": "women",
    "categoryLabel": "قصص النساء في القرآن",
    "episodeNumber": 30,
    "title": "أم جميل - ج 2",
    "rawTitle": "قصص النساء في القرآن | الحلقة 30 |  أم جميل - ج 2 | Women Stories from Qur'an",
    "duration": "17:46",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-1",
    "position": 59,
    "videoId": "eHobRabok1s",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 1,
    "title": "غراب إبني آدم - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 1 | غراب إبني آدم - ج 1 | Animal Stories from Qur'an",
    "duration": "16:00",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-2",
    "position": 60,
    "videoId": "0tvHdjWTGWs",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 2,
    "title": "غراب إبني آدم - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 2 | غراب إبني آدم - ج 2 | Animal Stories from Qur'an",
    "duration": "15:20",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-3",
    "position": 61,
    "videoId": "GYFcer3L6xI",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 3,
    "title": "ناقة صالح - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 3 | ناقة صالح - ج 1 | Animal Stories from Qur'an",
    "duration": "16:21",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-4",
    "position": 62,
    "videoId": "zIQF6uu1TVs",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 4,
    "title": "ناقة صالح - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 4 | ناقة صالح - ج 2 | Animal Stories from Qur'an",
    "duration": "16:19",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-5",
    "position": 63,
    "videoId": "FIjBpbQRj4E",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 5,
    "title": "طير إبراهيم - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 5 | طير إبراهيم - ج 1 | Animal Stories from Qur'an",
    "duration": "16:06",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-6",
    "position": 64,
    "videoId": "ux92Uvhkp50",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 6,
    "title": "طير إبراهيم - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 6 | طير إبراهيم - ج 2 | Animal Stories from Qur'an",
    "duration": "15:31",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-7",
    "position": 65,
    "videoId": "4I3XHnmiiR8",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 7,
    "title": "ذئب يوسف - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 7 | ذئب يوسف - ج 1 | Animal Stories from Qur'an",
    "duration": "16:44",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-8",
    "position": 66,
    "videoId": "YAK_-ohIANw",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 8,
    "title": "ذئب يوسف - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 8 | ذئب يوسف - ج 2 | Animal Stories from Qur'an",
    "duration": "15:51",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-9",
    "position": 67,
    "videoId": "DoicNhn4LwQ",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 9,
    "title": "حوت يونس - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 9 | حوت يونس - ج 1 | Animal Stories from Qur'an",
    "duration": "17:01",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-10",
    "position": 68,
    "videoId": "mkoiVGj9MNo",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 10,
    "title": "حوت يونس - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 10 | حوت يونس - ج 2 | Animal Stories from Qur'an",
    "duration": "15:41",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-11",
    "position": 69,
    "videoId": "y-fNmcDWMB0",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 11,
    "title": "عصا موسى - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 11 | عصا موسى - ج 1 | Animal Stories from Qur'an",
    "duration": "16:08",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-12",
    "position": 70,
    "videoId": "-oKiaqJw26s",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 12,
    "title": "عصا موسى - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 12 | عصا موسى - ج 2 | Animal Stories from Qur'an",
    "duration": "15:46",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-13",
    "position": 71,
    "videoId": "Zg5tVydlcvs",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 13,
    "title": "عصا موسى - ج 3",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 13 | عصا موسى - ج 3 | Animal Stories from Qur'an",
    "duration": "16:06",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-14",
    "position": 72,
    "videoId": "YN0eb-uYtAk",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 14,
    "title": "بقرة بني إسرائيل - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 14 | بقرة بني إسرائيل - ج 1 | Animal Stories from Qur'an",
    "duration": "16:20",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-15",
    "position": 73,
    "videoId": "J3CJr7Q3LNk",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 15,
    "title": "بقرة بني إسرائيل - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 15 | بقرة بني إسرائيل - ج 2 | Animal Stories from Qur'an",
    "duration": "15:45",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-16",
    "position": 74,
    "videoId": "U7_SP0FZgCI",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 16,
    "title": "أصحاب السبت - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 16 | أصحاب السبت - ج 1 | Animal Stories from Qur'an",
    "duration": "16:19",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-17",
    "position": 75,
    "videoId": "9DygjLUrdtQ",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 17,
    "title": "أصحاب السبت - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 17 | أصحاب السبت - ج 2 | Animal Stories from Qur'an",
    "duration": "15:56",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-18",
    "position": 76,
    "videoId": "ikuY5Gqd4IU",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 18,
    "title": "نملة سليمان - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 18 | نملة سليمان - ج 1 | Animal Stories from Qur'an",
    "duration": "16:03",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-19",
    "position": 77,
    "videoId": "tm_HRvnML-I",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 19,
    "title": "نملة سليمان - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 19 | نملة سليمان - ج 2 | Animal Stories from Qur'an",
    "duration": "15:48",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-20",
    "position": 78,
    "videoId": "WEghztqDd2M",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 20,
    "title": "هدهد سليمان - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 20 | هدهد سليمان - ج 1 | Animal Stories from Qur'an",
    "duration": "15:49",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-21",
    "position": 79,
    "videoId": "Z7HnjOxMhP8",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 21,
    "title": "هدهد سليمان - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 21 | هدهد سليمان - ج 2 | Animal Stories from Qur'an",
    "duration": "15:51",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-22",
    "position": 80,
    "videoId": "T4AFzGfc8rI",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 22,
    "title": "دابة الأرض",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 22 |  دابة الأرض  | Animal Stories from Qur'an",
    "duration": "16:58",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-23",
    "position": 81,
    "videoId": "zuh9j-rFQnc",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 23,
    "title": "حمار العزير - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 23 | حمار العزير - ج 1 | Animal Stories from Qur'an",
    "duration": "17:40",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-24",
    "position": 82,
    "videoId": "fblcwbZk9-0",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 24,
    "title": "حمار العزير - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 24 | حمار العزير - ج 2 | Animal Stories from Qur'an",
    "duration": "17:05",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-25",
    "position": 83,
    "videoId": "jqMI267IRpQ",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 25,
    "title": "كلب أهل الكهف - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 25 | كلب أهل الكهف - ج 1 | Animal Stories from Qur'an",
    "duration": "17:11",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-26",
    "position": 84,
    "videoId": "Gmf7xQK71MY",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 26,
    "title": "كلب أهل الكهف - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 26 | كلب أهل الكهف - ج 2 | Animal Stories from Qur'an",
    "duration": "16:38",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-27",
    "position": 85,
    "videoId": "ciigEKzya1w",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 27,
    "title": "طين عيسى",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 27 | طين عيسى  | Animal Stories from Qur'an",
    "duration": "16:25",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-28",
    "position": 86,
    "videoId": "zMvApQSW7a4",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 28,
    "title": "فيل أبرهة و الطير الأبابيل - ج 1",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 28 | فيل أبرهة و الطير الأبابيل - ج 1 | Animal Stories from Qur'an",
    "duration": "16:30",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-29",
    "position": 87,
    "videoId": "h26zHWiZnik",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 29,
    "title": "فيل أبرهة و الطير الأبابيل - ج 2",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 29 | فيل أبرهة و الطير الأبابيل - ج 2 | Animal Stories from Qur'an",
    "duration": "16:25",
    "channel": "Cedars Art Production"
  },
  {
    "id": "animals-30",
    "position": 88,
    "videoId": "HW0dpKTw5EQ",
    "category": "animals",
    "categoryLabel": "قصص الحيوان في القرآن",
    "episodeNumber": 30,
    "title": "عنكبوت الغار",
    "rawTitle": "قصص الحيوان في القرآن | الحلقة 30 | عنكبوت الغار  | Animal Stories from Qur'an",
    "duration": "16:46",
    "channel": "Cedars Art Production"
  }
];

export function buildYouTubeEmbedUrl(videoId: string, autoplay = false): string {
  const safeId = encodeURIComponent(videoId.trim());
  return `https://www.youtube-nocookie.com/embed/${safeId}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;
}

export function buildYouTubeWatchUrl(videoId: string): string {
  const safeId = encodeURIComponent(videoId.trim());
  return `https://www.youtube.com/watch?v=${safeId}&list=${QURAN_STORIES_PLAYLIST.id}`;
}

export function buildYouTubeThumbnailUrl(videoId: string): string {
  const safeId = encodeURIComponent(videoId.trim());
  return `https://i.ytimg.com/vi/${safeId}/hqdefault.jpg`;
}
