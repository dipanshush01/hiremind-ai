import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, LayoutDashboard, Play, FileText, BarChart3,
  Code, Settings, LogOut, Menu, X, Trophy, Upload,
  Shield, Users, Activity, ChevronRight
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, collapsed }) => (
  <NavLink to={to} end
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
      ${isActive ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`
    }>
    <Icon size={18} className="flex-shrink-0" />
    <AnimatePresence>
      {!collapsed && <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap">{label}</motion.span>}
    </AnimatePresence>
  </NavLink>
);

export default function DashboardLayout({ isAdmin }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const userNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/start-interview', icon: Play, label: 'Start Interview' },
    { to: '/dashboard/interviews', icon: FileText, label: 'My Interviews' },
    { to: '/dashboard/resume', icon: Upload, label: 'Resume' },
    { to: '/dashboard/coding', icon: Code, label: 'Coding Practice' },
    { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const adminNavItems = [
    { to: '/admin', icon: Activity, label: 'Overview' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/interviews', icon: FileText, label: 'Interviews' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/settings', icon: Shield, label: 'Settings' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const Sidebar = () => (
    <div className={`flex flex-col h-full bg-surface border-r border-border transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
                <Zap size={14} className="text-accent" />
              </div>
              <span className="font-bold text-base tracking-tight">HireMind<span className="text-accent">AI</span></span>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-surface-alt text-text-muted hover:text-text-primary transition-colors ml-auto">
          {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
        {navItems.map(item => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </div>

      {/* User info + logout */}
      <div className="border-t border-border p-3 flex-shrink-0">
        <div className={`flex items-center gap-3 mb-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 font-bold text-accent text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                <p className="text-xs text-text-muted truncate font-mono">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-red hover:bg-red/5 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={16} />
          <AnimatePresence>
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Sign Out</motion.span>}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden w-64">
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-border bg-surface flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-text-secondary"><Menu size={20} /></button>
          <span className="font-bold">HireMind<span className="text-accent">AI</span></span>
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
