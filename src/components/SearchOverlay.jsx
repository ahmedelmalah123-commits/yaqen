import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Book, Mic, ArrowLeft, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { recitersData } from '../lib/data/recitersData';
import { radioData } from '../lib/data/radioData';

// Static surah list for fast local search
const surahsList = [
  "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
  "هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج",
  "المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة",
  "الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان",
  "الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن",
  "الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق",
  "التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان",
  "المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق",
  "الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر",
  "البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون",
  "الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"
].map((name, idx) => ({ id: idx + 1, name }));

const SearchOverlay = ({ isOpen, onClose }) => {
  const { theme, setReciter } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ surahs: [], reciters: [], radios: [] });
  const [versesResults, setVersesResults] = useState([]);
  const [isSearchingVerses, setIsSearchingVerses] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ surahs: [], reciters: [], radios: [] });
      return;
    }
    const q = query.toLowerCase();
    
    // Search Surahs
    const matchedSurahs = surahsList.filter(s => s.name.includes(q)).slice(0, 5);
    
    // Search Reciters
    const matchedReciters = recitersData.filter(r => r.name.toLowerCase().includes(q)).slice(0, 5);
    
    // Search Radios
    const matchedRadios = radioData.filter(r => r.name.toLowerCase().includes(q)).slice(0, 5);
    
    setResults({ surahs: matchedSurahs, reciters: matchedReciters, radios: matchedRadios });
  }, [query]);

  // Smart debounced verse search using external Quran API
  useEffect(() => {
    if (!query.trim() || query.length < 3) {
      setVersesResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearchingVerses(true);
      try {
        const response = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/ar`);
        const json = await response.json();
        if (json.code === 200 && json.data && json.data.matches) {
          setVersesResults(json.data.matches.slice(0, 10));
        } else {
          setVersesResults([]);
        }
      } catch (err) {
        console.error("Error searching verses:", err);
      } finally {
        setIsSearchingVerses(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border
              ${theme === 'dark' ? 'bg-[#0A1A14] border-[#C8A96A]/30' : 'bg-white border-[#0F3D2E]/20'}
            `}
          >
            {/* Search Input Header */}
            <div className={`p-4 flex items-center border-b ${theme === 'dark' ? 'border-[#C8A96A]/20' : 'border-[#0F3D2E]/10'}`}>
               <Search className={`ml-4 ${theme === 'dark' ? 'text-[#C8A96A]' : 'text-gray-400'}`} />
               <input 
                 autoFocus
                 type="text" 
                 placeholder="ابحث عن اسم سورة، قارئ، أو كلمة قرآنيـة..." 
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 className={`flex-1 bg-transparent text-xl font-bold outline-none font-tajawal
                   ${theme === 'dark' ? 'text-white placeholder:text-white/30' : 'text-[#0F3D2E] placeholder:text-gray-400'}
                 `}
               />
               <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-[#0F3D2E]'}`}>
                 <X />
               </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
               {!query.trim() ? (
                 <div className="p-12 text-center opacity-50 font-tajawal">
                   <p className={theme === 'dark' ? 'text-white' : 'text-gray-600'}>ابدأ الكتابة للبحث...</p>
                 </div>
               ) : (
                 <div className="space-y-6 p-4 font-tajawal">
                   
                   {/* Surahs Results */}
                   {results.surahs.length > 0 && (
                     <div>
                       <h3 className={`text-sm font-bold mb-3 opacity-70 ${theme === 'dark' ? 'text-[#C8A96A]' : 'text-[#0F3D2E]'}`}>الـسـور</h3>
                       <div className="space-y-2">
                         {results.surahs.map(surah => (
                           <button 
                             key={surah.id}
                             onClick={() => { onClose(); navigate(`/surah/${surah.id}`); }}
                             className={`w-full flex items-center justify-between p-4 rounded-xl transition-all
                               ${theme === 'dark' ? 'hover:bg-[#C8A96A]/10 text-white' : 'hover:bg-black/5 text-[#0F3D2E]'}
                             `}
                           >
                              <div className="flex items-center gap-4">
                                <span className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#0A291F] text-[#C8A96A]' : 'bg-[#F5F5DC] text-[#0F3D2E]'}`}><Book size={20} /></span>
                                <span className="font-bold text-lg font-amiri">سورة {surah.name}</span>
                              </div>
                              <ArrowLeft size={16} className="opacity-50" />
                           </button>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Reciters Results */}
                   {results.reciters.length > 0 && (
                     <div>
                       <h3 className={`text-sm font-bold mb-3 opacity-70 mt-4 ${theme === 'dark' ? 'text-[#C8A96A]' : 'text-[#0F3D2E]'}`}>الـقـراء</h3>
                       <div className="space-y-2">
                         {results.reciters.map(reciter => (
                           <button 
                             key={reciter.id}
                             onClick={() => { setReciter(reciter.id); onClose(); navigate(`/quran`); }}
                             className={`w-full flex items-center justify-between p-4 rounded-xl transition-all
                               ${theme === 'dark' ? 'hover:bg-[#C8A96A]/10 text-white' : 'hover:bg-black/5 text-[#0F3D2E]'}
                             `}
                           >
                              <div className="flex items-center gap-4">
                                <span className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#0A291F] text-[#C8A96A]' : 'bg-[#F5F5DC] text-[#0F3D2E]'}`}><Mic size={20} /></span>
                                <span className="font-bold text-lg">{reciter.name}</span>
                              </div>
                              <ArrowLeft size={16} className="opacity-50" />
                           </button>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Radios Results */}
                   {results.radios?.length > 0 && (
                     <div>
                       <h3 className={`text-sm font-bold mb-3 opacity-70 mt-4 ${theme === 'dark' ? 'text-[#C8A96A]' : 'text-[#0F3D2E]'}`}>الإذاعـات</h3>
                       <div className="space-y-2">
                         {results.radios.map(radio => (
                           <button 
                             key={radio.id}
                             onClick={() => { onClose(); navigate(`/radio?station=${radio.id}`); }}
                             className={`w-full flex items-center justify-between p-4 rounded-xl transition-all
                               ${theme === 'dark' ? 'hover:bg-[#C8A96A]/10 text-white' : 'hover:bg-black/5 text-[#0F3D2E]'}
                             `}
                           >
                              <div className="flex items-center gap-4">
                                <span className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#0A291F] text-[#C8A96A]' : 'bg-[#F5F5DC] text-[#0F3D2E]'}`}><Radio size={20} /></span>
                                <span className="font-bold text-lg">{radio.name}</span>
                              </div>
                              <ArrowLeft size={16} className="opacity-50" />
                           </button>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Verses Results */}
                   {isSearchingVerses && (
                     <div className="flex items-center justify-center py-6 gap-3">
                       <div className="w-5 h-5 rounded-full border-2 border-[#C8A96A] border-t-transparent animate-spin"></div>
                       <span className={`text-md font-bold ${theme === 'dark' ? 'text-[#C8A96A]' : 'text-[#0F3D2E]'}`}>جاري البحث في آيات الذكر الحكيم...</span>
                     </div>
                   )}

                   {versesResults.length > 0 && (
                     <div>
                       <h3 className={`text-sm font-bold mb-3 opacity-70 mt-4 ${theme === 'dark' ? 'text-[#C8A96A]' : 'text-[#0F3D2E]'}`}>الآيـات الـقرآنـيـة</h3>
                       <div className="space-y-3">
                         {versesResults.map((verse, idx) => (
                           <button 
                             key={`${verse.number}-${idx}`}
                             onClick={() => { 
                               onClose(); 
                               navigate(`/surah/${verse.surah.number}`, { state: { highlightAyahIndex: verse.numberInSurah - 1 } }); 
                             }}
                             className={`w-full text-right p-4 rounded-2xl transition-all border flex flex-col gap-2.5
                               ${theme === 'dark' ? 'hover:bg-[#C8A96A]/10 text-white bg-emerald-950/20 border-[#C8A96A]/15' : 'hover:bg-black/5 text-[#0F3D2E] bg-gray-50 border-gray-150'}
                             `}
                           >
                             <p className="font-uthmanic text-xl leading-relaxed text-right w-full font-bold">
                               {verse.text}
                             </p>
                             <div className="flex justify-between items-center text-xs opacity-75 font-tajawal w-full">
                               <span className={`px-2.5 py-0.5 rounded-full border ${theme === 'dark' ? 'bg-[#0A291F] text-[#C8A96A] border-[#C8A96A]/20' : 'bg-[#FAF8F5] text-secondary border-secondary/20'}`}>
                                 سورة {verse.surah.name.replace('سُورَةُ ', '')} - الآية {verse.numberInSurah.toLocaleString('ar-EG')}
                               </span>
                               <span className="flex items-center gap-1">
                                 الانتقال والاستماع <ArrowLeft size={12} />
                               </span>
                             </div>
                           </button>
                         ))}
                       </div>
                     </div>
                   )}

                   {results.surahs.length === 0 && results.reciters.length === 0 && (!results.radios || results.radios.length === 0) && versesResults.length === 0 && !isSearchingVerses && (
                     <div className="p-8 text-center opacity-70 mt-4">
                       <p className={theme === 'dark' ? 'text-white' : 'text-gray-600'}>لا توجد نتائج مطابقة لبحثك.</p>
                     </div>
                   )}

                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchOverlay;
