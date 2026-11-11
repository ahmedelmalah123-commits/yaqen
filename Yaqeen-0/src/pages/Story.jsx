import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { sahabaData } from '../lib/data/sahabaData';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Story = () => {
  const { id } = useParams();
  const { theme } = useAppStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const story = sahabaData.find(s => s.id === id);

  if (!story) return <div className="text-center p-20 text-2xl font-ibm">القصة غير موجودة</div>;

  const handleNext = () => {
    if (currentSlide < story.slides.length - 1) {
      setCurrentSlide(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-ibm overflow-y-auto overflow-x-hidden min-h-screen">
      {/* Immersive Background */}
      <div className={`absolute inset-0 transition-colors duration-700
        ${theme === 'dark' ? 'bg-[#0c1622]' : 'bg-[#e9e9db]'}
      `}>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Header Controls */}
      <div className="relative z-10 w-full p-6 flex items-center justify-between">
         <div className={`flex gap-2`} dir="ltr">
            {story.slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-10' : 'w-3'} 
                  ${theme === 'dark' 
                    ? (currentSlide === idx ? 'bg-[#d6a54a]' : 'bg-[#d6a54a]/30') 
                    : (currentSlide === idx ? 'bg-[#0f1c2c]' : 'bg-[#0f1c2c]/30')}
                `}
              />
            ))}
         </div>
         
         <Link to="/sahaba" className={`p-3 rounded-full backdrop-blur-md transition-colors
            ${theme === 'dark' ? 'bg-black/20 hover:bg-black/40 text-[#F5F5DC]' : 'bg-white/50 hover:bg-white text-[#0f1c2c]'}
         `}>
           <X size={24} />
         </Link>
      </div>

      {/* Slide Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`w-full max-w-4xl p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl border flex flex-col justify-center min-h-[60vh] md:min-h-[50vh]
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-[#0f1c2c] to-[#0c1622] border-[#d6a54a]/30 shadow-[#d6a54a]/5' 
                : 'bg-white border-[#0f1c2c]/10'}
            `}
          >
             <div className="text-center overflow-y-auto max-h-[70vh] no-scrollbar">
               <h3 className={`text-lg md:text-2xl font-bold tracking-[0.2em] mb-4 md:mb-6 opacity-80
                 ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}
               `}>
                 {story.slides[currentSlide].title}
               </h3>
               <h2 className={`text-2xl md:text-5xl lg:text-5xl font-black mb-6 md:mb-10 leading-[1.8] md:leading-relaxed
                 ${theme === 'dark' ? 'text-[#F5F5DC]' : 'text-[#0f1c2c]'}
               `}>
                 {story.slides[currentSlide].text}
               </h2>
             </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 w-full p-8 flex items-center justify-center gap-6">
         <button 
           onClick={handleNext}
           disabled={currentSlide === story.slides.length - 1}
           className={`p-5 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed
             ${theme === 'dark' ? 'bg-[#d6a54a] text-[#0f1c2c] hover:bg-white hover:scale-105' : 'bg-[#0f1c2c] text-white hover:bg-black hover:scale-105'}
           `}
         >
           <ChevronRight size={32} />
         </button>
         
         <button 
           onClick={handlePrev}
           disabled={currentSlide === 0}
           className={`p-5 rounded-full border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed
             ${theme === 'dark' ? 'border-[#d6a54a]/50 text-[#d6a54a] hover:bg-[#d6a54a]/10' : 'border-[#0f1c2c]/50 text-[#0f1c2c] hover:bg-[#0f1c2c]/10'}
           `}
         >
           <ChevronLeft size={32} />
         </button>
      </div>
    </div>
  );
};

export default Story;
