import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Compass } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div
      className="bento-stage p-8 sm:p-14 text-center flex flex-col items-center gap-5 max-w-2xl mx-auto my-8"
      dir="rtl"
    >
      <div className="w-16 h-16 rounded-3xl recessed-box flex items-center justify-center text-glow">
        <Compass size={30} />
      </div>

      <div className="space-y-2">
        <span className="recessed-well px-3.5 py-1 text-xs font-mono font-bold text-glow inline-block">
          404
        </span>
        <h1 className="text-2xl sm:text-4xl font-black font-cairo text-ink">
          الصفحة غير موجودة
        </h1>
        <p className="text-sm sm:text-base text-ink-secondary max-w-md mx-auto leading-relaxed">
          يبدو أن الرابط الذي اتبعته غير متوفر أو تم نقله. يمكنك العودة إلى الصفحة الرئيسية أو متابعة التلاوة في المصحف الشريف.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="tactile-pill active-ayah-glow px-5 py-2.5 text-sm font-extrabold text-glow flex items-center gap-2"
        >
          <Home size={16} />
          <span>العودة للرئيسية</span>
        </Link>

        <Link
          to="/quran"
          className="tactile-pill px-5 py-2.5 text-sm font-bold text-ink hover:text-glow flex items-center gap-2"
        >
          <BookOpen size={16} />
          <span>فهرس القرآن الكريم</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

