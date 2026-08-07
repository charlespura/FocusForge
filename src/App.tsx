import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { useGlobalTimerStore } from './store/globalTimerStore';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { PomodoroTimer } from './pages/PomodoroTimer';
import { Tasks } from './pages/Tasks';
import { Analytics } from './pages/Analytics';
import { Notes } from './pages/Notes';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import './styles/globals.css';

function App() {
  const { theme } = useThemeStore();
  const { timeLeft, isRunning, mode } = useGlobalTimerStore();

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : 'light';
  }, [theme]);

  // Update title based on global timer state - runs continuously
  useEffect(() => {
    if (isRunning) {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      document.title = `⏱️ ${timeString} - FocusForge`;
    } else {
      document.title = 'FocusForge';
    }
  }, [timeLeft, isRunning, mode]);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/timer" element={<PomodoroTimer />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <PWAInstallPrompt />
    </HashRouter>
  );
}

export default App;