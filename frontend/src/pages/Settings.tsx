import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';
import {
  Sliders,
  User,
  Bell,
  Key,
  CheckCircle2,
  Save
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Alex Johnson');
  const [email, setEmail] = useState(user?.email || 'user@scamshield.ai');
  const [geminiKey, setGeminiKey] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Sliders className="w-7 h-7 text-blue-500" />
          <span>Account & Security Settings</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage user profile credentials, API keys, notification preferences, and security report options.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <GlassCard hoverEffect={false} className="space-y-4 border-blue-500/20">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <span>Profile Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>
        </GlassCard>

        {/* API Key Config */}
        <GlassCard hoverEffect={false} className="space-y-4 border-purple-500/20">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            <span>Custom Gemini AI API Key (Optional)</span>
          </h2>
          <p className="text-xs text-gray-400">
            By default ScamShield AI uses built-in smart local heuristic fallbacks. You can optionally paste your free Google Gemini API key below.
          </p>
          <input
            type="password"
            value={geminiKey}
            onChange={e => setGeminiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="glass-input w-full px-4 py-2.5 rounded-xl text-xs font-mono"
          />
        </GlassCard>

        {/* Notifications Config */}
        <GlassCard hoverEffect={false} className="space-y-4 border-amber-500/20">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <span>Notification & Security Audits</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white">Email Threat Alerts</span>
                <p className="text-[11px] text-gray-400">Instant email when critical scam URLs or handles are detected</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white">Weekly Security Summary Audit</span>
                <p className="text-[11px] text-gray-400">Receive weekly PDF summary of scanned items and threat trends</p>
              </div>
              <input
                type="checkbox"
                checked={weeklyReports}
                onChange={e => setWeeklyReports(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </GlassCard>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
