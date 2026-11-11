import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalLayout from './components/GlobalLayout';

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
const QuranStories = lazy(() => import('./pages/QuranStories'));
const KnowledgeHub = lazy(() => import('./pages/KnowledgeHub'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageFallback = () => (
  <div className="min-h-[55vh] flex items-center justify-center text-ink-secondary font-bold text-sm">
    جاري التحميل...
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<GlobalLayout />}>
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
            <Route path="/stories" element={<QuranStories />} />
            <Route path="/knowledge" element={<KnowledgeHub />} />
            <Route path="/hub" element={<KnowledgeHub />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
