import React from 'react';
import { motion } from 'framer-motion';
import { seerahData } from '../lib/data/seerahData';
import { SectionHeader } from '../components/ui/Primitives';

const Seerah = () => {
  return (
    <div className="bento-stage p-5 sm:p-8 font-tajawal flex flex-col gap-8" dir="rtl">
      <SectionHeader
        eyebrow="الخط الزمني التفاعلي"
        title="السيرة النبوية"
        description="تتبع مسيرة خير البرية ﷺ عبر خط زمني متسلسل يروي أعظم قصة عرفتها البشرية."
      />

      <div className="relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1.5 -translate-x-1/2 recessed-well" />

        <div className="space-y-8 md:space-y-12">
          {seerahData.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35 }}
                className={`relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full tactile-pill items-center justify-center z-20">
                  <span className="w-2.5 h-2.5 rounded-full amber-glow-dot" />
                </div>

                <div
                  className={`w-full md:w-1/2 flex ${
                    isEven ? 'md:justify-start md:pl-10' : 'md:justify-end md:pr-10'
                  }`}
                >
                  <article className="tactile-card p-6 sm:p-8 w-full flex flex-col gap-4">
                    {item.media?.type === 'image' && (
                      <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden recessed-box">
                        <img
                          loading="lazy"
                          src={item.media.src}
                          alt={item.media.title || item.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="recessed-well px-3.5 py-1 text-xs font-bold text-glow">
                        {item.year}
                      </span>
                      <span className="tactile-pill px-3.5 py-1 text-xs font-bold text-ink-secondary">
                        {item.phase}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black font-cairo text-ink leading-tight">
                      {item.title}
                    </h2>

                    <div className="space-y-3">
                      {item.content.map((paragraph, idx) => (
                        <p
                          key={idx}
                          className="text-sm sm:text-base text-ink-secondary leading-[1.85]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </article>
                </div>

                <div className="hidden md:block w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Seerah;
