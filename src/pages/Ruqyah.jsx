import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sun, Moon } from 'lucide-react';

const ruqyahText = [
  {
    text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ * الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ * الرَّحْمَٰنِ الرَّحِيمِ * مَالِكِ يَوْمِ الدِّينِ * إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ * اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ * صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
  },
  {
    text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
  },
  {
    text: 'قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (3 مرات)',
  },
  {
    text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (3 مرات)',
  },
  {
    text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ (3 مرات)',
  },
  { text: 'أعوذ بكلمات الله التامات من شر ما خلق (3 مرات)' },
  {
    text: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم (3 مرات)',
  },
];

const morningAdhkar = [
  {
    text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لا إِلَهَ إِلا اللَّهُ، وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
  },
  {
    text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
  },
  {
    text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ (3 مرات)',
  },
];

const eveningAdhkar = [
  {
    text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لا إِلَهَ إِلا اللَّهُ، وَحْدَهُ لا شَرِيكَ لَهُ',
  },
  {
    text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
  },
  {
    text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
  },
];

const AdhkarCard = ({ title, icon: Icon, adhkars }) => (
  <div className="tactile-card p-5 sm:p-7 flex flex-col gap-5">
    <div className="flex items-center gap-3 pb-4 border-b border-[var(--glass-border-subtle)]">
      <div className="w-11 h-11 rounded-2xl recessed-box flex items-center justify-center text-glow shrink-0">
        <Icon size={20} />
      </div>
      <h2 className="text-xl sm:text-2xl font-extrabold font-cairo text-ink">
        {title}
      </h2>
    </div>

    <div className="space-y-3.5">
      {adhkars.map((dhikr, idx) => (
        <div key={idx} className="recessed-box p-4 sm:p-5">
          <p
            className="font-amiri text-xl sm:text-2xl leading-[2.2] text-right text-ink"
            style={{ wordSpacing: '3px' }}
            dir="rtl"
          >
            {dhikr.text}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const Ruqyah = () => {
  const [activeTab, setActiveTab] = useState('ruqyah');

  return (
    <div className="max-w-[1440px] mx-auto w-full bento-stage p-5 sm:p-8 font-readex flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <span className="text-xs font-bold text-ink-muted block mb-1">
            التحصين والذكر اليومي
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-cairo text-ink">
            حصن المسلم
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary mt-1.5">
            الرقية الشرعية وأذكار الصباح والمساء لتحصين النفس والروح
          </p>
        </div>

        <div className="recessed-well p-1.5 flex items-center gap-1.5 self-start">
          <button
            type="button"
            onClick={() => setActiveTab('ruqyah')}
            className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'ruqyah'
                ? 'tactile-pill text-ink'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <Shield size={16} className={activeTab === 'ruqyah' ? 'text-glow' : ''} />
            <span>الرقية الشرعية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('adhkar')}
            className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'adhkar'
                ? 'tactile-pill text-ink'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <Sun size={16} className={activeTab === 'adhkar' ? 'text-glow' : ''} />
            <span>الأذكار اليومية</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'ruqyah' ? (
            <AdhkarCard
              title="الرقية الشرعية (من الكتاب والسنة)"
              icon={Shield}
              adhkars={ruqyahText}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <AdhkarCard title="أذكار الصباح" icon={Sun} adhkars={morningAdhkar} />
              <AdhkarCard title="أذكار المساء" icon={Moon} adhkars={eveningAdhkar} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Ruqyah;
