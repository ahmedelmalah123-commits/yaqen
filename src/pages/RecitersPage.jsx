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
        ${theme === 'dark' ? 'bg-gradient-to-br from-[#022c22] to-[#064e3b] border-primary/30 text-white' 
          : 'bg-gradient-to-br from-white to-[#FAF8F5] border-secondary/20 text-secondary'}
      `}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay border-none"></div>
        <div className="relative z-10 flex flex-col items-center">
           <Mic size={64} className={`mb-6 p-4 rounded-full ${theme === 'dark' ? 'text-primary bg-primary/10' : 'text-secondary bg-secondary/10'}`} />
           <h1 className={`text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg font-reem tracking-wide ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
             المكتبة الصوتية للقراء
           </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
         <div className={`flex items-center flex-1 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#022c22] border-primary/20' : 'bg-white border-secondary/10'}`}>
            <Search className={`mr-3 ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`} />
            <input 
              type="text" 
              placeholder="ابحث عن قارئ..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-transparent outline-none font-bold text-lg px-2 ${theme === 'dark' ? 'text-white placeholder:text-white/40' : 'text-secondary placeholder:text-secondary/40'}`}
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
                   ? (theme === 'dark' ? 'bg-primary text-secondary border-primary' : 'bg-secondary text-white border-secondary')
                   : (theme === 'dark' ? 'bg-transparent text-white border-primary/30' : 'bg-white text-secondary border-secondary/20')
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
               ${theme === 'dark' ? 'bg-[#064e3b]/50 border-primary/20 hover:border-primary/50' : 'bg-white border-secondary/10 hover:border-secondary/40'}
            `}>
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2
                 ${theme === 'dark' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary/5 border-secondary/20 text-secondary'}
               `}>
                 <Mic size={32} />
               </div>
               <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>{reciter.name}</h3>
               <span className={`text-sm tracking-widest px-3 py-1 rounded-full mb-6 ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                 {reciter.type === 'murattal' ? 'مرتل' : reciter.type === 'mujawwad' ? 'مجود' : 'نادر'}
               </span>
               <Link 
                 to="/quran"
                 onClick={() => setReciter(reciter.id)}
                 className={`w-full py-3 rounded-xl font-bold transition-all shadow-md
                   ${theme === 'dark' ? 'bg-primary text-secondary hover:bg-white' : 'bg-secondary text-white hover:bg-black'}
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
