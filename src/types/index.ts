export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  category?: string;
  dueDate?: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
  order: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface TimerSettings {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreak: boolean;
  autoStartFocus: boolean;
  notifications: boolean;
  alarmSound: boolean;
}

export interface DailyGoal {
  target: number;
  current: number;
  date: string;
}

export interface Statistics {
  totalSessions: number;
  totalFocusTime: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  dailySessions: Record<string, number>;
  weeklySessions: Record<string, number>;
}

export type Theme = 'light' | 'dark' | 'ocean' | 'forest' | 'lavender' | 'warm-sand' | 'midnight' | 'amoled';