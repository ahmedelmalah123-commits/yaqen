import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import GlobalLayout from './components/GlobalLayout';
import CinematicIntro from './components/CinematicIntro';
import AudioPlayer from './components/AudioPlayer';
import SiteTour from './components/SiteTour';

// Pages (Lazy Loaded)
import { lazy, Suspense, useEffect } from 'react';
import { supabase } from './lib/supabase';

const Home = lazy(() => import('./pages/Home'));
const Quran = lazy(() => import('./pages/Quran'));
const Surah = lazy(() => import('./pages/Surah'));
const Sahaba = lazy(() => import('./pages/Sahaba'));
const Story = lazy(() => import('./pages/Story'));
const Seerah = lazy(() => import('./pages/Seerah'));
const Yaqeen = lazy(() => import('./pages/Yaqeen'));
const Radio = lazy(() => import('./pages/Radio'));
const Ruqyah = lazy(() => import('./pages/Ruqyah'));
const Nafha = lazy(() => import('./pages/Nafha'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RecitersPage = lazy(() => import('./pages/RecitersPage'));
import { useAppStore } from './store/useAppStore';

const RouteFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C8A96A]"></div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isYaqeenMode = location.pathname === '/yaqeen';
  const isSahabaStoryMode = location.pathname.startsWith('/sahaba/');
  const isFullscreen = isYaqeenMode || isSahabaStoryMode;

  return (
    <>
      <AnimatePresence mode="wait">
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/surah/:id" element={<Surah />} />
            <Route path="/sahaba" element={<Sahaba />} />
            <Route path="/sahaba/:id" element={<Story />} />
            <Route path="/seerah" element={<Seerah />} />
            <Route path="/yaqeen" element={<Yaqeen />} />
            <Route path="/radio" element={<Radio />} />
            <Route path="/ruqyah" element={<Ruqyah />} />
            <Route path="/nafha" element={<Nafha />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reciters" element={<RecitersPage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      
      {/* Hide Player in Distraction-Free modes */}
      {!isFullscreen && <AudioPlayer />}
    </>
  );
};

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const { theme, setUser } = useAppStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    }).catch(err => console.error("Supabase Session Error:", err));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <div className={theme}>
      {!introFinished && <CinematicIntro onComplete={() => setIntroFinished(true)} />}
      
      <div className={`transition-opacity duration-1000 ${introFinished ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <Router>
          <GlobalLayout>
            {introFinished && <SiteTour />}
            <AnimatedRoutes />
          </GlobalLayout>
        </Router>
      </div>
    </div>
  );
}

export default App;
