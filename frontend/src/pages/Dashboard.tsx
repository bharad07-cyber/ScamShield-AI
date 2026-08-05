import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScan } from '../context/ScanContext';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';
import { RiskScoreBadge } from '../components/ui/RiskScoreBadge';
import { ActivityLineChart } from '../components/charts/ActivityLineChart';
import { ThreatDistributionChart } from '../components/charts/ThreatDistributionChart';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  MessageSquareWarning,
  Globe,
  Mail,
  QrCode,
  Image as ImageIcon,
  PhoneCall,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scans, todayScansCount, threatsDetectedCount, averageRiskScore } = useScan();

  const quickScans = [
    { title: 'Message Scanner', desc: 'SMS, WhatsApp, Telegram text', path: '/scan/message', icon: MessageSquareWarning, color: 'from-blue-600 to-indigo-600' },
    { title: 'Website Scanner', desc: 'URL, SSL, Typosquatting', path: '/scan/website', icon: Globe, color: 'from-purple-600 to-pink-600' },
    { title: 'Email Scanner', desc: 'Header spoofing, Phishing', path: '/scan/email', icon: Mail, color: 'from-amber-600 to-orange-600' },
    { title: 'QR Code Scanner', desc: 'Payment scam links, Short URLs', path: '/scan/qr', icon: QrCode, color: 'from-emerald-600 to-teal-600' },
    { title: 'Image Scanner', desc: 'Screenshot OCR text analysis', path: '/scan/image', icon: ImageIcon, color: 'from-cyan-600 to-blue-600' },
    { title: 'Phone Lookup', desc: 'Spam reports, Fraud score', path: '/scan/phone', icon: PhoneCall, color: 'from-rose-600 to-red-600' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <GlassCard className="bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border-blue-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10 relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PRO ACTIVE SHIELD v2.4
              </span>
              <span className="text-xs text-gray-400">System Healthy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back, <span className="text-gradient-primary">{user?.name || 'Security Guardian'}</span>
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              ScamShield AI is actively protecting your digital accounts and scanning incoming threats in real-time.
            </p>
          </div>
          <button
            onClick={() => navigate('/scan/message')}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Launch Instant Scan</span>
          </button>
        </div>
      </GlassCard>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard hoverEffect={false} className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Today's Scans</p>
            <h3 className="text-2xl font-black text-white mt-1">{todayScansCount + 14}</h3>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +18.4% from yesterday
            </span>
          </div>
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
            <Zap className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Threats Detected</p>
            <h3 className="text-2xl font-black text-red-400 mt-1">{threatsDetectedCount + 5}</h3>
            <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" /> Critical vector alerts
            </span>
          </div>
          <div className="p-3 bg-red-600/20 text-red-400 rounded-2xl border border-red-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Risk Index</p>
            <h3 className="text-2xl font-black text-amber-300 mt-1">{averageRiskScore}%</h3>
            <span className="text-[10px] text-gray-400 font-semibold mt-1 block">Threat probability</span>
          </div>
          <div className="p-3 bg-amber-600/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Shield Status</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">99.4%</h3>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3" /> Active protection
            </span>
          </div>
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Quick Scan Launchers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <span>Quick Threat Scanner Launchers</span>
          </h2>
          <span className="text-xs text-gray-400">Select input vector</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickScans.map((qs) => {
            const Icon = qs.icon;
            return (
              <GlassCard
                key={qs.title}
                onClick={() => navigate(qs.path)}
                className="flex items-center gap-4 group cursor-pointer hover:border-blue-500/40"
              >
                <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${qs.color} text-white shadow-lg group-hover:scale-105 transition-all`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-all flex items-center justify-between">
                    <span>{qs.title}</span>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{qs.desc}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard hoverEffect={false} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Scan Activity & Detection Rate</h3>
            <span className="text-xs text-gray-400">Last 7 Days</span>
          </div>
          <ActivityLineChart />
        </GlassCard>

        <GlassCard hoverEffect={false} className="space-y-4 flex flex-col justify-between">
          <h3 className="text-base font-bold text-white">Threat Category Breakdown</h3>
          <ThreatDistributionChart />
          <div className="text-center pt-2">
            <span className="text-xs text-gray-400">Top Threat: UPI Payment Scams (38%)</span>
          </div>
        </GlassCard>
      </div>

      {/* Recent History Feed */}
      <GlassCard hoverEffect={false} className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Recent Scan History</h3>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Scans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {scans.slice(0, 4).map((scan) => (
            <div
              key={scan.id}
              onClick={() => navigate('/history')}
              className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-4 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 truncate">
                <span className="text-xs font-mono font-bold px-2 py-1 bg-white/10 text-gray-300 rounded-lg">
                  {scan.type}
                </span>
                <span className="text-xs font-semibold text-white truncate max-w-md">{scan.target}</span>
              </div>
              <div className="flex items-center gap-3">
                <RiskScoreBadge level={scan.riskLevel} score={scan.scamProbability} size="sm" />
                <span className="text-[10px] text-gray-400 hidden sm:inline">
                  {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
