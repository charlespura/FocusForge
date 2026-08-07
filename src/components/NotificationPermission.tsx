import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export function NotificationPermission() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }

    return Notification.permission;
  });
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem('notification-dismissed') === 'true';
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default' && !dismissed) {
      const timer = window.setTimeout(() => {
        setShowPrompt(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [dismissed]);

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    if (granted) {
      setShowPrompt(false);
      localStorage.setItem('notification-dismissed', 'true');
      // Send a test notification
      notificationService.sendNotification({
        title: '🔔 Notifications Enabled!',
        body: 'You will now receive notifications when your timer completes.',
        requireInteraction: false,
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('notification-dismissed', 'true');
    setDismissed(true);
  };

  if (permission === 'granted' || permission === 'denied' || dismissed || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm w-full"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Enable Notifications</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Get notified when your timer completes
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
                >
                  Enable
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors text-xs font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
