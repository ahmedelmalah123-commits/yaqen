export interface JuzMeta {
  number: number;
  name: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  page: number;
}

export const JUZ_LIST: JuzMeta[] = [
  { number: 1, name: 'آلم', surahNumber: 1, surahName: 'الفاتحة', ayahNumber: 1, page: 1 },
  { number: 2, name: 'سيقول', surahNumber: 2, surahName: 'البقرة', ayahNumber: 142, page: 22 },
  { number: 3, name: 'تلك الرسل', surahNumber: 2, surahName: 'البقرة', ayahNumber: 253, page: 42 },
  { number: 4, name: 'لن تنالوا', surahNumber: 3, surahName: 'آل عمران', ayahNumber: 93, page: 62 },
  { number: 5, name: 'والمحصنات', surahNumber: 4, surahName: 'النساء', ayahNumber: 24, page: 82 },
  { number: 6, name: 'لا يحب الله', surahNumber: 4, surahName: 'النساء', ayahNumber: 148, page: 102 },
  { number: 7, name: 'وإذا سمعوا', surahNumber: 5, surahName: 'المائدة', ayahNumber: 82, page: 121 },
  { number: 8, name: 'ولو أننا', surahNumber: 6, surahName: 'الأنعام', ayahNumber: 111, page: 142 },
  { number: 9, name: 'قال الملأ', surahNumber: 7, surahName: 'الأعراف', ayahNumber: 88, page: 162 },
  { number: 10, name: 'واعلموا', surahNumber: 8, surahName: 'الأنفال', ayahNumber: 41, page: 182 },
  { number: 11, name: 'يعتذرون', surahNumber: 9, surahName: 'التوبة', ayahNumber: 93, page: 201 },
  { number: 12, name: 'وما من دابة', surahNumber: 11, surahName: 'هود', ayahNumber: 6, page: 222 },
  { number: 13, name: 'وما أبرئ', surahNumber: 12, surahName: 'يوسف', ayahNumber: 53, page: 242 },
  { number: 14, name: 'ربما', surahNumber: 15, surahName: 'الحجر', ayahNumber: 1, page: 262 },
  { number: 15, name: 'سبحان الذي', surahNumber: 17, surahName: 'الإسراء', ayahNumber: 1, page: 282 },
  { number: 16, name: 'قال ألم', surahNumber: 18, surahName: 'الكهف', ayahNumber: 75, page: 302 },
  { number: 17, name: 'اقترب للناس', surahNumber: 21, surahName: 'الأنبياء', ayahNumber: 1, page: 322 },
  { number: 18, name: 'قد أفلح', surahNumber: 23, surahName: 'المؤمنون', ayahNumber: 1, page: 342 },
  { number: 19, name: 'وقال الذين', surahNumber: 25, surahName: 'الفرقان', ayahNumber: 21, page: 362 },
  { number: 20, name: 'أمن خلق', surahNumber: 27, surahName: 'النمل', ayahNumber: 56, page: 382 },
  { number: 21, name: 'اتل ما أوحي', surahNumber: 29, surahName: 'العنكبوت', ayahNumber: 46, page: 402 },
  { number: 22, name: 'ومن يقنت', surahNumber: 33, surahName: 'الأحزاب', ayahNumber: 31, page: 422 },
  { number: 23, name: 'وما لي', surahNumber: 36, surahName: 'يس', ayahNumber: 28, page: 442 },
  { number: 24, name: 'فمن أظلم', surahNumber: 39, surahName: 'الزمر', ayahNumber: 32, page: 462 },
  { number: 25, name: 'إليه يرد', surahNumber: 41, surahName: 'فصلت', ayahNumber: 47, page: 482 },
  { number: 26, name: 'حم', surahNumber: 46, surahName: 'الأحقاف', ayahNumber: 1, page: 502 },
  { number: 27, name: 'قال فما خطبكم', surahNumber: 51, surahName: 'الذاريات', ayahNumber: 31, page: 522 },
  { number: 28, name: 'قد سمع الله', surahNumber: 58, surahName: 'المجادلة', ayahNumber: 1, page: 542 },
  { number: 29, name: 'تبارك الذي', surahNumber: 67, surahName: 'الملك', ayahNumber: 1, page: 562 },
  { number: 30, name: 'عم', surahNumber: 78, surahName: 'النبأ', ayahNumber: 1, page: 582 },
];

export function getJuzName(juzNumber: number): string {
  const found = JUZ_LIST.find((j) => j.number === Number(juzNumber));
  return found ? `${juzNumber} (${found.name})` : String(juzNumber);
}

