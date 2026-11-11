import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Facebook, Heart, Sparkles, BookOpen, Film, Radio, ShieldCheck } from 'lucide-react';
import BrandLogo from './ui/BrandLogo';

export const DEVELOPER_INFO = {
  name: 'المهندس / أحمد الملاح',
  role: 'برمجة وتطوير ',
  // Contact links: configurable via props or environment
  email: 'mala7.eg@gmail.com', // Awaiting user input
  instagram: 'https://www.instagram.com/eng_mala7/', // Awaiting user input
  facebook: 'https://www.facebook.com/a7medalmala7/?locale=sw_KE', // Awaiting user input
};

const QURAN_LINKS = [
  { label: 'المصحف الشريف', to: '/quran' },
  { label: 'قراء القرآن', to: '/reciters' },
  { label: 'الإذاعات المباشرة', to: '/radio' },
  { label: 'وضع اليقين', to: '/yaqeen' },
  { label: 'حصن المسلم والأذكار', to: '/ruqyah' },
];

const KNOWLEDGE_LINKS = [
  { label: 'واحة المعرفة الإسلامية', to: '/knowledge' },
  { label: 'قصص القرآن (٨٨ حلقة)', to: '/stories' },
  { label: 'محطات السيرة النبوية', to: '/seerah' },
  { label: 'سير الصحابة الكرام', to: '/sahaba' },
];

export const Footer = () => {
  return (
    <footer className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 pt-6 pb-20 lg:pb-8 font-tajawal text-ink" dir="rtl">
      <div className="bento-stage p-6 sm:p-8 flex flex-col gap-6">
        {/* Top 3-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-[var(--glass-border-subtle)]">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <Link to="/" className="w-fit">
              <BrandLogo size="md" showTagline={false} />
            </Link>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-md">
              منصة قرآنية إسلامية هادئة صُممت لتكون ملاذك اليومي للتدبر والتلاوة، خالية من أي إعلانات أو مشتتات، ترتكز على كتاب الله وسنة رسوله ﷺ.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-ink-muted">
              <span className="w-2 h-2 rounded-full amber-glow-dot shrink-0" />
              <span>وقف لوجه الله تعالى · محتوى موثق ومحفوظ</span>
            </div>
          </div>

          {/* Col 2: Quran Services */}
          <div className="md:col-span-4 flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
              القرآن الكريم والعبادة
            </h3>
            <ul className="flex flex-col gap-1.5">
              {QURAN_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs sm:text-sm text-ink-secondary hover:text-glow transition-colors font-semibold inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Knowledge & Stories Hub */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
              المعرفة والقصص
            </h3>
            <ul className="flex flex-col gap-1.5">
              {KNOWLEDGE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs sm:text-sm text-ink-secondary hover:text-glow transition-colors font-semibold inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle Row: Content & Services Integrity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink-secondary">
          <p className="leading-relaxed">
            نص المصحف بالرسم العثماني برواية حفص عن عاصم · التفسير الميسر · صوتيات قرآنية متعددة القراء · محطات إذاعية مباشرة
          </p>
          <span className="recessed-well px-3 py-1 text-[11px] font-bold text-glow w-fit shrink-0">
            تحديث مستمر للمحتوى
          </span>
        </div>

        {/* Bottom Row: Developer Attribution & Copyright */}
        <div className="pt-4 border-t border-[var(--glass-border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          {/* Subtle Professional Developer Attribution */}
          <div className="flex flex-wrap items-center gap-2 text-ink-secondary">
            <span className="font-semibold text-ink">
              برمجة وتطوير الواجهة: {DEVELOPER_INFO.name}
            </span>
            <span className="text-ink-muted hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5">
              {DEVELOPER_INFO.email && !DEVELOPER_INFO.email.includes('example.com') ? (
                <a
                  href={`mailto:${DEVELOPER_INFO.email}`}
                  title="تواصل عبر البريد الإلكتروني"
                  aria-label="البريد الإلكتروني للمطور"
                  className="tactile-pill w-7 h-7 rounded-full flex items-center justify-center text-ink-secondary hover:text-glow transition-colors"
                >
                  <Mail size={13} />
                </a>
              ) : null}

              {DEVELOPER_INFO.instagram && DEVELOPER_INFO.instagram !== 'https://instagram.com/' ? (
                <a
                  href={DEVELOPER_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="حساب إنستغرام"
                  aria-label="حساب إنستغرام للمطور"
                  className="tactile-pill w-7 h-7 rounded-full flex items-center justify-center text-ink-secondary hover:text-glow transition-colors"
                >
                  <Instagram size={13} />
                </a>
              ) : null}

              {DEVELOPER_INFO.facebook && DEVELOPER_INFO.facebook !== 'https://facebook.com/' ? (
                <a
                  href={DEVELOPER_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="حساب فيسبوك"
                  aria-label="حساب فيسبوك للمطور"
                  className="tactile-pill w-7 h-7 rounded-full flex items-center justify-center text-ink-secondary hover:text-glow transition-colors"
                >
                  <Facebook size={13} />
                </a>
              ) : null}
            </div>
          </div>

          <p className="text-ink-muted">
            © {new Date().getFullYear()} منصة يقين الإسلامية — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
