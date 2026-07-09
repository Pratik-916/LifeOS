import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  PenTool, 
  Map, 
  Target, 
  Settings,
  BarChart2,
  Repeat,
  Flame,
  Award,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../contexts/AuthContext';
import { LogoutDialog } from './auth/LogoutDialog';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Planner', path: '/planner', icon: CalendarDays },
  { name: 'Habits', path: '/habits', icon: Repeat },
  { name: 'Journal', path: '/journal', icon: BookOpen },
  { name: 'Blog', path: '/blog', icon: PenTool },
  { name: 'Journey', path: '/journey', icon: Map },
  { name: 'Goals', path: '/goals', icon: Target },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Calculate Level
  const calculateLevel = () => {
    return 1;
  };

  return (
    <aside className="w-64 h-screen border-r border-border/20 bg-surfaceElevated flex flex-col hidden md:flex sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-accent tracking-tight">
          LifeOS
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                isActive ? "text-accent" : "text-secondary hover:text-primary hover:bg-surfaceHighlight"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 bg-accent/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className="w-5 h-5 z-10" />
              <span className="z-10">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/20 mt-auto">
        <div className="bg-surface rounded-2xl p-4 flex flex-col gap-3 border border-border/10 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr bg-accent p-[2px] flex-shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover rounded-full bg-surface" />
              ) : (
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-primary font-bold">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-primary truncate">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.firstName || 'User')}
              </span>
              <span className="text-xs text-secondary truncate">{user?.email}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-2 border-t border-border/10">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-orange-400">
                <Flame className="w-3.5 h-3.5" />
                0 Day Streak
              </span>
              <span className="flex items-center gap-1.5 text-yellow-400">
                <Award className="w-3.5 h-3.5" />
                Level {calculateLevel()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-accent">
                <TrendingUp className="w-3.5 h-3.5" />
                0%
              </span>
              <button 
                onClick={() => setIsLogoutOpen(true)}
                className="flex items-center gap-1.5 text-danger hover:text-danger/80 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
      <LogoutDialog isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </aside>
  );
}
