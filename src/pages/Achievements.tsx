import { motion } from 'framer-motion';
import { useAchievementStore, Achievement } from '../store/achievementStore';

export function Achievements() {
  const { achievements } = useAchievementStore();
  const unlocked = achievements.filter((a: Achievement) => a.unlocked);

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
          style={{ objectPosition: 'center 40%' }}
        >
          <source src="/FocusForge/forge6.mp4" type="video/mp4" />
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
              Achievements
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto"
            >
              Celebrate your productivity milestones
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 flex justify-center gap-4 flex-wrap"
            >
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                🏆 {unlocked.length} Unlocked
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                🎯 {achievements.length - unlocked.length} Remaining
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                ⭐ Keep Going!
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
            transition={{ duration: 0.3, delay: index * 0.05 + 0.4 }}
            className={`bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-2xl p-6 text-center transition-all border hover:shadow-lg hover:scale-105 duration-300 ${
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
            {!achievement.unlocked && (
              <div className="mt-3 w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-1.5">
                <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '0%' }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;