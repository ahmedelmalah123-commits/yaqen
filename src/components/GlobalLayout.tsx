import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getBookmarks, BOOKMARKS_EVENT } from '../lib/bookmarks';
import SidebarNav from './SidebarNav';
import WorkspaceHeader from './WorkspaceHeader';
import Footer from './Footer';
import SearchOverlay from './SearchOverlay';
import ChatWidget from './ChatWidget';
import SiteTour from './SiteTour';
import BookmarksDrawer from './BookmarksDrawer';
import SettingsDrawer from './SettingsDrawer';
import AudioEngine from './audio/AudioEngine';
import GlobalAudioPlayer from './audio/GlobalAudioPlayer';
import CarModeModal from './audio/CarModeModal';
import OfflineAudioDrawer from './audio/OfflineAudioDrawer';
import QueuePlaylistDrawer from './audio/QueuePlaylistDrawer';
import AudioDiagnosticsModal from './audio/AudioDiagnosticsModal';
import DesktopMiniPlayer from './audio/DesktopMiniPlayer';
import OnboardingWelcome from './onboarding/OnboardingWelcome';
import PwaInstallModal from './pwa/PwaInstallModal';
import { useAudioStore } from '../store/useAudioStore';
import { usePwaInstall } from '../lib/usePwaInstall';

export const GlobalLayout: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState<number>(() => getBookmarks().length);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const theme = useAppStore((s) => s.theme);
  const tourOpen = useAppStore((s) => s.tourOpen);
  const setTourOpen = useAppStore((s) => s.setTourOpen);
  const isBookmarksDrawerOpen = useAppStore((s) => s.isBookmarksDrawerOpen);
  const setBookmarksDrawerOpen = useAppStore((s) => s.setBookmarksDrawerOpen);
  const isYaqeenModeActive = useAppStore((s) => s.isYaqeenModeActive);
  const activeAudioSource = useAudioStore((s) => s.source);

  const {
    platform,
    isStandalone,
    canInstallNatively,
    isInstallModalOpen,
    openInstallGuide,
    closeInstallGuide,
    triggerNativeInstall,
  } = usePwaInstall();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // First-visit detection for Amm Baraka onboarding
  useEffect(() => {
    try {
      const completed = window.localStorage.getItem('yaqeen_onboarding_completed');
      const tourSeen = window.localStorage.getItem('yaqeen_tour_seen');
      if (!completed && !tourSeen) {
        const timer = window.setTimeout(() => {
          setOnboardingOpen(true);
        }, 400);
        return () => window.clearTimeout(timer);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleDismissOnboarding = () => {
    try {
      window.localStorage.setItem('yaqeen_onboarding_completed', 'true');
    } catch {
      // Ignore
    }
    setOnboardingOpen(false);
  };

  const handleStartTourFromOnboarding = () => {
    handleDismissOnboarding();
    setTourOpen(true);
  };

  useEffect(() => {
    const sync = () => setBookmarksCount(getBookmarks().length);
    window.addEventListener(BOOKMARKS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="min-h-screen bg-canvas text-ink flex flex-col font-tajawal transition-colors duration-200 overflow-x-hidden"
      dir="rtl"
    >
      <SidebarNav
        onOpenSearch={() => setSearchOpen(true)}
        onOpenInstallModal={openInstallGuide}
        bookmarksCount={bookmarksCount}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 ${
          isYaqeenModeActive ? '' : 'lg:pr-[248px]'
        } ${activeAudioSource ? 'pb-44 sm:pb-36' : 'pb-24 lg:pb-8'}`}
      >
        <WorkspaceHeader
          onOpenSearch={() => setSearchOpen(true)}
          onOpenInstallModal={openInstallGuide}
          bookmarksCount={bookmarksCount}
        />

        <main className="flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-6 pt-2 sm:pt-3">
          <Outlet />
        </main>

        {!isYaqeenModeActive && <Footer />}
      </div>

      <AudioEngine />
      {!isYaqeenModeActive && (
        <>
          <GlobalAudioPlayer />
          <DesktopMiniPlayer />
          <CarModeModal />
          <OfflineAudioDrawer />
          <QueuePlaylistDrawer />
          <AudioDiagnosticsModal />
        </>
      )}

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BookmarksDrawer
        open={isBookmarksDrawerOpen}
        onClose={() => setBookmarksDrawerOpen(false)}
      />
      <SettingsDrawer />
      <SiteTour open={tourOpen} onClose={() => setTourOpen(false)} />

      {/* First-Visit Onboarding Guide (Amm Baraka) */}
      <OnboardingWelcome
        open={onboardingOpen}
        onExploreSolo={handleDismissOnboarding}
        onStartTour={handleStartTourFromOnboarding}
      />

      {/* Cross-Platform PWA Installation Guide */}
      <PwaInstallModal
        open={isInstallModalOpen}
        onClose={closeInstallGuide}
        platform={platform}
        canInstallNatively={canInstallNatively}
        isStandalone={isStandalone}
        onNativeInstall={triggerNativeInstall}
      />

      {!isYaqeenModeActive && <ChatWidget position="bottom-left" />}
    </div>
  );
};

export default GlobalLayout;
