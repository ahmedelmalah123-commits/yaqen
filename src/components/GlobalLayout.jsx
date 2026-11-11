import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar, { TopUtilityBar } from './Navbar';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import SearchOverlay from './SearchOverlay';
import BookmarksDrawer from './BookmarksDrawer';
import { useAppStore } from '../store/useAppStore';

const GlobalLayout = ({ children }) => {
  const { theme, isYaqeenModeActive } = useAppStore();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isYaqeenPage = location.pathname === '/yaqeen';
  const isSahabaStoryMode =
    location.pathname.startsWith('/sahaba/') && location.pathname !== '/sahaba';
  const isFullscreen = isYaqeenPage || isSahabaStoryMode;

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    document.body.style.backgroundColor = isDark ? '#111110' : '#ECEAE4';
    document.body.style.color = isDark ? '#F0EDE6' : '#161615';

    const metaThemes = document.querySelectorAll('meta[name="theme-color"]');
    metaThemes.forEach((metaTheme) => {
      metaTheme.setAttribute('content', isDark ? '#111110' : '#ECEAE4');
    });
  }, [theme]);

  return (
    <div className="min-h-[100dvh] font-tajawal transition-colors duration-300 flex flex-col relative overflow-x-hidden bg-canvas text-ink">
      {/* Subtle Ambient Warm Glow when Yaqeen audio mode is active */}
      <AnimatePresence>
        {isYaqeenModeActive && (
          <motion.div
            key="yaqeen-ambient-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          >
            <motion.div
              animate={{
                opacity: [0.35, 0.65, 0.35],
                scale: [1, 1.06, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-40 left-1/4 w-[520px] h-[520px] rounded-full blur-[140px]"
              style={{ background: 'var(--accent-glow-soft)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isFullscreen && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}

      {/* Workspace Container */}
      <div
        className={`flex-1 flex flex-col relative z-10 w-full ${
          !isFullscreen
            ? 'px-3 sm:px-5 lg:pr-[116px] lg:pl-6 pt-4 page-bottom-pad'
            : ''
        }`}
      >
        {!isFullscreen && (
          <TopUtilityBar onOpenSearch={() => setIsSearchOpen(true)} />
        )}

        <main className="flex-1 w-full">{children}</main>

        {!isFullscreen && (
          <div className="mt-8 w-full">
            <Footer />
          </div>
        )}
      </div>

      {/* Overlays & Global Assistants */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BookmarksDrawer />
      <ChatWidget />
    </div>
  );
};

export default GlobalLayout;
