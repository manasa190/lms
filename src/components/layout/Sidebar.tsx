import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard, BookOpen, GraduationCap, Users, BarChart3, Bell, Settings,
  LogOut, Sun, Moon, PlusCircle, MessageSquare, Award, ChevronLeft, ChevronRight,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'Browse Courses' },
    { to: '/my-courses', icon: GraduationCap, label: 'My Courses' },
    { to: '/leaderboard', icon: BarChart3, label: 'Leaderboard' },
    { to: '/certificates', icon: Award, label: 'Certificates' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const instructorLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'Browse Courses' },
    { to: '/my-courses', icon: GraduationCap, label: 'My Courses' },
    { to: '/create-course', icon: PlusCircle, label: 'Create Course' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'All Courses' },
    { to: '/users', icon: Users, label: 'Manage Users' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const links = user.role === 'admin' ? adminLinks : user.role === 'instructor' ? instructorLinks : studentLinks;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen sticky top-0 flex flex-col border-r border-sidebar-border bg-sidebar overflow-hidden z-30"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-sidebar-foreground">Learnova</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(link => (
          <NavLink key={link.to} to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`
            }
          >
            <link.icon className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{link.label}</motion.span>}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button onClick={toggle} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 w-full">
          {isDark ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full">
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>

        {!collapsed && (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-3 py-2.5 mt-2 w-full rounded-lg hover:bg-sidebar-accent/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              {user.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </button>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
