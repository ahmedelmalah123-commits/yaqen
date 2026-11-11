export const recitersData = [
  { id: 'ar.alafasy', name: 'مشاري العفاسي', type: 'murattal', group: 'الأكثر استماعاً', narration: 'Hafs', gender: 'male' },
  { id: 'ar.abdulbasitmurattal', name: 'عبدالباسط عبدالصمد (مرتل)', type: 'murattal', group: 'الأكثر استماعاً', narration: 'Hafs', gender: 'male' },
  { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي', type: 'murattal', group: 'الأكثر استماعاً', narration: 'Hafs', gender: 'male' },
  { id: 'ar.abdurrahmaansudais', name: 'عبدالرحمن السديس', type: 'murattal', group: 'الأكثر استماعاً', narration: 'Hafs', gender: 'male' },
  { id: 'ar.saoodshuraym', name: 'سعود الشريم', type: 'murattal', group: 'الأكثر استماعاً', narration: 'Hafs', gender: 'male' },

  { id: 'ar.minshawi', name: 'المنشاوي (مرتل)', type: 'murattal', group: 'ترتيل', narration: 'Hafs', gender: 'male' },
  { id: 'ar.husary', name: 'محمود خليل الحصري (مرتل)', type: 'murattal', group: 'ترتيل', narration: 'Hafs', gender: 'male' },
  { id: 'ar.ahmedajamy', name: 'أحمد العجمي', type: 'murattal', group: 'ترتيل', narration: 'Hafs', gender: 'male' },
  { id: 'ar.hudhaify', name: 'علي الحذيفي', type: 'murattal', group: 'ترتيل', narration: 'Hafs', gender: 'male' },
  { id: 'ar.shaatree', name: 'أبو بكر الشاطري', type: 'murattal', group: 'ترتيل', narration: 'Hafs', gender: 'male' },
  { id: 'ar.muhammadayyoob', name: 'محمد أيوب', type: 'murattal', group: 'ترتيل', narration: 'Hafs', gender: 'male' },
  { id: 'ar.muhammadjibreel', name: 'محمد جبريل', type: 'murattal', group: 'ترتيل', narration: 'Hafs', gender: 'male' },
  { id: 'ar.hanirifai', name: 'هاني الرفاعي', type: 'murattal', group: 'ترتيل', narration: 'Hafs', gender: 'male' },
  { id: 'ar.khalefa', name: 'خليفة الطنيجي', type: 'murattal', group: 'ترتيل', narration: 'Hafs', gender: 'male' },

  { id: 'ar.minshawimujawwad', name: 'المنشاوي (مجوّد)', type: 'mujawwad', group: 'تجويد', narration: 'Hafs', gender: 'male' },
  { id: 'ar.husarymujawwad', name: 'الحصري (مجوّد)', type: 'mujawwad', group: 'تجويد', narration: 'Hafs', gender: 'male' },
  { id: 'ar.abdulbasitmujawwad', name: 'عبدالباسط عبدالصمد (مجوّد)', type: 'mujawwad', group: 'تجويد', narration: 'Hafs', gender: 'male' },

  { id: 'ar.hussary_mujawwad_rare', name: 'الحصري (تسجيلات الإذاعة)', type: 'rare', group: 'نادر', narration: 'Hafs', gender: 'male' },
];

export const RECITER_GROUP_ORDER = ['الأكثر استماعاً', 'ترتيل', 'تجويد', 'نادر'];

export const reciterGroups = RECITER_GROUP_ORDER.map((group) => ({
  group,
  reciters: recitersData.filter((r) => r.group === group),
}));

export const nawadirServers = {
  'ar.hussary_mujawwad_rare': 'https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad',
};
