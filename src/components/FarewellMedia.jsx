import React, { useState } from 'react';
import { Play, Video, ExternalLink } from 'lucide-react';

const VIDEO_ID = 'lDeF9l_pdcU';
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

const FarewellMedia = () => {
  const [activated, setActivated] = useState(false);

  return (
    <section className="tactile-card p-5 sm:p-6 flex flex-col gap-4" dir="rtl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-ink-muted block">
            مرئيات السيرة النبوية
          </span>
          <h2 className="text-lg font-extrabold font-cairo text-ink">
            خطبة الوداع ويوم فتح مكة
          </h2>
          <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
            شاهد الخطب والمواقف الخالدة في تاريخ الإسلام بتشغيل هادئ عند الطلب.
          </p>
        </div>

        <span className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-glow shrink-0">
          <Video size={16} />
        </span>
      </div>

      <div className="relative w-full aspect-video rounded-2xl overflow-hidden recessed-box">
        {!activated ? (
          <button
            type="button"
            onClick={() => setActivated(true)}
            aria-label="تشغيل فيديو خطبة الوداع ويوم فتح مكة"
            className="absolute inset-0 w-full h-full group cursor-pointer"
          >
            <img
              src={`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`}
              alt="خطبة الوداع ويوم فتح مكة"
              loading="lazy"
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="w-14 h-14 rounded-full tactile-pill flex items-center justify-center text-glow group-hover:scale-110 transition-transform">
                <Play size={24} fill="currentColor" />
              </span>
            </span>
          </button>
        ) : (
          <iframe
            className="w-full h-full"
            src={EMBED_URL}
            title="خطبة الوداع ويوم فتح مكة"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <a
        href={WATCH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-bold text-ink-secondary hover:text-glow flex items-center gap-1.5 w-fit"
      >
        <span>فتح في يوتيوب</span>
        <ExternalLink size={12} />
      </a>
    </section>
  );
};

export default FarewellMedia;
