import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GlassCard } from '../components/ui/GlassCard';
import { UserCheck, Users } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalScans: 2730,
    flaggedScans: 792,
    detectionAccuracy: 99.4,
    activeUsers: 992,
    aiTokenUsage: 458920,
    systemStatus: "Operational (100% Uptime)"
  });

  const [usersList, setUsersList] = useState([
    { id: 'usr_1', name: 'Alex Johnson', email: 'user@scamshield.ai', role: 'user', scansCount: 18, threatsFound: 6, status: 'Active' },
    { id: 'usr_2', name: 'Sarah Connor', email: 'admin@scamshield.ai', role: 'admin', scansCount: 142, threatsFound: 49, status: 'Active' },
    { id: 'usr_3', name: 'Mark Davis', email: 'mark@company.com', role: 'user', scansCount: 4, threatsFound: 1, status: 'Active' },
    { id: 'usr_4', name: 'Suspicious Bot Account', email: 'bot99@tempmail.org', role: 'user', scansCount: 420, threatsFound: 390, status: 'Suspended' }
  ]);

  useEffect(() => {
    api.getAdminStats().then(res => {
      if (res.stats) setStats(res.stats);
    });
  }, []);

  const toggleUserStatus = (id: string) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <UserCheck className="w-7 h-7 text-purple-500" />
          <span>Admin Command Center</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          System health telemetry, active users management, flagged scam moderation queue, and AI token utilization.
        </p>
      </div>

      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard hoverEffect={false}>
          <p className="text-xs font-medium text-gray-400 uppercase">Total System Scans</p>
          <h3 className="text-2xl font-black text-white mt-1">{stats.totalScans.toLocaleString()}</h3>
          <span className="text-[10px] text-blue-400 font-semibold mt-1 block">Cross-vector total</span>
        </GlassCard>

        <GlassCard hoverEffect={false}>
          <p className="text-xs font-medium text-gray-400 uppercase">Flagged Fraud Items</p>
          <h3 className="text-2xl font-black text-red-400 mt-1">{stats.flaggedScans.toLocaleString()}</h3>
          <span className="text-[10px] text-red-400 font-semibold mt-1 block">Critical & High risk</span>
        </GlassCard>

        <GlassCard hoverEffect={false}>
          <p className="text-xs font-medium text-gray-400 uppercase">Registered Users</p>
          <h3 className="text-2xl font-black text-purple-400 mt-1">{stats.activeUsers.toLocaleString()}</h3>
          <span className="text-[10px] text-purple-300 font-semibold mt-1 block">Active SaaS accounts</span>
        </GlassCard>

        <GlassCard hoverEffect={false}>
          <p className="text-xs font-medium text-gray-400 uppercase">Gemini AI Tokens</p>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">{stats.aiTokenUsage.toLocaleString()}</h3>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Monthly quota usage</span>
        </GlassCard>
      </div>

      {/* User Management Table */}
      <GlassCard hoverEffect={false} className="space-y-4 border-purple-500/20">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <span>User Accounts & Security Roles</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] uppercase font-bold text-gray-400">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Total Scans</th>
                <th className="py-3 px-4">Threats Found</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-all">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-[10px] text-gray-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/10 text-gray-300'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-200">{u.scansCount}</td>
                  <td className="py-3 px-4 font-bold text-red-400">{u.threatsFound}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        u.status === 'Active' ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
