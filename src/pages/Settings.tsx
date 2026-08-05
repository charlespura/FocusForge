import { motion } from 'framer-motion';
import { useTimerStore } from '../store/timerStore';
import { useThemeStore } from '../store/themeStore';
import { useStatisticsStore } from '../store/statisticsStore';
import { useAchievementStore } from '../store/achievementStore';
import { Bell, Volume2, Download, Upload, Trash2 } from 'lucide-react';
import { Theme } from '../types';

export function Settings() {
  const { settings, updateSettings } = useTimerStore();
  const { theme, setTheme } = useThemeStore();
  const { resetData: resetStats } = useStatisticsStore();
  const { resetAchievements } = useAchievementStore();

  const themes: { label: string; value: Theme }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Ocean', value: 'ocean' },
    { label: 'Forest', value: 'forest' },
    { label: 'Lavender', value: 'lavender' },
    { label: 'Warm Sand', value: 'warm-sand' },
    { label: 'Midnight', value: 'midnight' },
    { label: 'AMOLED', value: 'amoled' },
  ];

  const handleExport = () => {
    const data = {
      tasks: localStorage.getItem('tasks-storage'),
      notes: localStorage.getItem('notes-storage'),
      statistics: localStorage.getItem('statistics-storage'),
      achievements: localStorage.getItem('achievements-storage'),
      theme: localStorage.getItem('theme-storage'),
      settings: localStorage.getItem('timer-settings'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusforge-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        });
        window.location.reload();
      } catch {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.clear();
      resetStats();
      resetAchievements();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Customize your FocusForge experience</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timer Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Focus Time (minutes)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={settings.focusTime}
                onChange={(e) => updateSettings({ focusTime: parseInt(e.target.value) || 25 })}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-1 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Short Break (minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.shortBreak}
                onChange={(e) => updateSettings({ shortBreak: parseInt(e.target.value) || 5 })}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-1 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Long Break (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreak}
                onChange={(e) => updateSettings({ longBreak: parseInt(e.target.value) || 15 })}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-1 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-500 dark:text-gray-400">Auto-start Break</label>
              <input
                type="checkbox"
                checked={settings.autoStartBreak}
                onChange={(e) => updateSettings({ autoStartBreak: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-500 dark:text-gray-400">Auto-start Focus</label>
              <input
                type="checkbox"
                checked={settings.autoStartFocus}
                onChange={(e) => updateSettings({ autoStartFocus: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-1 text-gray-900 dark:text-white"
              >
                {themes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-500" />
                <label className="text-sm text-gray-500 dark:text-gray-400">Notifications</label>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSettings({ notifications: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-gray-500" />
                <label className="text-sm text-gray-500 dark:text-gray-400">Alarm Sound</label>
              </div>
              <input
                type="checkbox"
                checked={settings.alarmSound}
                onChange={(e) => updateSettings({ alarmSound: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Management</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Data
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Reset All Data
          </button>
        </div>
      </motion.div>
    </div>
  );
}
// ... all the existing code ...

// Add this at the very end of the file
export default Settings;