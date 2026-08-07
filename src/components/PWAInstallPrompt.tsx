import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches;
  });
  const [showPrompt, setShowPrompt] = useState(() => {
    if (typeof window === 'undefined') return false;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isDismissed = localStorage.getItem('pwa-prompt-dismissed') === 'true';

    return !isStandalone && !isDismissed;
  });

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
          setShowPrompt(false);
          setIsInstalled(true);
          localStorage.setItem('pwa-prompt-dismissed', 'true');
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Install prompt error:', error);
      }
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  }, []);

  // Don't render if installed or not showing
  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-4">
          <div className="flex items-start gap-4">
            {/* Logo - using PNG image instead of text */}
            <img 
              src="iconslogo.png" 
              alt="FocusForge Logo" 
              className="w-12 h-12 rounded-xl object-cover shadow-lg flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Install FocusForge</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Get the app for offline use and a better experience
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}