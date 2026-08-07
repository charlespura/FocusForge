import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useTimerStore } from './timerStore';
import { notificationService } from '../services/notificationService';

type TimerMode = 'focus' | 'short-break' | 'long-break';

interface GlobalTimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  completedSessions: number;
  selectedTask: string;
  totalTime: number;
  startTime: number | null;

  // Actions
  setMode: (mode: TimerMode) => void;
  setTimeLeft: (time: number) => void;
  setIsRunning: (running: boolean) => void;
  setCompletedSessions: (sessions: number) => void;
  setSelectedTask: (taskId: string) => void;
  setTotalTime: (total: number) => void;
  setStartTime: (time: number | null) => void;
  resetTimer: () => void;
  toggleTimer: () => void;
  skipTimer: (
    settings: { focusTime: number; shortBreak: number; longBreak: number; autoStartBreak: boolean; autoStartFocus: boolean },
    incrementPomodoros: (id: string) => void,
    incrementSessions: () => void,
    addFocusTime: (minutes: number) => void,
    incrementProgress: () => void,
    updateStreak: (date: string) => void,
    unlockAchievement: (id: string) => boolean
  ) => void;
  updateTimeLeft: () => void;
}

const getModeDuration = (mode: TimerMode) => {
  const durations = {
    focus: 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60,
  };

  return durations[mode];
};

const setTimerTitle = (timeLeft: number) => {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  document.title = `Timer ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} - FocusForge`;
};

export const useGlobalTimerStore = create<GlobalTimerState>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      timeLeft: 25 * 60,
      isRunning: false,
      completedSessions: 0,
      selectedTask: '',
      totalTime: 25 * 60,
      startTime: null,

      setMode: (mode) => set({ mode }),
      setTimeLeft: (timeLeft) => set({ timeLeft }),
      setIsRunning: (isRunning) => set({ isRunning }),
      setCompletedSessions: (completedSessions) => set({ completedSessions }),
      setSelectedTask: (selectedTask) => set({ selectedTask }),
      setTotalTime: (totalTime) => set({ totalTime }),
      setStartTime: (startTime) => set({ startTime }),

      resetTimer: () => {
        const state = get();
        const totalTime = getModeDuration(state.mode);
        set({
          timeLeft: totalTime,
          totalTime,
          isRunning: false,
          startTime: null,
        });
        document.title = 'FocusForge';
        window.dispatchEvent(new CustomEvent('timerUpdate', {
          detail: { timeLeft: totalTime, isRunning: false, mode: state.mode },
        }));
      },

      toggleTimer: () => {
        const state = get();
        const newRunning = !state.isRunning;
        set({ isRunning: newRunning });

        if (newRunning) {
          set({
            startTime: Date.now(),
            totalTime: state.timeLeft,
          });
          notificationService.primeAlarmSound();
          setTimerTitle(state.timeLeft);
          window.dispatchEvent(new CustomEvent('timerUpdate', {
            detail: { timeLeft: state.timeLeft, isRunning: true, mode: state.mode },
          }));
        } else {
          document.title = 'FocusForge';
          window.dispatchEvent(new CustomEvent('timerUpdate', {
            detail: { timeLeft: state.timeLeft, isRunning: false, mode: state.mode },
          }));
        }
      },

      skipTimer: (
        settings,
        incrementPomodoros,
        incrementSessions,
        addFocusTime,
        incrementProgress,
        updateStreak,
        unlockAchievement
      ) => {
        const state = get();

        if (state.mode === 'focus') {
          const sessionCount = state.completedSessions + 1;
          set({ completedSessions: sessionCount });

          if (state.selectedTask) {
            incrementPomodoros(state.selectedTask);
          }

          incrementSessions();
          addFocusTime(settings.focusTime);
          incrementProgress();
          updateStreak(new Date().toISOString().split('T')[0]);

          const totalSessions = sessionCount;
          if (totalSessions === 1) unlockAchievement('first-focus');
          if (totalSessions === 10) unlockAchievement('10-sessions');
          if (totalSessions === 50) unlockAchievement('50-sessions');
          if (totalSessions === 100) unlockAchievement('100-sessions');
          if (totalSessions === 500) unlockAchievement('500-sessions');
          if (totalSessions === 1000) unlockAchievement('1000-sessions');

          const newMode: TimerMode = sessionCount % 4 === 0 ? 'long-break' : 'short-break';
          const durations = {
            focus: settings.focusTime * 60,
            'short-break': settings.shortBreak * 60,
            'long-break': settings.longBreak * 60,
          };
          const newTimeLeft = durations[newMode];

          set({
            mode: newMode,
            timeLeft: newTimeLeft,
            totalTime: newTimeLeft,
            isRunning: false,
            startTime: null,
          });

          if (settings.autoStartBreak) {
            setTimeout(() => {
              get().toggleTimer();
            }, 100);
          }
        } else {
          const newMode: TimerMode = 'focus';
          const durations = {
            focus: settings.focusTime * 60,
            'short-break': settings.shortBreak * 60,
            'long-break': settings.longBreak * 60,
          };
          const newTimeLeft = durations[newMode];

          set({
            mode: newMode,
            timeLeft: newTimeLeft,
            totalTime: newTimeLeft,
            isRunning: false,
            startTime: null,
          });

          if (settings.autoStartFocus) {
            setTimeout(() => {
              get().toggleTimer();
            }, 100);
          }
        }

        document.title = 'FocusForge';
        window.dispatchEvent(new CustomEvent('timerUpdate', {
          detail: { timeLeft: get().timeLeft, isRunning: false, mode: get().mode },
        }));
      },

      updateTimeLeft: () => {
        const state = get();

        if (!state.isRunning || !state.startTime) {
          return;
        }

        const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
        const newTimeLeft = Math.max(0, state.totalTime - elapsedSeconds);

        if (newTimeLeft === state.timeLeft) {
          return;
        }

        set({ timeLeft: newTimeLeft });
        setTimerTitle(newTimeLeft);
        window.dispatchEvent(new CustomEvent('timerUpdate', {
          detail: { timeLeft: newTimeLeft, isRunning: true, mode: state.mode },
        }));

        if (newTimeLeft <= 0) {
          const { settings } = useTimerStore.getState();
          if (settings.alarmSound) {
            notificationService.playAlarmSound();
          }

          if (settings.notifications) {
            const nextMode = state.mode === 'focus' ? 'break' : 'focus';
            notificationService.sendTimerCompleteNotification(nextMode, state.completedSessions + (state.mode === 'focus' ? 1 : 0));
          }

          set({
            isRunning: false,
            startTime: null,
          });
        }
      },
    }),
    {
      name: 'global-timer-storage',
    }
  )
);
