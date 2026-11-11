import { useState, useEffect, useCallback } from 'react';

export type PwaPlatform = 'ios' | 'android' | 'windows' | 'mac' | 'other';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function detectPlatform(): PwaPlatform {
  if (typeof window === 'undefined') return 'other';
  const ua = window.navigator.userAgent.toLowerCase();
  const isIOS =
    /iphone|ipad|ipod/.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  if (isIOS) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/windows/.test(ua)) return 'windows';
  if (/macintosh|mac os x/.test(ua)) return 'mac';
  return 'other';
}

export function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as unknown as { standalone?: boolean }).standalone)
  );
}

const STORAGE_DISMISSED_KEY = 'yaqeen_pwa_prompt_dismissed_at';
const DISMISS_COOLDOWN_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function isDismissedRecently(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_DISMISSED_KEY);
    if (!raw) return false;
    const timestamp = Number(raw);
    if (Number.isNaN(timestamp)) return false;
    return Date.now() - timestamp < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

export function recordDismissal(): void {
  try {
    window.localStorage.setItem(STORAGE_DISMISSED_KEY, String(Date.now()));
  } catch {
    // Ignore storage failure
  }
}

export function usePwaInstall() {
  const [platform, setPlatform] = useState<PwaPlatform>('other');
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hasPromptBeenDismissed, setHasPromptBeenDismissed] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setIsStandalone(checkIsStandalone());
    setHasPromptBeenDismissed(isDismissedRecently());

    const handleBeforeInstall = (e: Event) => {
      // Prevent automatic mini-infobar on mobile Chrome
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerNativeInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'manual'> => {
    if (!deferredPrompt) {
      // No native prompt available; show tailored instructions modal
      setIsInstallModalOpen(true);
      return 'manual';
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      } else {
        recordDismissal();
        setHasPromptBeenDismissed(true);
      }
      return choice.outcome;
    } catch {
      setIsInstallModalOpen(true);
      return 'manual';
    }
  }, [deferredPrompt]);

  const openInstallGuide = useCallback(() => {
    setIsInstallModalOpen(true);
  }, []);

  const closeInstallGuide = useCallback(() => {
    setIsInstallModalOpen(false);
  }, []);

  const dismissPromptBanner = useCallback(() => {
    recordDismissal();
    setHasPromptBeenDismissed(true);
  }, []);

  const canInstallNatively = Boolean(deferredPrompt);
  const canShowInstallAction = !isStandalone;

  return {
    platform,
    isStandalone,
    canInstallNatively,
    canShowInstallAction,
    hasPromptBeenDismissed,
    isInstallModalOpen,
    triggerNativeInstall,
    openInstallGuide,
    closeInstallGuide,
    dismissPromptBanner,
  };
}

