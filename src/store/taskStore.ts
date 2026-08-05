import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order' | 'completedPomodoros'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  incrementPomodoros: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (taskData) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...taskData,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              order: state.tasks.length,
              completedPomodoros: 0,
            },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleTaskComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      reorderTasks: (startIndex, endIndex) =>
        set((state) => {
          const newTasks = [...state.tasks];
          const [removed] = newTasks.splice(startIndex, 1);
          newTasks.splice(endIndex, 0, removed);
          return {
            tasks: newTasks.map((task, index) => ({ ...task, order: index })),
          };
        }),
      incrementPomodoros: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
              : task
          ),
        })),
    }),
    {
      name: 'tasks-storage',
    }
  )
);