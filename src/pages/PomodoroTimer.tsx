import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Maximize2 } from 'lucide-react';
import { useTimerStore } from '../store/timerStore';
import { useTaskStore } from '../store/taskStore';
import { useStatisticsStore } from '../store/statisticsStore';
import { useGoalStore } from '../store/goalStore';
import { useAchievementStore } from '../store/achievementStore';
import { cn } from '../utils/cn';

type TimerMode = 'focus' | 'short-break' | 'long-break';

export function PomodoroTimer() {
  const { settings } = useTimerStore();
  const { tasks, incrementPomodoros } = useTaskStore();
  const { incrementSessions, addFocusTime, updateStreak } = useStatisticsStore();
  const { incrementProgress } = useGoalStore();
  const { unlockAchievement } = useAchievementStore();

  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const timerRef = useRef<number | null>(null);

  const totalTime = mode === 'focus' ? settings.focusTime * 60 : 
                    mode === 'short-break' ? settings.shortBreak * 60 : 
                    settings.longBreak * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const getModeColor = () => {
    switch (mode) {
      case 'focus': return 'text-red-500';
      case 'short-break': return 'text-green-500';
      case 'long-break': return 'text-blue-500';
      default: return 'text-red-500';
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'focus': return 'Focus Time';
      case 'short-break': return 'Short Break';
      case 'long-break': return 'Long Break';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    const durations = {
      focus: settings.focusTime * 60,
      'short-break': settings.shortBreak * 60,
      'long-break': settings.longBreak * 60,
    };
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
  }, [settings]);

  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    const durations = {
      focus: settings.focusTime * 60,
      'short-break': settings.shortBreak * 60,
      'long-break': settings.longBreak * 60,
    };
    setTimeLeft(durations[mode]);
    setIsRunning(false);
  }, [settings, mode]);

  const skipTimer = useCallback(() => {
    if (mode === 'focus') {
      const sessionCount = completedSessions + 1;
      setCompletedSessions(sessionCount);

      if (selectedTask) {
        incrementPomodoros(selectedTask);
      }

      incrementSessions();
      addFocusTime(settings.focusTime);
      incrementProgress();
      updateStreak(new Date().toISOString().split('T')[0]);

      // Check achievements
      const totalSessions = sessionCount;
      if (totalSessions === 1) unlockAchievement('first-focus');
      if (totalSessions === 10) unlockAchievement('10-sessions');
      if (totalSessions === 50) unlockAchievement('50-sessions');
      if (totalSessions === 100) unlockAchievement('100-sessions');
      if (totalSessions === 500) unlockAchievement('500-sessions');
      if (totalSessions === 1000) unlockAchievement('1000-sessions');

      if (sessionCount % 4 === 0) {
        switchMode('long-break');
      } else {
        switchMode('short-break');
      }

      if (settings.autoStartBreak) {
        setTimeout(() => setIsRunning(true), 100);
      }
    } else {
      switchMode('focus');
      if (settings.autoStartFocus) {
        setTimeout(() => setIsRunning(true), 100);
      }
    }
  }, [
    mode,
    completedSessions,
    selectedTask,
    settings,
    incrementPomodoros,
    incrementSessions,
    addFocusTime,
    incrementProgress,
    updateStreak,
    unlockAchievement,
    switchMode,
  ]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            skipTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, skipTimer]);

  // Keyboard shortcuts effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        toggleTimer();
      }
      if (e.key === 'r' || e.key === 'R') {
        resetTimer();
      }
      if (e.key === 's' || e.key === 'S') {
        skipTimer();
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTimer, resetTimer, skipTimer, toggleFullscreen]);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[80vh] transition-all duration-500",
      isFullscreen && "fixed inset-0 z-50 bg-white dark:bg-zinc-900 min-h-screen"
    )}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <motion.h2
            key={mode}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl font-semibold ${getModeColor()}`}
          >
            {getModeLabel()}
          </motion.h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {completedSessions} sessions completed today
          </p>
        </div>

        <div className="relative">
          <div className="w-72 h-72 mx-auto relative">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-zinc-700"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={getModeColor()}
                strokeDasharray={`${2 * Math.PI * 45 * (progress / 100)} ${2 * Math.PI * 45 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={timeLeft}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-6xl font-bold text-gray-900 dark:text-white tabular-nums"
              >
                {formatTime(timeLeft)}
              </motion.span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {Math.round(progress)}% complete
              </span>
            </div>
          </div>
        </div>

        {mode === 'focus' && (
          <div className="w-full max-w-sm mx-auto">
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select a task to focus on...</option>
              {tasks.filter(t => !t.completed).map(task => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={skipTimer}
            className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors flex items-center justify-center"
          >
            <SkipForward className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors flex items-center justify-center"
          >
            <Maximize2 className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-x-3">
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded">Space</kbd>
          <span>Start/Pause</span>
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded">R</kbd>
          <span>Reset</span>
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded">S</kbd>
          <span>Skip</span>
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded">F</kbd>
          <span>Fullscreen</span>
        </div>
      </motion.div>
    </div>
  );
}
// ... all the existing code ...

// Add this at the very end of the file
export default PomodoroTimer;

