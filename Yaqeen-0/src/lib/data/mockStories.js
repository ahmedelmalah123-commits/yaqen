// روابط حقيقية (صوت بشري) للتجربة بدلاً من الصفير
const AUDIO_BASE_URLS = {
  story1: "https://server8.mp3quran.net/afs/001.mp3", // مشاري العفاسي - الفاتحة (للتجربة)
  story2: "https://server8.mp3quran.net/afs/105.mp3", // سورة الفيل - العفاسي
  story3: "https://server8.mp3quran.net/afs/018.mp3", // سورة الكهف - العفاسي
  story4: "https://server8.mp3quran.net/afs/106.mp3", // سورة قريش
  story5: "https://download.quranicaudio.com/quran/mishary_rashid_alafasy/002.mp3", // سورة البقرة جزء
};

export const mockStories = [
  {
    id: "story-1",
    title: "قصة أصحاب الكهف (تجربة صوتية)",
    category: "سيرة",
    audio_url: AUDIO_BASE_URLS.story1,
    images: ["/images/stories/cave_story_1775657531232.png"],
    timestamps: [
      { time: 0, id: "p1" },
      { time: 5, id: "p2" },
      { time: 10, id: "p3" },
      { time: 15, id: "p4" }
    ],
    content: [
      { id: "p1", text: "هذا صوت حقيقي (سورة الفاتحة) لتجربة الـ Waveform والتزامن." },
      { id: "p2", text: "لاحظ كيف يتحرك الويف مع نبرات الصوت البشرية الآن." },
      { id: "p3", text: "بمجرد إضافة ملفات الراوي الخاصة بك، سيعمل النظام بنفس الطريقة." },
      { id: "p4", text: "يمكنك الآن سؤال عم بركة عن أي شيء في القصة." }
    ]
  },
  {
    id: "story-2",
    title: "قصة أصحاب الفيل (تجربة صوتية)",
    category: "سيرة",
    audio_url: AUDIO_BASE_URLS.story2,
    images: ["/images/stories/elephant_story_1775657564685.png"],
    timestamps: [
      { time: 0, id: "p1" },
      { time: 5, id: "p2" }
    ],
    content: [
      { id: "p1", text: "تجربة صوتية لسورة الفيل." },
      { id: "p2", text: "النظام جاهز تماماً لاستقبال ملفاتك." }
    ]
  }
];
