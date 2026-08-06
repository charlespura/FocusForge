import { motion } from 'framer-motion';
import { useStatisticsStore } from '../store/statisticsStore';
import { useGoalStore } from '../store/goalStore';
import { useTaskStore, Task } from '../store/taskStore';
import { Timer, CheckSquare, Trophy, Clock } from 'lucide-react';

export function Dashboard() {
  const { totalSessions, totalFocusTime, completedTasks, currentStreak } = useStatisticsStore();
  const { getTodayGoal } = useGoalStore();
  const { tasks } = useTaskStore();
  const todayGoal = getTodayGoal();

  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter((t: Task) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Focus Sessions',
      value: totalSessions,
      icon: Timer,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/50',
    },
    {
      title: 'Tasks Completed',
      value: completedTasks,
      icon: CheckSquare,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-950/50',
    },
    {
      title: 'Current Streak',
      value: `${currentStreak} days`,
      icon: Trophy,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-950/50',
    },
    {
      title: 'Focus Time',
      value: `${Math.round(totalFocusTime / 60)}h ${Math.round(totalFocusTime % 60)}m`,
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Video Background Section - Full width hero with better overlay */}
      <div className="relative rounded-2xl overflow-hidden h-[300px] md:h-[400px] lg:h-[450px] mb-8 bg-black/90">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          style={{ objectPosition: 'center 40%' }}
        >
          <source src="/FocusForge/forge1.mp4" type="video/mp4" />
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
              FocusForge
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto"
            >
              Forge your focus, achieve your goals
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 flex justify-center gap-4 flex-wrap"
            >
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                🎯 Focus Mode
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                ⏱️ Pomodoro Timer
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                📊 Track Progress
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's your productivity overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
            className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-zinc-700 hover:scale-105 duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Goal</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {todayGoal.current} / {todayGoal.target} Pomodoros
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((todayGoal.current / todayGoal.target) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {todayGoal.current >= todayGoal.target ? '🎉 Goal completed for today!' : `${todayGoal.target - todayGoal.current} more to go!`}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Completion</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Completed</span>
              <span className="font-medium text-gray-900 dark:text-white">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {completedTasksCount} of {totalTasks} tasks completed
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;