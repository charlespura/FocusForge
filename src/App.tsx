import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { PomodoroTimer } from './pages/PomodoroTimer';
import { Tasks } from './pages/Tasks';
import { Analytics } from './pages/Analytics';
import { Notes } from './pages/Notes';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import './styles/globals.css';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : 'light';
  }, [theme]);

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
    </HashRouter>
  );
}

export default App;