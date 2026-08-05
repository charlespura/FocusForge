import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStatisticsStore } from '../store/statisticsStore';
import { useTaskStore, Task } from '../store/taskStore';

export function Analytics() {
  const { totalSessions, totalFocusTime, currentStreak, longestStreak, dailySessions } = useStatisticsStore();
  const { tasks } = useTaskStore();

  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter((t: Task) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Prepare daily data
  const today = new Date();
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    return {
      date: key,
      sessions: dailySessions[key] || 0,
    };
  }).reverse();

  // Prepare task completion data
  const taskData = [
    { name: 'Completed', value: completedTasksCount },
    { name: 'Pending', value: totalTasks - completedTasksCount },
  ];

  const COLORS = ['#ff4444', '#e5e7eb'];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your productivity metrics</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Focus Time', value: `${Math.round(totalFocusTime / 60)}h ${Math.round(totalFocusTime % 60)}m` },
          { label: 'Current Streak', value: `${currentStreak} days` },
          { label: 'Longest Streak', value: `${longestStreak} days` },
          { label: 'Total Sessions', value: totalSessions },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-200 dark:border-zinc-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-200 dark:border-zinc-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Sessions (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="sessions" fill="#ff4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-200 dark:border-zinc-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Completion Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {taskData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Completed ({completionRate}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-zinc-700" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Pending ({100 - completionRate}%)
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Also add a default export for compatibility
export default Analytics;