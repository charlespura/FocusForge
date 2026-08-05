import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DailyGoal {
  target: number;
  current: number;
  date: string;
}

interface GoalStore {
  dailyGoal: number;
  setDailyGoal: (target: number) => void;
  getTodayGoal: () => DailyGoal;
  incrementProgress: () => void;
  resetDailyProgress: () => void;
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      dailyGoal: 8,
      setDailyGoal: (target) => set({ dailyGoal: target }),
      getTodayGoal: () => {
        const today = new Date().toISOString().split('T')[0];
        const stored = localStorage.getItem(`goal-${today}`);
        if (stored) {
          return JSON.parse(stored);
        }
        return { target: get().dailyGoal, current: 0, date: today };
      },
      incrementProgress: () => {
        const today = new Date().toISOString().split('T')[0];
        const goal = get().getTodayGoal();
        const updated = { ...goal, current: Math.min(goal.current + 1, goal.target) };
        localStorage.setItem(`goal-${today}`, JSON.stringify(updated));
      },
      resetDailyProgress: () => {
        const today = new Date().toISOString().split('T')[0];
        const goal = get().getTodayGoal();
        const updated = { ...goal, current: 0 };
        localStorage.setItem(`goal-${today}`, JSON.stringify(updated));
      },
    }),
    {
      name: 'goal-storage',
    }
  )
);