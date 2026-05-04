import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import AmmBarakaChat from './AmmBarakaChat';
import { useAppStore } from '../store/useAppStore';

const GlobalLayout = ({ children }) => {
  const { theme, audioState } = useAppStore();
  const location = useLocation();

  const isYaqeenMode = location.pathname === '/yaqeen';
  const isSahabaStoryMode = location.pathname.startsWith('/sahaba/') && location.pathname !== '/sahaba';
  const isFullscreen = isYaqeenMode || isSahabaStoryMode;

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0B1120';
      document.body.style.color = '#FFFFFF';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#FAF8F5';
      document.body.style.color = '#0B1120';
    }
  }, [theme]);

  return (
    <div className={`min-h-[100dvh] font-tajawal transition-colors duration-700 flex flex-col relative overflow-x-hidden`}>
      {!isFullscreen && <Navbar />}
      <main className={`flex-1 relative z-10 w-full ${!isFullscreen ? 'page-bottom-pad pt-2 md:pt-4' : ''}`}>
        <div 
          className="fixed inset-0 pointer-events-none mix-blend-overlay opacity-5 z-0" 
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}
        ></div>
        
        {/* Animated Screensaver Overlay when playing */}
        <AnimatePresence>
          {audioState.isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: theme === 'dark' ? 0.15 : 0.08 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
            >
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-[50%] opacity-50 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {children}
      </main>
      
      {!isFullscreen && (
        <div className="relative z-10 w-full">
          <Footer />
          <AmmBarakaChat />
        </div>
      )}
      
    </div>
  );
};

export default GlobalLayout;
