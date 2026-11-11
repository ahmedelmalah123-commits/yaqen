import React, { useState, useEffect } from 'react';
import { Heart, Instagram, Phone, Mail } from 'lucide-react';

const prayers = [
  { start: 'اللهم احفظ عبدك الفقير', name: 'أحمد الملاح', end: 'واكفه شر كل حاسد وحاقد 🤲' },
  { start: 'اللهم اغفر لعبدك', name: 'أحمد الملاح', end: 'وارحمه وعافه واعف عنه 🤲' },
  { start: 'اللهم ارزق عبدك', name: 'أحمد الملاح', end: 'علماً نافعاً وعملاً متقبلاً 🤲' },
  { start: 'اللهم تقبل هذا العمل من', name: 'أحمد الملاح', end: 'واجعله صدقة جارية تنفعه 🤲' },
  { start: 'اللهم نور قلب عبدك', name: 'أحمد الملاح', end: 'بالإيمان واشرح صدره بالقرآن 🤲' },
];

const Footer = () => {
  const [prayerMatch, setPrayerMatch] = useState(prayers[0]);

  useEffect(() => {
    const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)];
    setPrayerMatch(randomPrayer);
  }, []);

  return (
    <footer className="max-w-[1440px] mx-auto w-full bento-stage p-5 sm:p-8 transition-colors duration-300">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Developer Contact Hub */}
          <div className="lg:col-span-5 recessed-box p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="text-right" dir="rtl">
              <h5 className="font-bold text-base sm:text-lg text-ink font-cairo mb-1">
                تواصل مع المطور
              </h5>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                لترشيح أفكار، تطوير المنصة، أو للأعمال التطوعية، تواصل عبر:
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/201067568065"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow transition-colors"
                title="واتساب"
              >
                <Phone size={17} />
              </a>
              <a
                href="https://www.instagram.com/eng_mala7/"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow transition-colors"
                title="إنستغرام"
              >
                <Instagram size={17} />
              </a>
              <a
                href="mailto:engmala7112004@gmail.com"
                className="w-11 h-11 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow transition-colors"
                title="البريد الإلكتروني"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Da3wa Banner */}
          <div
            className="lg:col-span-7 tactile-card p-5 sm:p-6 flex items-center justify-center text-center"
            dir="rtl"
          >
            <div className="text-base sm:text-xl font-bold leading-relaxed font-amiri text-ink">
              <span className="font-cairo text-xs sm:text-sm text-ink-muted block mb-1.5">
                دعوة بظهر الغيب
              </span>
              <span>{prayerMatch.start}</span>{' '}
              <span className="text-glow">{prayerMatch.name}</span>{' '}
              <span>{prayerMatch.end}</span>
            </div>
          </div>
        </div>

        {/* Bottom Dedication */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--glass-border-subtle)] text-xs sm:text-sm text-ink-secondary">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full amber-glow-dot inline-block" />
            <span className="font-bold text-ink">منصة يقين</span>
            <span className="text-ink-muted">— معرفة تُثمر يقيناً</span>
          </div>

          <p className="text-center text-xs sm:text-sm text-ink-secondary" dir="rtl">
            صُنع في حب الله، من أخيك في الإسلام أحمد الملاح —{' '}
            <span className="inline-flex items-center gap-1 font-bold text-glow">
              صدقة جارية <Heart size={13} fill="currentColor" />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
