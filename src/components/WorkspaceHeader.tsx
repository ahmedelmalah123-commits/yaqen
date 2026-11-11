import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bookmark, Sun, Moon, SlidersHorizontal, Menu, Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import BrandLogo from './ui/BrandLogo';

interface WorkspaceHeaderProps {
  onOpenSearch: () => void;
  onOpenInstallModal?: () => void;
  bookmarksCount: number;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  onOpenSearch,
  onOpenInstallModal,
  bookmarksCount,
}) => {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const isYaqeenModeActive = useAppStore((s) => s.isYaqeenModeActive);
  const setBookmarksDrawerOpen = useAppStore((s) => s.setBookmarksDrawerOpen);
  const setSettingsDrawerOpen = useAppStore((s) => s.setSettingsDrawerOpen);
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen);

  if (isYaqeenModeActive) return null;

  const isDark = theme === 'dark';

  return (
    <header className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 pt-3 sm:pt-4 pb-2 flex items-center justify-between gap-2 sm:gap-3 font-tajawal">
      {/* Mobile Menu + Compact Brand Lockup (Sidebar is visible on lg+) */}
      <div className="flex items-center gap-2 lg:hidden shrink-0">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="فتح القائمة"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full tactile-pill flex items-center justify-center text-ink"
        >
          <Menu size={17} />
        </button>
        <Link to="/" aria-label="الرئيسية" className="shrink-0">
          <BrandLogo size="sm" showWordmark={false} />
        </Link>
      </div>

      {/* Unified Hybrid Global Search Trigger */}
      <button
        id="tour-search"
        type="button"
        onClick={onOpenSearch}
        className="flex-1 min-w-0 max-w-xl h-10 sm:h-12 recessed-well px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-3 text-ink-secondary hover:text-ink transition-colors group"
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">
          <Search size={15} className="text-glow shrink-0" />
          <span className="text-xs sm:text-sm font-semibold truncate">
            ابحث في القرآن، السور، القراء...
          </span>
        </span>
        <kbd
          className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-elevated text-[11px] font-mono text-ink-muted shrink-0"
          dir="ltr"
        >
          Ctrl+K
        </kbd>
      </button>

      {/* Right Utility Cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {onOpenInstallModal && (
          <button
            type="button"
            onClick={onOpenInstallModal}
            aria-label="تثبيت تطبيق يقين"
            title="تثبيت تطبيق يقين"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full tactile-pill flex items-center justify-center text-glow hover:text-glow-hover"
          >
            <Download size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={() => setSettingsDrawerOpen(true)}
          aria-label="تخصيص القراءة والمظهر"
          title="تخصيص القراءة"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow"
        >
          <SlidersHorizontal size={16} />
        </button>

        <button
          type="button"
          onClick={() => setBookmarksDrawerOpen(true)}
          aria-label="الآيات المحفوظة"
          title="الآيات المحفوظة"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-glow relative"
        >
          <Bookmark size={16} />
          {bookmarksCount > 0 && (
            <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full amber-glow-dot text-white text-[10px] font-bold flex items-center justify-center">
              {bookmarksCount.toLocaleString('ar-EG')}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
          title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full tactile-pill flex items-center justify-center text-glow"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};

export default WorkspaceHeader;

