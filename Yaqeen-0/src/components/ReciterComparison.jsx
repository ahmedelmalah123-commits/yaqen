import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X } from 'lucide-react';

const RECITER_NAMES = {
  'ar.alafasy': 'مشاري العفاسي',
  'ar.abdulbasitmurattal': 'عبدالباسط عبدالصمد (مرتل)',
  'ar.abdulbasitmujawwad': 'عبدالباسط عبدالصمد (مجوّد)',
  'ar.mahermuaiqly': 'ماهر المعيقلي',
  'ar.abdurrahmaansudais': 'عبدالرحمن السديس',
  'ar.saoodshuraym': 'سعود الشريم',
  'ar.minshawi': 'المنشاوي (مرتل)',
  'ar.minshawimujawwad': 'المنشاوي (مجوّد)',
  'ar.husary': 'محمود خليل الحصري (مرتل)',
  'ar.husarymujawwad': 'الحصري (مجوّد)',
  'ar.hudhaify': 'علي الحذيفي',
  'ar.ahmedajamy': 'أحمد العجمي',
  'ar.shaatree': 'أبو بكر الشاطري',
  'ar.muhammadayyoob': 'محمد أيوب',
  'ar.muhammadjibreel': 'محمد جبريل',
  'ar.hanirifai': 'هاني الرفاعي',
  'ar.khalefa': 'خليفة الطنيجي',
  'ar.parhizgar': 'محمد پرهيزگار',
  'ar.hussary_mujawwad_rare': 'الحصري (تسجيلات الإذاعة)',
};

export default function ReciterComparison() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReciters, setSelectedReciters] = useState(['ar.alafasy']);
  const { setAudioState, audioState } = useAppStore();

  const handleReciterSelect = (reciter) => {
    if (selectedReciters.includes(reciter)) {
      setSelectedReciters(selectedReciters.filter(r => r !== reciter));
    } else if (selectedReciters.length < 3) {
      setSelectedReciters([...selectedReciters, reciter]);
    }
  };

  const playWithReciter = (reciter) => {
    const newState = {
      ...audioState,
      reciter,
      isPlaying: true,
    };
    setAudioState(newState);
  };

  const isDisabled = selectedReciters.length === 0 || !audioState.ayahs.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-[#D4AF37] hover:bg-opacity-10 transition-colors"
        title="مقارنة القراء"
      >
        <span className="text-lg">👥</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-[#1B4332] border border-[#D4AF37] rounded-lg p-4 shadow-xl z-50 w-72 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37] border-opacity-20">
              <h3 className="font-semibold text-[#D4AF37]">اختر القراء للمقارنة</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#D4AF37] hover:text-[#F8F1E5]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Reciter Selection */}
            <div className="space-y-2">
              {Object.entries(RECITER_NAMES).map(([id, name]) => (
                <label
                  key={id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-[#D4AF37] hover:bg-opacity-10 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedReciters.includes(id)}
                    onChange={() => handleReciterSelect(id)}
                    disabled={
                      !selectedReciters.includes(id) && selectedReciters.length >= 3
                    }
                    className="w-4 h-4 cursor-pointer accent-[#D4AF37]"
                  />
                  <span className="text-sm flex-1">{name}</span>
                  {selectedReciters.includes(id) && (
                    <span className="text-xs bg-[#D4AF37] text-[#1B4332] px-2 py-1 rounded">
                      اختيار
                    </span>
                  )}
                </label>
              ))}
            </div>

            {/* Quick Play with Selected Reciters */}
            {selectedReciters.length > 0 && !isDisabled && (
              <div className="border-t border-[#D4AF37] border-opacity-20 pt-3 space-y-2">
                <p className="text-xs text-[#D4AF37]">اختر قارئ للاستماع:</p>
                {selectedReciters.map((reciter) => (
                  <button
                    key={reciter}
                    onClick={() => {
                      playWithReciter(reciter);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm rounded bg-[#D4AF37] bg-opacity-10 hover:bg-opacity-20 transition-colors text-right"
                  >
                    استمع مع {RECITER_NAMES[reciter]}
                  </button>
                ))}
              </div>
            )}

            {/* Info Message */}
            <div className="text-xs text-[#F8F1E5] text-opacity-60">
              يمكنك اختيار حتى 3 قراء للمقارنة المباشرة
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
