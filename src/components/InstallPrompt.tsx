'use client';

import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'unlon-install-dismissed';
const DISMISS_DAYS = 7;

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Already installed as standalone
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if ((navigator as any).standalone) return;

    // Dismissed recently
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
      // Trigger animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setAnimateIn(false);
      setTimeout(() => setVisible(false), 300);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 300);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[60] flex justify-center pointer-events-none"
      style={{ bottom: 72 }}
    >
      <div
        className="pointer-events-auto w-full max-w-[430px] mx-4 rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-300 ease-out"
        style={{
          background: '#130709',
          borderTop: '2px solid rgba(255,120,70,0.6)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
          transform: animateIn ? 'translateY(0)' : 'translateY(100%)',
          opacity: animateIn ? 1 : 0,
        }}
      >
        <span className="text-sm text-white/90 flex-1 whitespace-nowrap">
          📲 Install UNLON
        </span>

        <button
          onClick={handleInstall}
          className="px-4 py-1.5 rounded-full text-white text-sm font-semibold shrink-0"
          style={{
            background: 'linear-gradient(135deg, #FF5020 0%, #FFD000 100%)',
          }}
        >
          Install
        </button>

        <button
          onClick={handleDismiss}
          className="text-white/50 hover:text-white/80 transition-colors text-lg leading-none shrink-0"
          aria-label="Dismiss install prompt"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
