import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import GlobalLayout from './components/GlobalLayout';
import CinematicIntro from './components/CinematicIntro';
import SiteTour from './components/SiteTour';

// Pages (Lazy Loaded)
import { lazy, Suspense, useEffect } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Quran = lazy(() => import('./pages/Quran'));
const Surah = lazy(() => import('./pages/Surah'));
const Sahaba = lazy(() => import('./pages/Sahaba'));
const Story = lazy(() => import('./pages/Story'));
const Seerah = lazy(() => import('./pages/Seerah'));
const Yaqeen = lazy(() => import('./pages/Yaqeen'));
const Radio = lazy(() => import('./pages/Radio'));
const Ruqyah = lazy(() => import('./pages/Ruqyah'));
const RecitersPage = lazy(() => import('./pages/RecitersPage'));
import { useAppStore } from './store/useAppStore';


const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary text-xl">جاري التحميل...</div>}>
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
          <Route path="/reciters" element={<RecitersPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const { theme } = useAppStore();

  useEffect(() => {
    // Function to set global media session metadata
    const setMediaMetadata = () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'يقين — معرفة تُثمر يقيناً',
          artist: 'منصة يقين',
          artwork: [
            { src: 'https://yaaqeen.netlify.app/logo.png', type: 'image/png' },
            { src: window.location.origin + '/logo.png', type: 'image/png' }
          ]
        });
      }
    };

    // Set initially
    setMediaMetadata();

    // Re-apply when any audio starts playing, as iOS sometimes clears metadata
    document.addEventListener('play', setMediaMetadata, true);

    return () => {
      document.removeEventListener('play', setMediaMetadata, true);
    };
  }, []);

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
