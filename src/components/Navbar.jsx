import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import {
  Shield,
  Home,
  BookOpen,
  Radio as RadioIcon,
  Users,
  Compass,
  Headphones,
  Search,
  Menu,
  X,
  Bookmark,
  Sun,
  Moon,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { getBookmarks, BOOKMARKS_EVENT } from '../lib/bookmarks';

export const navLinks = [
  { path: '/', label: 'الرئيسية', icon: Home },
  { path: '/quran', label: 'المصحف', icon: BookOpen },
  { path: '/reciters', label: 'القراء', icon: Headphones },
  { path: '/radio', label: 'الإذاعة', icon: RadioIcon },
  { path: '/seerah', label: 'السيرة', icon: Compass },
  { path: '/sahaba', label: 'الصحابة', icon: Users },
  { path: '/ruqyah', label: 'الرقية', icon: Shield },
  { path: '/yaqeen', label: 'يقين', icon: Sparkles },
];

export const TopUtilityBar = ({ onOpenSearch }) => {
  const { theme, toggleTheme, setBookmarksDrawerOpen } = useAppStore();
  const [bookmarksCount, setBookmarksCount] = useState(() => getBookmarks().length);

  useEffect(() => {
    const sync = () => setBookmarksCount(getBookmarks().length);
    window.addEventListener(BOOKMARKS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <header className="max-w-[1440px] mx-auto w-full mb-5 flex items-center gap-3">
      {/* 1. Brand Orb — Warm Amber Slash / Glow Mark */}
      <Link
        to="/"
        className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full tactile-pill flex items-center justify-center group relative overflow-hidden"
        title="يقين — الصفحة الرئيسية"
      >
        <div className="relative flex items-center justify-center w-8 h-8">
          <span
            className="w-1.5 h-6 rounded-full -rotate-[22deg] transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: 'var(--accent-glow)',
              boxShadow: 'var(--accent-glow-shadow)',
            }}
          />
          <span className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-ink/80" />
        </div>
      </Link>

      {/* 2. Recessed Search Well */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="recessed-well flex-1 min-w-0 h-12 sm:h-14 px-4 sm:px-5 flex items-center justify-between gap-3 text-right cursor-pointer group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Search
            size={18}
            className="shrink-0 text-ink-secondary group-hover:text-glow transition-colors"
          />
          <span className="text-xs sm:text-sm font-medium text-ink-secondary truncate">
            ابحث في المصحف، السور، أو القراء...
          </span>
        </div>

        <span
          className="hidden sm:inline-flex items-center gap-1 tactile-pill px-2.5 py-1 text-[11px] font-mono font-bold text-ink-secondary shrink-0"
          dir="ltr"
        >
          ⌘K
        </span>
      </button>

      {/* Mobile quick bookmarks orb */}
      <button
        type="button"
        onClick={() => setBookmarksDrawerOpen(true)}
        className="lg:hidden w-12 h-12 shrink-0 rounded-full tactile-pill flex items-center justify-center relative text-ink-secondary hover:text-glow transition-colors"
        title="محفوظاتي"
      >
        <Bookmark size={17} />
        <span className="absolute -top-1 -left-1 min-w-[20px] h-5 px-1 rounded-full amber-glow-dot text-white text-[10px] font-bold flex items-center justify-center">
          {bookmarksCount.toLocaleString('ar-EG')}
        </span>
      </button>

      {/* 3. Tactile Theme Switcher */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'تبديل للوضع الفاتح الكريمي' : 'تبديل للوضع الداكن الفحمي'}
        title={isDark ? 'الوضع الكريمي النهاري' : 'الوضع الفحمي الليلي'}
        className="recessed-well p-1.5 w-[78px] sm:w-[88px] h-12 sm:h-14 shrink-0 flex items-center relative cursor-pointer"
        dir="ltr"
      >
        {/* Background subtle icons */}
        <div className="w-full flex items-center justify-between px-2.5 text-ink-muted pointer-events-none">
          <Sun size={14} />
          <Moon size={14} />
        </div>

        {/* Sliding Raised Puck */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          className={`absolute top-1.5 bottom-1.5 w-9 sm:w-10 rounded-full tactile-pill flex items-center justify-center ${
            isDark ? 'right-1.5 text-glow' : 'left-1.5 text-glow'
          }`}
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.div>
      </button>
    </header>
  );
};

const Navbar = ({ onOpenSearch }) => {
  const location = useLocation();
  const {
    isYaqeenModeActive,
    setTourOpen,
    setBookmarksDrawerOpen,
  } = useAppStore();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(() => getBookmarks().length);

  // Sync bookmarks counter
  useEffect(() => {
    const sync = () => setBookmarksCount(getBookmarks().length);
    window.addEventListener(BOOKMARKS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Keyboard shortcut Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const isActivePath = (linkPath) => {
    if (linkPath === '/') return location.pathname === '/';
    if (linkPath === '/quran' && location.pathname.startsWith('/surah')) return true;
    return location.pathname.startsWith(linkPath);
  };

  const mobileTopLinks = navLinks.slice(0, 4);

  return (
    <>
      {/* ── Desktop Right Vertical Pill Dock (Carved Side-Dock) ── */}
      <aside
        className="hidden lg:flex fixed right-4 top-4 bottom-4 w-[88px] z-40 flex-col items-center justify-between gap-3"
        aria-label="التنقل الرئيسي"
      >
        {/* Main Carved Glass Vertical Pill */}
        <nav className="tactile-card w-full flex-1 rounded-[44px] py-3 px-2 flex flex-col items-center justify-between overflow-y-auto no-scrollbar">
          {/* Navigation Items */}
          <div className="w-full flex flex-col items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = isActivePath(link.path);
              const Icon = link.icon;
              const isYaqeenLink = link.path === '/yaqeen';

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative w-full py-2 px-1 rounded-3xl flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                    isActive
                      ? 'tactile-pill text-ink font-extrabold'
                      : 'text-ink-secondary hover:text-ink hover:bg-[var(--bg-recessed)]/60 font-semibold'
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full amber-glow-dot"
                      aria-hidden="true"
                    />
                  )}
                  {isYaqeenLink && isYaqeenModeActive && !isActive && (
                    <span className="absolute top-1.5 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-glow opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-glow" />
                    </span>
                  )}
                  <Icon
                    size={18}
                    className={isActive ? 'text-glow' : 'opacity-80'}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className="text-[10px] leading-none tracking-tight">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Bookmarks Counter Orb («محفوظاتي») */}
          <button
            type="button"
            onClick={() => setBookmarksDrawerOpen(true)}
            className="mt-2 w-14 h-14 shrink-0 rounded-full tactile-pill flex flex-col items-center justify-center gap-0.5 relative group hover:border-glow-border"
            title="محفوظاتي القرآنية"
          >
            <Bookmark
              size={16}
              className={
                bookmarksCount > 0
                  ? 'text-glow fill-current'
                  : 'text-ink-secondary group-hover:text-glow'
              }
            />
            <span className="text-[10px] font-bold text-ink">
              {bookmarksCount.toLocaleString('ar-EG')}
            </span>
          </button>
        </nav>

        {/* Bottom Detached Carved Orb — Site Tour */}
        <button
          type="button"
          onClick={() => setTourOpen(true)}
          className="w-14 h-14 shrink-0 rounded-full tactile-card flex items-center justify-center text-ink-secondary hover:text-glow transition-all hover:scale-105"
          title="جولة في الموقع"
          aria-label="جولة في الموقع"
        >
          <HelpCircle size={20} />
        </button>
      </aside>

      {/* ── Mobile Bottom Floating Frosted Pill Dock ── */}
      <nav
        className="lg:hidden fixed bottom-3 inset-x-3 z-40 glass-card rounded-full px-2 py-1.5 shadow-raised"
        aria-label="شريط التنقل السفلي"
      >
        <div className="flex items-center justify-around h-14 w-full">
          {mobileTopLinks.map((link) => {
            const isActive = isActivePath(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-full gap-1 transition-all ${
                  isActive
                    ? 'tactile-pill text-glow font-bold'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="text-[10px] leading-none">{link.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-full gap-1 text-ink-secondary hover:text-ink transition-all"
          >
            <Menu size={18} />
            <span className="text-[10px] leading-none font-bold">المزيد</span>
          </button>
        </div>
      </nav>

      {/* ── Mobile More Drawer ── */}
      <AnimatePresence>
        {isMoreOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-end"
            onClick={() => setIsMoreOpen(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[82vh] rounded-t-[32px] bento-stage flex flex-col pt-5 pb-8 px-5 font-tajawal"
            >
              <div className="w-12 h-1.5 rounded-full recessed-well mx-auto mb-4" />
              <div className="flex justify-between items-center pb-4 border-b border-[var(--glass-border-subtle)]">
                <h2 className="text-xl font-extrabold text-ink font-cairo">
                  الأقسام والأدوات
                </h2>
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(false)}
                  className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-ink-secondary"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 grid grid-cols-2 gap-3 no-scrollbar">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isActivePath(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMoreOpen(false)}
                      className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${
                        isActive
                          ? 'active-ayah-glow text-ink font-bold'
                          : 'tactile-card text-ink-secondary'
                      }`}
                    >
                      <Icon size={20} className={isActive ? 'text-glow' : ''} />
                      <span className="text-sm font-bold">{link.label}</span>
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    setBookmarksDrawerOpen(true);
                  }}
                  className="p-4 rounded-2xl tactile-card flex items-center justify-between text-ink-secondary"
                >
                  <div className="flex items-center gap-2.5">
                    <Bookmark size={20} className="text-glow" />
                    <span className="text-sm font-bold">محفوظاتي</span>
                  </div>
                  <span className="tactile-pill px-2 py-0.5 text-xs font-bold text-ink">
                    {bookmarksCount.toLocaleString('ar-EG')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    setTourOpen(true);
                  }}
                  className="p-4 rounded-2xl tactile-card flex items-center gap-2.5 text-ink-secondary"
                >
                  <HelpCircle size={20} />
                  <span className="text-sm font-bold">جولة في الموقع</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
