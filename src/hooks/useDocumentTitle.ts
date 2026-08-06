import { useEffect, useRef } from 'react';

export function useDocumentTitle(title: string, isTimerPage?: boolean, timeLeft?: number, isRunning?: boolean, mode?: string) {
  const prevTitleRef = useRef<string>('FocusForge');

  useEffect(() => {
    // If it's the timer page and timer is running, show the timer in the title
    if (isTimerPage && isRunning && timeLeft !== undefined) {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      const newTitle = `⏱️ ${timeString} - FocusForge`;
      document.title = newTitle;
      prevTitleRef.current = newTitle;
      
      // Dispatch event for other pages to update title
      window.dispatchEvent(new CustomEvent('timerUpdate', {
        detail: { timeLeft, isRunning, mode }
      }));
    } else if (isTimerPage) {
      // Timer page but not running - show default title
      document.title = 'FocusForge';
      prevTitleRef.current = 'FocusForge';
      
      // Dispatch event to reset title
      window.dispatchEvent(new CustomEvent('timerUpdate', {
        detail: { timeLeft, isRunning: false, mode }
      }));
    } else {
      // Non-timer page - title will be managed by App.tsx
      // But we might want to show timer if it's running in background
      // The App.tsx event listener will handle this
      document.title = prevTitleRef.current;
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'FocusForge';
      window.dispatchEvent(new CustomEvent('timerUpdate', {
        detail: { timeLeft: 0, isRunning: false, mode: '' }
      }));
    };
  }, [title, isTimerPage, timeLeft, isRunning, mode]);
}