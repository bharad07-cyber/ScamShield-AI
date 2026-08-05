import React from 'react';

interface RiskGaugeProps {
  score: number; // 0 - 100
  title?: string;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, title = "Scam Probability Score", size = 180 }) => {
  const radius = 70;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "#10B981"; // Safe
  if (score > 75) strokeColor = "#EF4444"; // Danger
  else if (score > 40) strokeColor = "#F59E0B"; // Warning

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size / 1.8 }}>
        <svg className="w-full h-full overflow-visible" viewBox="0 0 160 90">
          {/* Background Arc */}
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Filled Animated Arc */}
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke={strokeColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0px 0px 8px ${strokeColor})`
            }}
          />
        </svg>

        {/* Center Text Score */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-3xl font-black tracking-tight text-white">{score}%</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Risk Score</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-medium text-gray-400">{title}</p>
    </div>
  );
};
