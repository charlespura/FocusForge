import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const defaultAchievements: Achievement[] = [
  { id: 'first-focus', title: 'First Focus', description: 'Complete your first Pomodoro session', icon: '🚀', unlocked: false },
  { id: '10-sessions', title: '10 Sessions', description: 'Complete 10 Pomodoro sessions', icon: '10️⃣', unlocked: false },
  { id: '50-sessions', title: '50 Sessions', description: 'Complete 50 Pomodoro sessions', icon: '50️⃣', unlocked: false },
  { id: '100-sessions', title: '100 Sessions', description: 'Complete 100 Pomodoro sessions', icon: '💯', unlocked: false },
  { id: '500-sessions', title: '500 Sessions', description: 'Complete 500 Pomodoro sessions', icon: '🌟', unlocked: false },
  { id: '1000-sessions', title: '1000 Sessions', description: 'Complete 1000 Pomodoro sessions', icon: '🏆', unlocked: false },
  { id: '7-day-streak', title: '7 Day Streak', description: 'Maintain a 7 day streak', icon: '📅', unlocked: false },
  { id: '30-day-streak', title: '30 Day Streak', description: 'Maintain a 30 day streak', icon: '🗓️', unlocked: false },
  { id: 'daily-goal', title: 'Daily Goal', description: 'Complete your daily goal', icon: '🎯', unlocked: false },
  { id: 'focus-4-hours', title: 'Focus 4 Hours', description: 'Accumulate 4 hours of focus time', icon: '⏰', unlocked: false },
  { id: 'focus-8-hours', title: 'Focus 8 Hours', description: 'Accumulate 8 hours of focus time', icon: '⌛', unlocked: false },
];

interface AchievementStore {
  achievements: Achievement[];
  unlockedAchievements: string[];
  unlockAchievement: (id: string) => boolean;
  resetAchievements: () => void;
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      achievements: defaultAchievements,
      unlockedAchievements: [],
      unlockAchievement: (id) => {
        const { achievements, unlockedAchievements } = get();
        const achievement = achievements.find(a => a.id === id);
        
        if (!achievement || achievement.unlocked) {
          return false;
        }

        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        
        set({
          achievements: [...achievements],
          unlockedAchievements: [...unlockedAchievements, id],
        });

        return true;
      },
      resetAchievements: () =>
        set({
          achievements: defaultAchievements.map(a => ({ ...a, unlocked: false, unlockedAt: undefined })),
          unlockedAchievements: [],
        }),
    }),
    {
      name: 'achievements-storage',
    }
  )
);