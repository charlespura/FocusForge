import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Edit2, GripVertical } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useStatisticsStore } from '../store/statisticsStore';

export function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete, reorderTasks } = useTaskStore();
  const { incrementCompletedTasks } = useStatisticsStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', description: '' });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    estimatedPomodoros: 1,
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: '',
    dueDate: '',
  });

  const activeTasks = tasks.filter(t => !t.completed).sort((a, b) => a.order - b.order);
  const completedTasks = tasks.filter(t => t.completed);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addTask({
      title: newTask.title,
      description: newTask.description || undefined,
      estimatedPomodoros: newTask.estimatedPomodoros,
      priority: newTask.priority,
      category: newTask.category || undefined,
      dueDate: newTask.dueDate || undefined,
      completed: false,
    });
    setNewTask({ 
      title: '', 
      description: '', 
      estimatedPomodoros: 1, 
      priority: 'medium', 
      category: '', 
      dueDate: '' 
    });
    setIsAdding(false);
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditData({ title: task.title, description: task.description || '' });
      setEditingId(id);
    }
  };

  const handleSaveEdit = (id: string) => {
    updateTask(id, {
      title: editData.title,
      description: editData.description || undefined,
    });
    setEditingId(null);
    setEditData({ title: '', description: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ title: '', description: '' });
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      incrementCompletedTasks();
    }
    toggleTaskComplete(id);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Reorder the tasks
    reorderTasks(draggedIndex, index);
    setDraggedIndex(index);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Video Background Section - Full width hero like Dashboard */}
   <div className="relative rounded-2xl overflow-hidden h-[300px] md:h-[400px] lg:h-[450px] mb-8 bg-black/90">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover opacity-70"
    style={{ 
      objectPosition: 'center 50%',
      transform: 'scale(1)',
    }}
  >
    <source src="/FocusForge/forge3.mp4" type="video/mp4" />
  </video>
        
        {/* Enhanced gradient overlay for better text readability */}
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
              Task Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto"
            >
              Organize, prioritize, and conquer your tasks
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 flex justify-center gap-4 flex-wrap"
            >
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                ✅ Track Progress
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                🎯 Set Priorities
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                📊 Pomodoro Integration
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your tasks and track progress</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </motion.div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl p-6"
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Est. Pomodoros</label>
                  <input
                    type="number"
                    min="1"
                    value={newTask.estimatedPomodoros}
                    onChange={(e) => setNewTask({ ...newTask, estimatedPomodoros: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddTask}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Tasks</h2>
        <AnimatePresence>
          {activeTasks.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 dark:text-gray-400 text-center py-8"
            >
              No active tasks. Add a task to get started!
            </motion.p>
          ) : (
            activeTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl p-4 hover:shadow-lg transition-shadow cursor-move"
              >
                {editingId === task.id ? (
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="flex-1 px-3 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-zinc-600 flex items-center justify-center hover:border-red-500 transition-colors"
                    >
                      {task.completed && <Check className="w-4 h-4 text-red-500" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                        <span className="font-medium text-gray-900 dark:text-white">{task.title}</span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>Progress: {task.completedPomodoros}/{task.estimatedPomodoros}</span>
                        {task.category && <span>• {task.category}</span>}
                        {task.dueDate && <span>• Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTask(task.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Completed Tasks</h2>
          <AnimatePresence>
            {completedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl p-4 opacity-60"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex-1">
                    <span className="line-through text-gray-500 dark:text-gray-400">{task.title}</span>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                      <span>Completed {task.completedPomodoros} pomodoros</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Tasks;