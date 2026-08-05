import { motion } from 'framer-motion';
import { useAchievementStore, Achievement } from '../store/achievementStore';

export function Achievements() {
  const { achievements } = useAchievementStore();
  const unlocked = achievements.filter((a: Achievement) => a.unlocked);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {unlocked.length} of {achievements.length} achievements unlocked
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement: Achievement, index: number) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`bg-white dark:bg-zinc-800/50 rounded-2xl p-6 text-center transition-all border ${
              achievement.unlocked
                ? 'border-red-500/30 bg-red-50/50 dark:bg-red-950/30'
                : 'border-gray-200 dark:border-zinc-700 opacity-50'
            }`}
          >
            <div className="text-4xl mb-3">{achievement.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{achievement.description}</p>
            {achievement.unlocked && achievement.unlockedAt && (
              <p className="text-xs text-gray-400 mt-2">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Also add a default export for compatibility
export default Achievements;