import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useScan } from '../../context/ScanContext';
import {
  Bell,
  Search,
  ShieldCheck,
  Zap,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenNotifications }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { threatsDetectedCount } = useScan();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/history?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#09090B]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between gap-4">
      {/* Mobile Brand / Real-time System Status Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="hidden sm:inline">Threat Engine Live</span>
          <span className="sm:hidden">Live</span>
        </div>
      </div>

      {/* Global Quick Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative hidden md:block">
        <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search scans, threat domains, phone reports..."
          className="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-xs"
        />
      </form>

      {/* Actions & Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Quick Scan Button */}
        <button
          onClick={() => navigate('/scan/message')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>Quick Scan</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {threatsDetectedCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#09090B] animate-pulse"></span>
          )}
        </button>

        {/* Profile Avatar / Login trigger */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <img
                src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"}
                alt={user.name}
                className="w-7 h-7 rounded-lg border border-blue-500/40"
              />
              <span className="text-xs font-semibold text-white hidden md:inline">{user.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-48 glass-card rounded-2xl border border-white/10 p-2 shadow-2xl z-50 flex flex-col space-y-1">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { navigate('/settings'); setProfileDropdown(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/10 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => { logout(); setProfileDropdown(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
