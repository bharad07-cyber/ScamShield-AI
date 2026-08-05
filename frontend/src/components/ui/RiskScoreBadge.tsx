import React from 'react';
import type { RiskLevel } from '../../types';
import { ShieldAlert, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

interface RiskScoreBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskScoreBadge: React.FC<RiskScoreBadgeProps> = ({ level, score, size = 'md' }) => {
  const styles = {
    Critical: 'bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.25)]',
    High: 'bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.25)]',
    Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
  };

  const icons = {
    Critical: <ShieldAlert className="w-4 h-4" />,
    High: <AlertTriangle className="w-4 h-4" />,
    Medium: <Info className="w-4 h-4" />,
    Low: <ShieldCheck className="w-4 h-4" />
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5 font-bold'
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold backdrop-blur-md transition-all ${styles[level]} ${sizeClasses[size]}`}>
      {icons[level]}
      <span>{level} Risk</span>
      {score !== undefined && <span className="opacity-80">({score}%)</span>}
    </span>
  );
};
