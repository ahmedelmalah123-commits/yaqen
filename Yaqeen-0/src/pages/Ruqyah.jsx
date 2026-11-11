import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Shield, Sun, Moon } from 'lucide-react';

const ruqyahText = [
  { text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ * الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ * الرَّحْمَٰنِ الرَّحِيمِ * مَالِكِ يَوْمِ الدِّينِ * إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ * اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ * صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" },
  { text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ" },
  { text: "قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (3 مرات)" },
  { text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (3 مرات)" },
  { text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ (3 مرات)" },
  { text: "أعوذ بكلمات الله التامات من شر ما خلق (3 مرات)" },
  { text: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم (3 مرات)" }
];

const AdhkarTab = ({ title, icon: Icon, adhkars, theme }) => (
  <div className={`p-8 rounded-[2rem] border-2 shadow-xl ${theme === 'dark' ? 'bg-[#0c1622] border-[#d6a54a]/20 text-[#F5F5DC]' : 'bg-white border-[#0f1c2c]/10 text-[#0f1c2c]'}`}>
    <div className="flex items-center justify-center md:justify-start gap-4 mb-8 border-b border-dashed pb-4 shrink-0" style={{borderColor: theme === 'dark' ? 'rgba(200,169,106,0.3)' : 'rgba(15,61,46,0.2)'}}>
      <Icon size={32} className={theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'} />
      <h2 className="text-3xl font-cairo font-bold tracking-wider">{title}</h2>
    </div>
    <div className="space-y-6">
      {adhkars.map((dhikr, idx) => (
         <div key={idx} className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-black/20 border-[#d6a54a]/10 hover:border-[#d6a54a]/40' : 'bg-gray-50 border-[#0f1c2c]/5 hover:border-[#0f1c2c]/30'}`}>
           <p className="font-amiri text-2xl md:text-3xl leading-[2.2] text-justify text-right" style={{ wordSpacing: '3px' }} dir="rtl">{dhikr.text}</p>
         </div>
      ))}
    </div>
  </div>
);

const Ruqyah = () => {
  const { theme } = useAppStore();
  const [activeTab, setActiveTab] = useState('ruqyah');

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 font-readex pb-40">
      
      <div className={`relative rounded-[3rem] p-12 mb-10 overflow-hidden text-center border shadow-2xl transition-colors duration-500
        ${theme === 'dark' ? 'bg-gradient-to-br from-[#0c1622] to-[#0f1c2c] border-[#d6a54a]/30 text-white' 
          : 'bg-gradient-to-br from-white to-[#F5F5DC] border-[#0f1c2c]/20 text-[#0f1c2c]'}
      `}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#d6a54a]/5 to-transparent"></div>
        <div className="relative z-10">
          <h1 className={`text-4xl md:text-7xl font-bold mb-6 drop-shadow-lg font-cairo tracking-wide ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>
            حصن المسلم
          </h1>
          <p className="text-xl md:text-2xl font-bold opacity-80 max-w-2xl mx-auto leading-relaxed">
            الرقية الشرعية وأذكار الصباح والمساء لتحصين النفس والروح
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button 
          onClick={() => setActiveTab('ruqyah')}
          className={`px-8 py-4 rounded-full font-bold text-xl transition-all shadow-md flex items-center gap-3 border
            ${activeTab === 'ruqyah' 
               ? (theme === 'dark' ? 'bg-[#d6a54a] text-[#0c1622] border-[#d6a54a]' : 'bg-[#0f1c2c] text-[#F5F5DC] border-[#0f1c2c]')
               : (theme === 'dark' ? 'bg-transparent text-[#d6a54a] border-[#d6a54a]/40 hover:bg-[#d6a54a]/10' : 'bg-transparent text-[#0f1c2c] border-[#0f1c2c]/40 hover:bg-[#0f1c2c]/10')
            }
          `}
        ><Shield size={24} /> الرقية الشرعية</button>
        <button 
           onClick={() => setActiveTab('adhkar')}
           className={`px-8 py-4 rounded-full font-bold text-xl transition-all shadow-md flex items-center gap-3 border
               ${activeTab === 'adhkar' 
                 ? (theme === 'dark' ? 'bg-[#d6a54a] text-[#0c1622] border-[#d6a54a]' : 'bg-[#0f1c2c] text-[#F5F5DC] border-[#0f1c2c]')
                 : (theme === 'dark' ? 'bg-transparent text-[#d6a54a] border-[#d6a54a]/40 hover:bg-[#d6a54a]/10' : 'bg-transparent text-[#0f1c2c] border-[#0f1c2c]/40 hover:bg-[#0f1c2c]/10')
               }
           `}
        ><Sun size={24} /> الأذكار اليومية</button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, scale: 0.98, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.98, y: -10 }}
           transition={{ duration: 0.4 }}
        >
          {activeTab === 'ruqyah' && (
            <AdhkarTab title="الرقية الشرعية (من الكتاب والسنة)" icon={Shield} adhkars={ruqyahText} theme={theme} />
          )}
          
          {activeTab === 'adhkar' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AdhkarTab title="أذكار الصباح" icon={Sun} theme={theme} adhkars={[
                   { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لا إِلَهَ إِلا اللَّهُ، وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ" },
                   { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ" },
                   { text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ (3 مرات)" }
                ]} />
                <AdhkarTab title="أذكار المساء" icon={Moon} theme={theme} adhkars={[
                   { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لا إِلَهَ إِلا اللَّهُ، وَحْدَهُ لا شَرِيكَ لَهُ" },
                   { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ" },
                   { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي" }
                ]} />
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Ruqyah;
