import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Heart, Instagram, Phone, Mail } from 'lucide-react';

const prayers = [
  { start: "اللهم احفظ عبدك الفقير", name: "أحمد الملاح", end: "واكفه شر كل حاسد وحاقد 🤲" },
  { start: "اللهم اغفر لعبدك", name: "أحمد الملاح", end: "وارحمه وعافه واعف عنه 🤲" },
  { start: "اللهم ارزق عبدك", name: "أحمد الملاح", end: "علماً نافعاً وعملاً متقبلاً 🤲" },
  { start: "اللهم تقبل هذا العمل من", name: "أحمد الملاح", end: "واجعله صدقة جارية تنفعه 🤲" },
  { start: "اللهم نور قلب عبدك", name: "أحمد الملاح", end: "بالإيمان واشرح صدره بالقرآن 🤲" }
];

const Footer = () => {
  const { theme } = useAppStore();
  const [prayerMatch, setPrayerMatch] = useState(prayers[0]);

  useEffect(() => {
    // Pick a random prayer on mount
    const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)];
    setPrayerMatch(randomPrayer);
  }, []);
  
  return (
    <footer className={`w-full py-4 md:py-6 mt-12 border-t transition-colors duration-500
      ${theme === 'dark' ? 'bg-[#0c1622] border-[#d6a54a]/20 text-[#F5F5DC]/70' : 'bg-[#e9e9db] border-[#0f1c2c]/10 text-[#0f1c2c]/70'}
    `}>
      <div className="container mx-auto px-4 max-w-6xl flex flex-col gap-6 relative z-10">
         
         {/* Top Section: Contact & Da3wa Side by Side */}
         <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4">
            
            {/* Developer Contact Hub */}
            <div className={`flex flex-col items-center lg:items-end gap-3 flex-1 lg:flex-[0.4] font-ibm p-5 md:p-6 rounded-[2rem] border backdrop-blur-sm ${theme === 'dark' ? 'bg-[#0f1c2c]/40 border-[#d6a54a]/20' : 'bg-white/50 border-[#0f1c2c]/10'}`}>
               <h5 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-[#F5F5DC]' : 'text-[#0f1c2c]'}`} dir="rtl">
                 تواصل مع المطور
               </h5>
               <p className="text-xs md:text-sm opacity-80 mb-2 text-center lg:text-right" dir="rtl">
                 لترشيح أفكار، تطوير المنصة، أو للأعمال التطوعية، تواصل معي عبر:
               </p>
               <div className="flex items-center gap-3">
                  <a href="https://wa.me/201067568065" target="_blank" rel="noreferrer" className={`p-3 rounded-full transition-all hover:scale-110 shadow-md ${theme === 'dark' ? 'bg-[#d6a54a]/20 text-[#d6a54a] hover:bg-[#d6a54a] hover:text-[#0f1c2c]' : 'bg-[#0f1c2c]/10 text-[#0f1c2c] hover:bg-[#0f1c2c] hover:text-white'}`}>
                    <Phone size={18} />
                  </a>
                  <a href="https://www.instagram.com/eng_mala7/" target="_blank" rel="noreferrer" className={`p-3 rounded-full transition-all hover:scale-110 shadow-md ${theme === 'dark' ? 'bg-[#d6a54a]/20 text-[#d6a54a] hover:bg-[#d6a54a] hover:text-[#0f1c2c]' : 'bg-[#0f1c2c]/10 text-[#0f1c2c] hover:bg-[#0f1c2c] hover:text-white'}`}>
                    <Instagram size={18} />
                  </a>
                  <a href="mailto:engmala7112004@gmail.com" className={`p-3 rounded-full transition-all hover:scale-110 shadow-md ${theme === 'dark' ? 'bg-[#d6a54a]/20 text-[#d6a54a] hover:bg-[#d6a54a] hover:text-[#0f1c2c]' : 'bg-[#0f1c2c]/10 text-[#0f1c2c] hover:bg-[#0f1c2c] hover:text-white'}`}>
                    <Mail size={18} />
                  </a>
               </div>
            </div>

            {/* Da3wa Banner */}
            <div className={`relative flex-1 lg:flex-[0.6] rounded-[2rem] overflow-hidden border transition-all duration-500 shadow-sm
               ${theme === 'dark' 
                 ? 'bg-gradient-to-tr from-[#0f1c2c] to-[#0c1622] border-[#d6a54a]/30' 
                 : 'bg-gradient-to-tr from-white to-[#F5F5DC] border-[#0f1c2c]/20'}
            `} dir="rtl">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.05] mix-blend-overlay"></div>
               <div className="relative z-10 flex items-center justify-center p-5 md:p-6 min-h-[120px] text-center">
                   <div className={`text-base md:text-xl lg:text-2xl font-bold leading-relaxed font-amiri ${theme === 'dark' ? 'text-[#F5F5DC]' : 'text-[#0f1c2c]'}`}>
                       <span className={`font-kufi opacity-80 ml-2 block sm:inline ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>دعوة بظهر الغيب:</span>
                       <span>{prayerMatch.start}</span> <span className={`${theme === 'dark' ? 'text-[#d6a54a]' : 'text-emerald-700'}`}>{prayerMatch.name}</span> <span>{prayerMatch.end}</span>
                   </div>
               </div>
            </div>
         </div>

         {/* Bottom Section: Branding & Dedication Center Underneath */}
         <div className="flex flex-col items-center gap-4 pt-6 md:pt-8 border-t border-dashed border-[#d6a54a]/20 w-full">
            <img loading="lazy" 
               src="/logo.png" 
               alt="Yaqeen Logo" 
               className="w-16 h-16 md:w-24 md:h-24 object-contain" 
               style={{ filter: theme === 'dark' ? "brightness(0) saturate(100%) invert(80%) sepia(21%) saturate(942%) hue-rotate(349deg) brightness(87%) contrast(92%)" : "brightness(0) saturate(100%) invert(18%) sepia(74%) saturate(614%) hue-rotate(113deg) brightness(96%) contrast(95%)" }} 
            />
            <div className="flex flex-col items-center gap-1">
              <p className="font-ibm text-xs md:text-sm text-center max-w-2xl leading-relaxed opacity-80" dir="rtl">
                صُنع في حب الله، من أخيك في الإسلام أحمد الملاح
              </p>
              <div className={`flex items-center gap-2 font-bold text-base md:text-lg ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`} dir="rtl">
                — صدقة جارية — <Heart size={16} className="animate-pulse" fill="currentColor" />
              </div>
            </div>
         </div>

      </div>
    </footer>
  );
};

export default Footer;
