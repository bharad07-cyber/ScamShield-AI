import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ThreatDistributionChart: React.FC = () => {
  const data = {
    labels: ['UPI & Payment Scam', 'Phishing Links', 'Fake Job Offers', 'Credential Theft', 'QR Code Fraud'],
    datasets: [
      {
        data: [38, 25, 18, 12, 7],
        backgroundColor: [
          '#EF4444',
          '#F59E0B',
          '#7C3AED',
          '#2563EB',
          '#10B981'
        ],
        borderColor: '#09090B',
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#9CA3AF',
          font: { family: 'Inter', size: 11 },
          boxWidth: 12
        }
      }
    }
  };

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <Pie data={data} options={options} />
    </div>
  );
};
