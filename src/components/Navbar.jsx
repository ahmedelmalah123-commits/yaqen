import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Shield, Home, Book, Radio as RadioIcon, Users, PlayCircle, Gamepad2, Compass, Mic, Wind, UserCircle, Headphones, Search, Menu, X } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

const navLinks = [
  { path: '/', label: 'الرئيسية', icon: Home },
  { path: '/quran', label: 'القرآن', icon: Book },
  { path: '/reciters', label: 'القراء', icon: Headphones },
  { path: '/radio', label: 'الإذاعة', icon: RadioIcon },
  { path: '/sahaba', label: 'الصحابة', icon: Users },
  { path: '/ruqyah', label: 'الحصن', icon: Shield },
  { path: '/seerah', label: 'السيرة', icon: Compass },
];

const Navbar = () => {
  const location = useLocation();
  const { theme, isYaqeenModeActive } = useAppStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hide Top Nav on Scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) setIsHidden(true); // scrolling down
    else setIsHidden(false); // scrolling up
  });

  const links = navLinks;
  const mobileTopLinks = links.slice(0, 4);

  const isActivePath = (linkPath) => {
    if (linkPath === '/') return location.pathname === '/';
    return location.pathname.startsWith(linkPath);
  };

  return (
    <>
    <motion.nav 
      initial={{ y: 0 }}
      animate={{ y: isHidden ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 z-40 w-full backdrop-blur-xl transition-colors duration-500 border-b ${theme === 'dark' ? 'bg-[#022c22]/80 border-primary/20' : 'bg-[#FAF8F5]/80 border-secondary/10 shadow-sm'}`}
    >
      <div className="container mx-auto px-4 h-20 md:h-28 flex items-center justify-between gap-2">
        <div className="flex shrink-0 items-center gap-4">
          <Link to="/" className="flex-shrink-0 group">
            <img loading="lazy" 
              src="/logo.png" 
              alt="Yaqeen Logo" 
              className="w-12 h-12 md:w-20 md:h-20 object-contain group-hover:scale-105 transition-transform" 
              style={{ filter: "brightness(0) saturate(100%) invert(80%) sepia(21%) saturate(942%) hue-rotate(349deg) brightness(87%) contrast(92%)" }} 
            />
          </Link>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className={`p-3 rounded-full border transition-all hover:scale-105 flex items-center justify-center
              ${theme === 'dark' ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-secondary' : 'bg-secondary/5 border-secondary/20 text-secondary hover:bg-secondary hover:text-white'}
            `}
            title="بحث"
          >
            <Search size={22} />
          </button>
        </div>
        
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        
        {/* Desktop Navigation (Hidden on mobile) */}
        <div className="hidden md:flex flex-1 items-center justify-evenly gap-3 overflow-x-auto no-scrollbar py-2 px-2 mask-linear-gradient">
          {links.map((link) => {
            const isActive = isActivePath(link.path);
            const Icon = link.icon;
            return (
                <Link 
                key={link.path} 
                to={link.path} 
                className={`relative px-4 py-2 transition-all duration-300 font-bold z-10 whitespace-nowrap flex items-center gap-1.5 
                  ${isActive 
                    ? (theme === 'dark' ? 'text-primary' : 'text-secondary font-black')
                    : (theme === 'dark' ? 'text-white/70 hover:text-primary' : 'text-secondary/60 hover:text-secondary')
                  }
                `}
              >
                {isActive && (
                  <motion.div 
                    layoutId="navbar-active"
                    className={`absolute -bottom-2 inset-x-0 mx-auto h-1 rounded-full ${theme === 'dark' ? 'bg-primary shadow-[0_0_10px_rgba(198,156,109,0.6)] w-full' : 'bg-secondary w-full'}`}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {Icon && <Icon size={isActive ? 20 : 18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'opacity-60'}`} />}
                <span className={`text-base tracking-tight ${isActive ? 'opacity-100' : 'opacity-80'}`}>{link.label}</span>
              </Link>
            );
          })}

          {/* Yaqeen Mode Quick-Link */}
          <Link
            to="/yaqeen"
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all border
              ${
                isActivePath('/yaqeen')
                  ? 'bg-primary text-secondary border-primary shadow-[0_0_18px_rgba(198,156,109,0.5)]'
                  : (theme === 'dark'
                    ? 'border-primary/30 text-primary/80 hover:bg-primary/10 hover:border-primary'
                    : 'border-secondary/30 text-secondary/70 hover:bg-secondary/10 hover:border-secondary')
              }
            `}
          >
            {isYaqeenModeActive && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
            <PlayCircle size={16} />
            وضع اليقين
          </Link>
        </div>
      </div>
    </motion.nav>

    {/* Mobile Bottom Tab Bar */}
    <nav className={`md:hidden fixed bottom-14 left-0 right-0 z-40 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-[env(safe-area-inset-bottom)]
        ${theme === 'dark' ? 'bg-[#022c22]/90 border-primary/20 text-white' : 'bg-white/90 border-secondary/10 text-secondary'}
    `}>
      <div className="flex items-center justify-around h-16 w-full">
         {mobileTopLinks.map((link) => {
            const isActive = isActivePath(link.path);
            const Icon = link.icon;
            return (
              <Link key={link.path} to={link.path} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all
                  ${isActive ? (theme === 'dark' ? 'text-[#C69C6D]' : 'text-[#1B4F3B]') : 'opacity-50'}
              `}>
                <Icon size={20} className={isActive ? 'fill-current' : ''} />
                <span className="text-[10px] font-bold">{link.label}</span>
              </Link>
            );
         })}
         {/* More Drawer Trigger */}
         <button onClick={() => setIsMoreOpen(true)} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all opacity-50`}>
           <Menu size={20} />
           <span className="text-[10px] font-bold">المزيد</span>
         </button>
      </div>
    </nav>
    
    {/* Mobile More Drawer */}
    <AnimatePresence>
      {isMoreOpen && (
        <motion.div 
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`md:hidden fixed inset-x-0 bottom-0 z-50 h-[85vh] rounded-t-3xl shadow-2xl flex flex-col pt-6 font-tajawal
             ${theme === 'dark' ? 'bg-[#022c22] text-white border-t border-primary/30' : 'bg-[#FAF8F5] text-secondary border-t border-secondary/20'}
          `}
        >
          <div className="flex justify-between items-center px-6">
             <h2 className="text-2xl font-bold">القائمة الرئيسية</h2>
             <button onClick={() => setIsMoreOpen(false)} className="p-2 bg-black/5 rounded-full"><X /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
             {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path} onClick={() => setIsMoreOpen(false)} className={`flex items-center gap-4 p-4 rounded-2xl transition-all
                     ${isActivePath(link.path) 
                       ? (theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-secondary/10 text-secondary') 
                       : (theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5')}
                  `}>
                     <Icon size={24} />
                     <span className="text-xl font-bold">{link.label}</span>
                  </Link>
                );
             })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    
    {/* Vertical Side Navigation Pillar (Premium Navigation) - Desktop Only */}
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] hidden lg:flex flex-col items-center gap-6">
      <div className={`w-px h-20 bg-gradient-to-b from-transparent ${theme === 'dark' ? 'via-[#C69C6D]/40' : 'via-[#1B4F3B]/40'} to-transparent mb-4`}></div>
      {links.map((link, idx) => {
        const isActive = isActivePath(link.path);
        return (
          <Link key={idx} to={link.path} className="group relative">
             <motion.div 
               animate={{ scale: isActive ? 1.5 : 1 }}
               className={`w-2 h-2 rounded-full border transition-all ${isActive 
                 ? (theme === 'dark' ? 'bg-[#C69C6D] border-[#C69C6D]' : 'bg-[#1B4F3B] border-[#1B4F3B]')
                 : (theme === 'dark' ? 'bg-transparent border-[#C69C6D]/30 group-hover:border-[#C69C6D]' : 'bg-transparent border-[#1B4F3B]/30 group-hover:border-[#1B4F3B]')
               }`}
             />
             <span className={`absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none font-bold
               ${theme === 'dark' ? 'bg-[#C69C6D] text-[#0A1A14]' : 'bg-[#1B4F3B] text-white'}
             `}>
               {link.label}
             </span>
          </Link>
        );
      })}
      <div className={`w-px h-20 bg-gradient-to-t from-transparent ${theme === 'dark' ? 'via-[#C69C6D]/40' : 'via-[#1B4F3B]/40'} to-transparent mt-4`}></div>
    </div>
    </>
  );
};

export default Navbar;
