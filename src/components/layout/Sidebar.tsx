import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Timer, 
  CheckSquare, 
  LineChart, 
  StickyNote, 
  Trophy, 
  Settings 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/timer', icon: Timer, label: 'Timer' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/analytics', icon: LineChart, label: 'Analytics' },
  { path: '/notes', icon: StickyNote, label: 'Notes' },
  { path: '/achievements', icon: Trophy, label: 'Achievements' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { theme } = useThemeStore();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-16 md:w-20 border-r border-gray-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl">
      <div className="flex flex-col items-center h-full py-4">
        <div className="mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            F
          </div>
        </div>

        <nav className="flex-1 space-y-1 md:space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800 group ${
                  isActive ? 'bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-red-500"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 translate-x-full ml-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
      </div>
    </aside>
  );
}