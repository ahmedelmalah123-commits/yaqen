import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Settings as SettingsIcon } from 'lucide-react';

export default function AdvancedAudioFeatures() {
  const [showLoopMenu, setShowLoopMenu] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const loopMode = useAppStore((state) => state.loopMode);
  const loopCount = useAppStore((state) => state.loopCount);
  const equalizer = useAppStore((state) => state.equalizer);
  const setLoopMode = useAppStore((state) => state.setLoopMode);
  const setLoopCount = useAppStore((state) => state.setLoopCount);
  const setEqualizer = useAppStore((state) => state.setEqualizer);

  const loopModes = [
    { value: 'off', label: 'بدون تكرار', icon: '⏹️' },
    { value: 'ayah', label: 'تكرار الآية', icon: '🔄' },
    { value: 'surah', label: 'تكرار السورة', icon: '🔁' },
    { value: 'all', label: 'تكرار الكل', icon: '♻️' },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Loop Mode Button */}
      <div className="relative">
        <button
          onClick={() => setShowLoopMenu(!showLoopMenu)}
          className="p-2 rounded-lg hover:bg-[#D4AF37] hover:bg-opacity-10 transition-colors"
          title={`وضع التكرار: ${loopModes.find(m => m.value === loopMode)?.label}`}
        >
          <span className="text-lg">
            {loopModes.find(m => m.value === loopMode)?.icon}
          </span>
        </button>

        {showLoopMenu && (
          <div className="absolute bottom-full right-0 mb-2 bg-[#1B4332] border border-[#D4AF37] rounded-lg p-2 shadow-lg z-50 min-w-max">
            {loopModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => {
                  setLoopMode(mode.value);
                  setShowLoopMenu(false);
                }}
                className={`block w-full text-right px-4 py-2 rounded transition-colors ${
                  loopMode === mode.value
                    ? 'bg-[#D4AF37] text-[#1B4332]'
                    : 'hover:bg-[#D4AF37] hover:bg-opacity-20'
                }`}
              >
                {mode.icon} {mode.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loop Count Display */}
      {loopMode !== 'off' && (
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#D4AF37] bg-opacity-10">
          <span className="text-sm text-[#D4AF37]">{loopCount}×</span>
          <div className="flex gap-0.5">
            <button
              onClick={() => setLoopCount(loopCount - 1)}
              disabled={loopCount <= 1}
              className="text-xs px-1 py-0 rounded hover:bg-[#D4AF37] hover:bg-opacity-20 disabled:opacity-50"
            >
              ➖
            </button>
            <button
              onClick={() => setLoopCount(loopCount + 1)}
              disabled={loopCount >= 10}
              className="text-xs px-1 py-0 rounded hover:bg-[#D4AF37] hover:bg-opacity-20 disabled:opacity-50"
            >
              ➕
            </button>
          </div>
        </div>
      )}

      {/* Equalizer Button */}
      <button
        onClick={() => setShowEqualizer(!showEqualizer)}
        className={`p-2 rounded-lg transition-colors ${
          equalizer.enabled
            ? 'bg-[#D4AF37] bg-opacity-20'
            : 'hover:bg-[#D4AF37] hover:bg-opacity-10'
        }`}
        title="معادل الصوت"
      >
        <span className="text-lg">🎚️</span>
      </button>

      {/* Equalizer Panel */}
      {showEqualizer && (
        <div className="absolute bottom-full right-0 mb-2 bg-[#1B4332] border border-[#D4AF37] rounded-lg p-4 shadow-lg z-50 min-w-max">
          <div className="space-y-4">
            {/* Enable/Disable */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={equalizer.enabled}
                onChange={(e) => setEqualizer({ enabled: e.target.checked })}
                className="w-4 h-4 cursor-pointer"
              />
              <label className="text-sm cursor-pointer">تفعيل المعادل</label>
            </div>

            {equalizer.enabled && (
              <div className="space-y-3">
                {/* Bass Slider */}
                <div>
                  <label className="text-xs text-[#D4AF37] block mb-1">
                    جهير: {equalizer.bass > 0 ? '+' : ''}{equalizer.bass}dB
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={equalizer.bass}
                    onChange={(e) => setEqualizer({ bass: parseInt(e.target.value) })}
                    className="w-32 h-1.5 bg-[#D4AF37] rounded cursor-pointer accent-[#D4AF37]"
                  />
                </div>

                {/* Mid Slider */}
                <div>
                  <label className="text-xs text-[#D4AF37] block mb-1">
                    تردد متوسط: {equalizer.mid > 0 ? '+' : ''}{equalizer.mid}dB
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={equalizer.mid}
                    onChange={(e) => setEqualizer({ mid: parseInt(e.target.value) })}
                    className="w-32 h-1.5 bg-[#D4AF37] rounded cursor-pointer accent-[#D4AF37]"
                  />
                </div>

                {/* Treble Slider */}
                <div>
                  <label className="text-xs text-[#D4AF37] block mb-1">
                    حادة: {equalizer.treble > 0 ? '+' : ''}{equalizer.treble}dB
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={equalizer.treble}
                    onChange={(e) => setEqualizer({ treble: parseInt(e.target.value) })}
                    className="w-32 h-1.5 bg-[#D4AF37] rounded cursor-pointer accent-[#D4AF37]"
                  />
                </div>

                {/* Presets */}
                <div className="border-t border-[#D4AF37] border-opacity-20 pt-3 space-y-2">
                  <button
                    onClick={() => setEqualizer({ bass: 0, mid: 0, treble: 0 })}
                    className="w-full px-2 py-1 text-xs rounded bg-[#D4AF37] bg-opacity-10 hover:bg-opacity-20 transition-colors"
                  >
                    إعادة تعيين
                  </button>
                  <button
                    onClick={() => setEqualizer({ bass: 8, mid: 0, treble: -5 })}
                    className="w-full px-2 py-1 text-xs rounded bg-[#D4AF37] bg-opacity-10 hover:bg-opacity-20 transition-colors"
                  >
                    جهير عميق
                  </button>
                  <button
                    onClick={() => setEqualizer({ bass: 0, mid: 5, treble: 5 })}
                    className="w-full px-2 py-1 text-xs rounded bg-[#D4AF37] bg-opacity-10 hover:bg-opacity-20 transition-colors"
                  >
                    صوت واضح
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
