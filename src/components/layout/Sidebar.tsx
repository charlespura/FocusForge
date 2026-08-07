import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Timer, 
  CheckSquare, 
  LineChart, 
  StickyNote, 
  Trophy, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button - visible only on small screens */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 shadow-lg md:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - desktop always visible, mobile slides in */}
      <aside className={`
        fixed left-0 top-0 z-40 h-screen 
        border-r border-gray-200 dark:border-zinc-800 
        bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        w-16 md:w-20
      `}>
        <div className="flex flex-col items-center h-full py-4">
          {/* Logo - using image instead of text */}
          <div className="mb-8 mt-12 md:mt-0">
            <img 
              src="iconslogo.png" 
              alt="FocusForge Logo" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-lg"
            />
          </div>

          <nav className="flex-1 space-y-1 md:space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
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
                    {/* Tooltip - exactly as you had it */}
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
    </>
  );
}