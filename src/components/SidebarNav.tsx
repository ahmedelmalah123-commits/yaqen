import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  Mic2,
  Radio,
  ShieldCheck,
  Sparkles,
  Landmark,
  Users,
  Film,
  Bookmark,
  SlidersHorizontal,
  HelpCircle,
  Search,
  X,
  Menu,
  Download,
  BookOpenText,
} from 'lucide-react';
import BrandLogo from './ui/BrandLogo';
import { useAppStore } from '../store/useAppStore';
import { useDialogAccessibility } from './ui/OverlayPrimitives';

export const PRIMARY_NAV_LINKS = [
  // القرآن الكريم
  { label: 'الرئيسية', path: '/', icon: Home, group: 'القرآن الكريم' },
  { label: 'اقرأ القرآن', path: '/quran', icon: BookOpen, matchPrefix: '/surah', group: 'القرآن الكريم' },
  { label: 'استمع للقرآن', path: '/reciters', icon: Mic2, group: 'القرآن الكريم' },
  { label: 'المحطات الإذاعية', path: '/radio', icon: Radio, group: 'القرآن الكريم' },

  // المعرفة والقصص
  { label: 'واحة المعرفة', path: '/knowledge', matchPrefix: '/hub', icon: BookOpenText, group: 'المعرفة والقصص' },
  { label: 'قصص القرآن', path: '/stories', icon: Film, group: 'المعرفة والقصص' },
  { label: 'السيرة النبوية', path: '/seerah', icon: Landmark, group: 'المعرفة والقصص' },
  { label: 'سير الصحابة', path: '/sahaba', matchPrefix: '/sahaba', icon: Users, group: 'المعرفة والقصص' },

  // العبادة والمواسم
  { label: 'حصن المسلم والأذكار', path: '/ruqyah', icon: ShieldCheck, group: 'العبادة والمواسم' },
  { label: 'وضع اليقين', path: '/yaqeen', icon: Sparkles, group: 'العبادة والمواسم' },
];

export const MOBILE_BAR_LINKS = [
  { label: 'الرئيسية', path: '/', icon: Home },
  { label: 'المصحف', path: '/quran', matchPrefix: '/surah', icon: BookOpen },
  { label: 'القراء', path: '/reciters', icon: Mic2 },
  { label: 'الإذاعة', path: '/radio', icon: Radio },
];

