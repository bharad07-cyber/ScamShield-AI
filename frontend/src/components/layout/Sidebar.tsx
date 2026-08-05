import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useScan } from '../../context/ScanContext';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Globe,
  Mail,
  QrCode,
  Image,
  PhoneCall,
  Bot,
  History,
  ShieldAlert,
  Sliders,
  ShieldCheck,
  UserCheck,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  onOpenLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenLogin }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { todayScansCount, threatsDetectedCount } = useScan();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Message Scanner', path: '/scan/message', icon: MessageSquareWarning },
    { label: 'Website Scanner', path: '/scan/website', icon: Globe },
    { label: 'Email Scanner', path: '/scan/email', icon: Mail },
    { label: 'QR Code Scanner', path: '/scan/qr', icon: QrCode },
    { label: 'Image Scanner', path: '/scan/image', icon: Image },
    { label: 'Phone Scanner', path: '/scan/phone', icon: PhoneCall },
    { label: 'AI Security Advisor', path: '/chat', icon: Bot, badge: 'AI' },
    { label: 'Scan History', path: '/history', icon: History, badge: todayScansCount ? `${todayScansCount}` : undefined },
    { label: 'Real-Time Threats', path: '/threats', icon: ShieldAlert, badge: threatsDetectedCount ? `${threatsDetectedCount}` : undefined, badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { label: 'Settings', path: '/settings', icon: Sliders },
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: UserCheck, badge: 'Admin', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#09090B]/90 backdrop-blur-xl border-r border-white/10 p-4 z-40 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-4 mb-4">
        <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/30 text-white">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">ScamShield <span className="text-blue-500">AI</span></h1>
          <p className="text-[10px] text-gray-400 mt-1 font-medium tracking-wide">THINK BEFORE YOU TRUST</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold ${item.badgeColor || 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile / Auth Card */}
      <div className="mt-auto pt-4 border-t border-white/10">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between p-2.5 glass-card rounded-xl border border-white/10">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-blue-500/40 bg-blue-900/30"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </aside>
  );
};
