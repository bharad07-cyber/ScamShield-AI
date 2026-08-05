import React, { useState } from 'react';
import { useScan } from '../context/ScanContext';
import { GlassCard } from '../components/ui/GlassCard';
import { RiskScoreBadge } from '../components/ui/RiskScoreBadge';
import {
  ShieldAlert,
  Users,
  Clock
} from 'lucide-react';

export const ThreatFeed: React.FC = () => {
  const { threats } = useScan();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'UPI & Payment Fraud', 'Employment Fraud', 'Impersonation Scam'];

  const filteredThreats = threats.filter(t => selectedCategory === 'All' || t.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-red-500 animate-pulse" />
            <span>Real-Time Global Threat Feed</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Live cyber attack ticker monitoring active UPI frauds, courier scams, and phishing campaigns.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 border border-red-400'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Threat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredThreats.map((threat) => (
          <GlassCard key={threat.id} hoverEffect={true} glowColor="danger" className="space-y-3">
            <div className="flex items-center justify-between">
              <RiskScoreBadge level={threat.severity} size="sm" />
              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(threat.reportedAt).toLocaleDateString()}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{threat.title}</h3>
              <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest">{threat.category}</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {threat.description}
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Users className="w-4 h-4 text-blue-400" />
                <span>{threat.affectedCount.toLocaleString()} Victims Impacted</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {threat.status}
              </span>
            </div>

            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-xs text-red-200">
              <strong>Shield Action:</strong> {threat.mitigation}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