interface SidebarNavProps {
  onOpenSearch: () => void;
  onOpenInstallModal?: () => void;
  bookmarksCount: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  onOpenSearch,
  onOpenInstallModal,
  bookmarksCount,
}) => {
  const location = useLocation();
  const isYaqeenModeActive = useAppStore((s) => s.isYaqeenModeActive);
  const isMobileNavOpen = useAppStore((s) => s.isMobileNavOpen);
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen);
  const setBookmarksDrawerOpen = useAppStore((s) => s.setBookmarksDrawerOpen);
  const setSettingsDrawerOpen = useAppStore((s) => s.setSettingsDrawerOpen);
  const setTourOpen = useAppStore((s) => s.setTourOpen);

  // Accessibility & scroll locking for mobile drawer
  useDialogAccessibility(isMobileNavOpen, () => setMobileNavOpen(false));

  if (isYaqeenModeActive) return null;

  const isActivePath = (item: (typeof PRIMARY_NAV_LINKS)[number]) => {
    if (item.path === '/') return location.pathname === '/';
    if (item.matchPrefix && location.pathname.startsWith(item.matchPrefix)) return true;
    return location.pathname === item.path;
  };

  const groups = ['القرآن الكريم', 'المعرفة والقصص', 'العبادة والمواسم'];

  const renderNavBody = (onNavigate?: () => void) => (
    <div className="flex flex-col h-full gap-4 overflow-y-auto no-scrollbar" dir="rtl">
      {/* Quick Search Button */}
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          onOpenSearch();
        }}
        className="w-full recessed-well px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs text-ink-secondary hover:text-ink transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold">
          <Search size={14} className="text-glow" />
          <span>ابحث في يقين...</span>
        </span>
        <kbd className="text-[10px] font-mono text-ink-muted hidden sm:inline" dir="ltr">
          Ctrl+K
        </kbd>
      </button>

      {/* Grouped Navigation */}
      <nav aria-label="القائمة الرئيسية" className="flex-1 flex flex-col gap-4">
        {groups.map((groupTitle) => (
          <div key={groupTitle} className="flex flex-col gap-1">
            <span className="px-3 text-[11px] font-bold text-ink-muted">
              {groupTitle}
            </span>
            {PRIMARY_NAV_LINKS.filter((item) => item.group === groupTitle).map((item) => {
              const Icon = item.icon;
              const active = isActivePath(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-2xl text-xs sm:text-sm transition-all ${
                    active
                      ? 'tactile-pill active-ayah-glow text-ink font-extrabold'
                      : 'text-ink-secondary hover:text-ink hover:bg-recessed/55 font-semibold'
                  }`}
                >
                  <Icon
                    size={16}
                    className={active ? 'text-glow shrink-0' : 'text-ink-muted shrink-0'}
                  />
                  <span className="truncate">{item.label}</span>
                  {active && (
                    <span className="mr-auto w-1.5 h-1.5 rounded-full amber-glow-dot shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Utility Actions */}
      <div className="pt-3 border-t border-[var(--glass-border-subtle)] flex flex-col gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            setBookmarksDrawerOpen(true);
          }}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-ink-secondary hover:text-ink hover:bg-recessed/55 transition-colors"
        >
          <span className="flex items-center gap-3">
            <Bookmark size={15} className="text-glow" />
            <span>محفوظاتي</span>
          </span>
          <span className="tactile-pill px-2 py-0.5 text-[11px] font-mono font-bold text-ink">
            {bookmarksCount.toLocaleString('ar-EG')}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            setSettingsDrawerOpen(true);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-ink-secondary hover:text-ink hover:bg-recessed/55 transition-colors"
        >
          <SlidersHorizontal size={15} />
          <span>تخصيص القراءة</span>
        </button>

        {onOpenInstallModal && (
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              onOpenInstallModal();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-glow hover:bg-recessed/55 transition-colors"
          >
            <Download size={15} />
            <span>تثبيت التطبيق</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            setTourOpen(true);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-ink-secondary hover:text-ink hover:bg-recessed/55 transition-colors"
        >
          <HelpCircle size={15} />
          <span>جولة تعريفية</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanently Expanded Right Sidebar */}
      <aside
        aria-label="الشريط الجانبي الثابت"
        className="hidden lg:flex fixed right-0 top-0 bottom-0 w-[248px] z-30 p-4 flex-col gap-4 bg-stage border-l border-[var(--border-tactile)]"
      >
        <Link to="/" className="px-1 pt-1 shrink-0">
          <BrandLogo size="md" showTagline />
        </Link>
        {renderNavBody()}
      </aside>

      {/* Mobile / Tablet Bottom Dock with Safe Area Support */}
      <nav
        aria-label="التنقل السريع للهاتف"
        className="lg:hidden fixed bottom-2 inset-x-2.5 z-40 glass-card rounded-full px-2 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom,0px))]"
      >
        <div className="flex items-center justify-around h-12 max-w-md mx-auto">
          {MOBILE_BAR_LINKS.map((item) => {
            const Icon = item.icon;
            const active =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname === item.path ||
                  (item.matchPrefix && location.pathname.startsWith(item.matchPrefix));

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center px-2.5 py-1 rounded-full gap-0.5 transition-all ${
                  active ? 'tactile-pill text-glow font-bold scale-105' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                <Icon size={17} />
                <span className="text-[10px] leading-none">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="فتح قائمة الأقسام والخدمات"
            className="flex flex-col items-center justify-center px-2.5 py-1 rounded-full gap-0.5 text-ink-secondary hover:text-ink"
          >
            <Menu size={17} />
            <span className="text-[10px] leading-none font-bold">المزيد</span>
          </button>
        </div>
      </nav>

      {/* Mobile / Tablet Slide Drawer with Reliable Close Button & Backdrop */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMobileNavOpen(false)}
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          >
            {/* Slide-in Drawer from Right Edge */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="قائمة الأقسام والتنقل"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed right-0 top-0 bottom-0 w-[290px] max-w-[85vw] h-full bg-stage border-l border-[var(--border-tactile)] p-4 flex flex-col gap-4 shadow-2xl z-50"
              dir="rtl"
            >
              {/* Drawer Header with Explicit Touch Target Close Button */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--glass-border-subtle)] shrink-0">
                <Link to="/" onClick={() => setMobileNavOpen(false)}>
                  <BrandLogo size="sm" showTagline />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink active:scale-95 transition-transform"
                >
                  <X size={18} />
                </button>
              </div>

              {renderNavBody(() => setMobileNavOpen(false))}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarNav;
