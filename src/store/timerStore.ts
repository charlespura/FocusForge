import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimerSettings {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreak: boolean;
  autoStartFocus: boolean;
  notifications: boolean;
  alarmSound: boolean;
}

const defaultSettings: TimerSettings = {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreak: false,
  autoStartFocus: false,
  notifications: true,
  alarmSound: true,
};

interface TimerStore {
  settings: TimerSettings;
  updateSettings: (settings: Partial<TimerSettings>) => void;
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'timer-settings',
    }
  )
);