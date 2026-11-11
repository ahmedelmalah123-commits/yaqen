import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sahabaData } from '../lib/data/sahabaData';
import { ArrowUpLeft } from 'lucide-react';

const Sahaba = () => {
  return (
    <div className="max-w-[1440px] mx-auto w-full bento-stage p-5 sm:p-8 font-ibm flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-ink-muted block mb-1">
          القدوة والسير العطرة
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-cairo text-ink">
          قصص الصحابة
        </h1>
        <p className="text-sm sm:text-base text-ink-secondary mt-1.5 max-w-2xl">
          نجوم اهتدى بها السالكون، استمدوا نورهم من النبوة الخاتمة. اكتشف مواقفهم الخالدة عبر شرائح تفاعلية.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {sahabaData.map((sahabi, index) => (
          <Link key={sahabi.id} to={`/sahaba/${sahabi.id}`} className="group">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="tactile-card p-6 h-full min-h-[240px] flex flex-col justify-between gap-6 relative overflow-hidden group-hover:-translate-y-1 group-hover:border-glow-border"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl recessed-box flex items-center justify-center font-mono font-bold text-sm text-ink-secondary group-hover:text-glow">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-muted group-hover:text-glow">
                  <ArrowUpLeft size={15} />
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black font-cairo text-ink mb-1.5">
                  {sahabi.name}
                </h2>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
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
