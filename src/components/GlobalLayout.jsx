import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppStore } from '../store/useAppStore';

const GlobalLayout = ({ children }) => {
  const { theme, isYaqeenModeActive } = useAppStore();
  const location = useLocation();

  const isYaqeenPage = location.pathname === '/yaqeen';
  const isSahabaStoryMode = location.pathname.startsWith('/sahaba/') && location.pathname !== '/sahaba';
  const isFullscreen = isYaqeenPage || isSahabaStoryMode;

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#022c22';
      document.body.style.color = '#FFFFFF';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#FAF8F5';
      document.body.style.color = '#022c22';
    }
  }, [theme]);

  return (
    <div className={`min-h-[100dvh] font-tajawal transition-colors duration-700 flex flex-col relative overflow-x-hidden`}>
      {!isFullscreen && <Navbar />}

      <main className={`flex-1 relative w-full ${!isFullscreen ? 'page-bottom-pad pt-2 md:pt-4' : ''}`}>
        {/* Static arabesque grain overlay */}
        <div
          className="fixed inset-0 pointer-events-none mix-blend-overlay opacity-5 z-0"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}
        ></div>

        {/* ── Yaqeen Mode ambient glow overlay ── */}
        <AnimatePresence>
          {isYaqeenModeActive && (
            <motion.div
              key="yaqeen-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: theme === 'dark' ? 0.18 : 0.09 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5 }}
              className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
            >
              {/* Slow-rotating arabesque pattern */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-[50%] opacity-60 mix-blend-overlay"
                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}
              />
              {/* Pulsing radial gold/green aura */}
              <motion.div
                animate={{
                  background: [
                    'radial-gradient(ellipse at 30% 40%, rgba(198,156,109,0.15) 0%, transparent 60%)',
                    'radial-gradient(ellipse at 70% 60%, rgba(6,78,59,0.25) 0%, transparent 60%)',
                    'radial-gradient(ellipse at 50% 20%, rgba(198,156,109,0.12) 0%, transparent 60%)',
                    'radial-gradient(ellipse at 30% 40%, rgba(198,156,109,0.15) 0%, transparent 60%)',
                  ],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {children}
      </main>

      {!isFullscreen && (
        <div className="relative z-10 w-full">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default GlobalLayout;
