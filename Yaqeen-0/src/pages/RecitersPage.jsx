import React, { useState } from 'react';
import { recitersData } from '../lib/data/recitersData';
import { useAppStore } from '../store/useAppStore';
import { Mic, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecitersPage = () => {
  const { theme, setReciter } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredReciters = recitersData.filter(r => {
    const matchSearch = r.name.includes(search);
    const matchType = filterType === 'all' || r.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 font-tajawal pb-32">
      <div className={`relative rounded-[3rem] p-12 mb-12 overflow-hidden text-center border shadow-2xl transition-colors duration-500
        ${theme === 'dark' ? 'bg-gradient-to-br from-[#0c1622] to-[#0f1c2c] border-[#d6a54a]/30 text-white' 
          : 'bg-gradient-to-br from-white to-[#F5F5DC] border-[#0f1c2c]/20 text-[#0f1c2c]'}
      `}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay border-none"></div>
        <div className="relative z-10 flex flex-col items-center">
           <Mic size={64} className={`mb-6 p-4 rounded-full ${theme === 'dark' ? 'text-[#d6a54a] bg-[#d6a54a]/10' : 'text-[#0f1c2c] bg-[#0f1c2c]/10'}`} />
           <h1 className={`text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg font-reem tracking-wide ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>
             المكتبة الصوتية للقراء
           </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
         <div className={`flex items-center flex-1 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#0A1A14] border-[#d6a54a]/20' : 'bg-white border-[#0f1c2c]/10'}`}>
            <Search className={`mr-3 ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`} />
            <input 
              type="text" 
              placeholder="ابحث عن قارئ..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-transparent outline-none font-bold text-lg px-2 ${theme === 'dark' ? 'text-white placeholder:text-white/40' : 'text-[#0f1c2c] placeholder:text-[#0f1c2c]/40'}`}
              dir="rtl"
            />
         </div>
         <div className="flex items-center gap-2">
           {['all', 'murattal', 'mujawwad', 'rare'].map(type => (
             <button 
               key={type}
               onClick={() => setFilterType(type)}
               className={`px-4 py-3 rounded-full font-bold text-sm transition-all border
                 ${filterType === type 
                   ? (theme === 'dark' ? 'bg-[#d6a54a] text-[#0c1622] border-[#d6a54a]' : 'bg-[#0f1c2c] text-white border-[#0f1c2c]')
                   : (theme === 'dark' ? 'bg-transparent text-[#F5F5DC] border-[#d6a54a]/30' : 'bg-white text-[#0f1c2c] border-[#0f1c2c]/20')
                 }
               `}
             >
                {type === 'all' ? 'الكل' : type === 'murattal' ? 'مرتل' : type === 'mujawwad' ? 'مجود' : 'نادر'}
             </button>
           ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {filteredReciters.map(reciter => (
            <div key={reciter.id} className={`p-6 rounded-3xl border flex flex-col items-center text-center transition-all hover:scale-105 shadow-md
               ${theme === 'dark' ? 'bg-[#0c1622]/50 border-[#d6a54a]/20 hover:border-[#d6a54a]/50' : 'bg-white border-[#0f1c2c]/10 hover:border-[#0f1c2c]/40'}
            `}>
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2
                 ${theme === 'dark' ? 'bg-[#d6a54a]/10 border-[#d6a54a]/30 text-[#d6a54a]' : 'bg-[#0f1c2c]/5 border-[#0f1c2c]/20 text-[#0f1c2c]'}
               `}>
                 <Mic size={32} />
               </div>
               <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#0f1c2c]'}`}>{reciter.name}</h3>
               <span className={`text-sm tracking-widest px-3 py-1 rounded-full mb-6 ${theme === 'dark' ? 'bg-[#d6a54a]/20 text-[#d6a54a]' : 'bg-[#0f1c2c]/10 text-[#0f1c2c]'}`}>
                 {reciter.type === 'murattal' ? 'مرتل' : reciter.type === 'mujawwad' ? 'مجود' : 'نادر'}
               </span>
               <Link 
                 to="/quran"
                 onClick={() => setReciter(reciter.id)}
                 className={`w-full py-3 rounded-xl font-bold transition-all shadow-md
                   ${theme === 'dark' ? 'bg-[#d6a54a] text-[#0c1622] hover:bg-white' : 'bg-[#0f1c2c] text-white hover:bg-black'}
                 `}
               >
                  اختيار القارئ
               </Link>
            </div>
         ))}
      </div>
    </div>
  );
};

export default RecitersPage;
