import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Statistics {
  totalSessions: number;
  totalFocusTime: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  dailySessions: Record<string, number>;
  weeklySessions: Record<string, number>;
}

interface StatisticsStore extends Statistics {
  incrementSessions: () => void;
  addFocusTime: (minutes: number) => void;
  incrementCompletedTasks: () => void;
  updateStreak: (date: string) => void;
  resetData: () => void;
}

const defaultStats: Statistics = {
  totalSessions: 0,
  totalFocusTime: 0,
  completedTasks: 0,
  currentStreak: 0,
  longestStreak: 0,
  dailySessions: {},
  weeklySessions: {},
};

export const useStatisticsStore = create<StatisticsStore>()(
  persist(
    (set) => ({
      ...defaultStats,
      incrementSessions: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const daily = { ...state.dailySessions };
          daily[today] = (daily[today] || 0) + 1;

          const weekKey = `W${Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 604800000)}`;
          const weekly = { ...state.weeklySessions };
          weekly[weekKey] = (weekly[weekKey] || 0) + 1;

          return {
            ...state,
            totalSessions: state.totalSessions + 1,
            dailySessions: daily,
            weeklySessions: weekly,
          };
        }),
      addFocusTime: (minutes) =>
        set((state) => ({
          ...state,
          totalFocusTime: state.totalFocusTime + minutes,
        })),
      incrementCompletedTasks: () =>
        set((state) => ({
          ...state,
          completedTasks: state.completedTasks + 1,
        })),
      updateStreak: (date) =>
        set((state) => {
          const hasActivity = state.dailySessions[date] && state.dailySessions[date] > 0;
          
          if (!hasActivity) {
            return { ...state, currentStreak: 0 };
          }

          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const hasYesterdayActivity = state.dailySessions[yesterday] && state.dailySessions[yesterday] > 0;
          
          if (hasActivity && !hasYesterdayActivity && state.currentStreak > 0) {
            const newStreak = 1;
            return {
              ...state,
              currentStreak: newStreak,
              longestStreak: Math.max(state.longestStreak, newStreak),
            };
          }

          if (hasActivity && hasYesterdayActivity) {
            const newStreak = state.currentStreak + 1;
            return {
              ...state,
              currentStreak: newStreak,
              longestStreak: Math.max(state.longestStreak, newStreak),
            };
          }

          return state;
        }),
      resetData: () => set(defaultStats),
    }),
    {
      name: 'statistics-storage',
    }
  )
);