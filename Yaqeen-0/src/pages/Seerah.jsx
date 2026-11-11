import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { seerahData } from '../lib/data/seerahData';

const Seerah = () => {
  const { theme } = useAppStore();

  return (
    <div className="py-16 max-w-6xl mx-auto px-4 font-ibm pb-40 relative">
      <div className="mb-20 text-center relative z-10">
        <h1 className={`text-4xl md:text-7xl font-black mb-6 drop-shadow-lg ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>
          السيرة النبوية
        </h1>
        <p className={`text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-[#F5F5DC]' : 'text-[#0f1c2c]'}`}>
          تتبع مسيرة خير البرية عبر خط زمني تفاعلي يروي أعظم قصة عرفتها البشرية.
        </p>
      </div>

      <div className="relative z-10">
        {/* Central Vertical Line */}
        <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 rounded-full ${theme === 'dark' ? 'bg-[#d6a54a]/20' : 'bg-[#0f1c2c]/20'}`}></div>

        <div className="space-y-16 md:space-y-24">
          {seerahData.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                
                {/* Timeline Dot */}
                <div className={`absolute left-4 md:left-1/2 w-6 h-6 rounded-full border-4 z-20 transition-all duration-300 md:-translate-x-1/2 md:translate-x-0 -translate-x-2.5 
                  ${theme === 'dark' ? 'bg-[#0c1622] border-[#d6a54a] shadow-[0_0_15px_rgba(200,169,106,0.8)]' : 'bg-white border-[#0f1c2c] shadow-[0_0_10px_rgba(15,61,46,0.4)]'}
                `}></div>

                {/* Content Card container */}
                <div className={`w-full md:w-1/2 pl-12 pr-4 md:px-0 flex ${isEven ? 'md:justify-start md:pl-16' : 'md:justify-end md:pr-16'}`}>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-8 md:p-10 rounded-3xl border shadow-xl transition-all relative overflow-hidden
                      ${theme === 'dark' 
                        ? 'bg-gradient-to-br from-[#0c1622] to-[#0f1c2c] border-[#d6a54a]/30 hover:shadow-[0_15px_30px_rgba(200,169,106,0.15)] text-[#F5F5DC]' 
                        : 'bg-white border-[#0f1c2c]/20 hover:shadow-[0_15px_30px_rgba(15,61,46,0.1)] text-[#0f1c2c]'
                      }
                    `}
                  >
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.05] mix-blend-overlay"></div>
                     
                     <div className="relative z-10">
                        {item.media && item.media.type === 'image' && (
                          <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6 border border-[#d6a54a]/20 shadow-lg">
                            <img loading="lazy" 
                              src={item.media.src} 
                              alt={item.media.title || item.title} 
                              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                          </div>
                        )}

                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${theme === 'dark' ? 'bg-[#d6a54a]/20 text-[#d6a54a]' : 'bg-[#0f1c2c]/10 text-[#0f1c2c]'}`}>
                          {item.year}
                        </span>
                        
                        <h4 className={`text-xl font-medium mb-2 opacity-80 border-b pb-2 inline-block ${theme === 'dark' ? 'text-[#d6a54a] border-[#d6a54a]/30' : 'text-[#0f1c2c] border-[#0f1c2c]/20'}`}>
                          {item.phase}
                        </h4>
                        
                        <h3 className="text-3xl font-black mb-6 leading-tight">
                          {item.title}
                        </h3>
                        
                        <div className="space-y-4 mb-6">
                           {item.content.map((paragraph, idx) => (
                             <p key={idx} className="text-lg opacity-90 leading-[1.8] font-light">
                               {paragraph}
                             </p>
                           ))}
                        </div>

                        
                     </div>
                  </motion.div>
                </div>

                {/* Empty Space for alignment on Desktop */}
                <div className="hidden md:block w-1/2"></div>
                
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Seerah;
