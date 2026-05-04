import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { sahabaData } from '../lib/data/sahabaData';

const Sahaba = () => {
  const { theme } = useAppStore();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 font-ibm pb-32">
      <div className="mb-16 text-center">
        <h1 className={`text-5xl md:text-6xl font-black mb-6 ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
          قصص الصحابة
        </h1>
        <p className={`text-xl opacity-80 max-w-2xl mx-auto ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
          نجوم اهتدى بها السالكون، استمدوا نورهم من النبوة الخاتمة. اكتشف مواقفهم الخالدة.
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {sahabaData.map((sahabi, index) => (
          <Link key={sahabi.id} to={`/sahaba/${sahabi.id}`}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative h-96 rounded-[2rem] overflow-hidden flex flex-col justify-end p-8 transition-all border
                ${theme === 'dark' 
                   ? 'bg-gradient-to-t from-[#0B1120] to-[#111827] border-primary/20 shadow-lg hover:shadow-[0_15px_30px_rgba(198,162,102,0.2)] hover:border-primary/60' 
                   : 'bg-gradient-to-t from-gray-100 to-white border-secondary/10 shadow-md hover:shadow-xl hover:border-secondary/30'
                }
              `}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-20 opacity-[0.04] font-reem text-[16rem] leading-none select-none pointer-events-none">
                 {sahabi.name.replace('أبو ', '').replace('أبي ', '').charAt(0)}
              </div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl mb-6 backdrop-blur-md border
                  ${theme === 'dark' ? 'bg-[#111827]/50 border-primary/40 text-primary' : 'bg-white/80 border-secondary/20 text-secondary'}
                `}>
                  {index + 1}
                </div>
                <h2 className={`text-3xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
                  {sahabi.name}
                </h2>
                <p className={`text-lg opacity-90 ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`}>
                  {sahabi.title}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default Sahaba;
