import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  showWordmark?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { box: 'w-9 h-9', title: 'text-base', sub: 'text-[10px]' },
  md: { box: 'w-11 h-11', title: 'text-lg', sub: 'text-[11px]' },
  lg: { box: 'w-12 h-12 sm:w-14 sm:h-14', title: 'text-2xl', sub: 'text-xs' },
};

/**
 * Swap-ready official Yaqeen brand lockup preserving /public/logo.png.
 * Uses a deep charcoal badge frame so light emblem artwork stays razor-sharp in Daylight Ivory and Dark modes.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  showWordmark = true,
  className = '',
}) => {
  const s = SIZE_MAP[size];

  return (
    <div className={`inline-flex items-center gap-3 shrink-0 ${className}`}>
      <div
        className={`${s.box} rounded-2xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden bg-[#1D221F] border border-black/10 dark:border-white/15 shadow-raised-sm`}
      >
        <img
          src="/logo.png"
          alt="شعار منصة يقين"
          className="w-full h-full object-contain"
        />
      </div>
      {showWordmark && (
        <div className="min-w-0 leading-tight">
          <span className={`${s.title} font-black font-cairo text-ink block`}>
            يقين
          </span>
          {showTagline && (
            <span className={`${s.sub} font-medium text-ink-muted block truncate`}>
              معرفة تُثمر يقيناً
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
