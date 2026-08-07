import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Maximize2 } from 'lucide-react';
import { useTimerStore } from '../store/timerStore';
import { useTaskStore } from '../store/taskStore';
import { useStatisticsStore } from '../store/statisticsStore';
import { useGoalStore } from '../store/goalStore';
import { useAchievementStore } from '../store/achievementStore';
import { useGlobalTimerStore } from '../store/globalTimerStore';
import { cn } from '../utils/cn';

export function PomodoroTimer() {
  const { settings } = useTimerStore();
  const { tasks, incrementPomodoros } = useTaskStore();
  const { incrementSessions, addFocusTime, updateStreak } = useStatisticsStore();
  const { incrementProgress } = useGoalStore();
  const { unlockAchievement } = useAchievementStore();

  // Use global timer state
  const {
    mode,
    timeLeft,
    isRunning,
    completedSessions,
    selectedTask,
    toggleTimer,
    resetTimer,
    skipTimer,
    setSelectedTask,
  } = useGlobalTimerStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalTime = useGlobalTimerStore((state) => state.totalTime);

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

  // Wrap handleSkipTimer in useCallback to prevent unnecessary re-renders
  const handleSkipTimer = useCallback(() => {
    skipTimer(settings, incrementPomodoros, incrementSessions, addFocusTime, incrementProgress, updateStreak, unlockAchievement);
  }, [skipTimer, settings, incrementPomodoros, incrementSessions, addFocusTime, incrementProgress, updateStreak, unlockAchievement]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Check if timer finished - include handleSkipTimer in dependencies
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSkipTimer();
    }
  }, [timeLeft, isRunning, handleSkipTimer]);

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
        handleSkipTimer();
      }
      if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
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
  }, [toggleTimer, resetTimer, handleSkipTimer]);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[80vh] transition-all duration-500",
      isFullscreen && "fixed inset-0 z-50 bg-white dark:bg-zinc-900 min-h-screen"
    )}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl space-y-8"
      >
        {/* Video Background Section */}
        <div className="relative rounded-2xl overflow-hidden h-[300px] md:h-[400px] lg:h-[450px] bg-black/90">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            style={{ objectPosition: 'center 40%' }}
          >
            <source src="/FocusForge/forge2.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="px-6 md:px-10 text-white max-w-4xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              >
                Pomodoro Timer
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto"
              >
                {isRunning ? 'Focus session in progress... 🎯' : 'Ready to focus? 🚀'}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-6 flex justify-center gap-4 flex-wrap"
              >
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                  ⏱️ {getModeLabel()}
                </span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                  {completedSessions} sessions completed
                </span>
                {isRunning && (
                  <span className="px-4 py-2 bg-red-500/30 backdrop-blur-sm rounded-full text-sm border border-red-500/30 animate-pulse">
                    🔴 Live
                  </span>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Timer Controls */}
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
            onClick={handleSkipTimer}
            className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors flex items-center justify-center"
          >
            <SkipForward className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleFullscreen}
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

export default PomodoroTimer;
