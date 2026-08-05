import React, { useState } from 'react';
import { X, ShieldAlert, Bell, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [browserNotifications, setBrowserNotifications] = useState(true);

  if (!isOpen) return null;

  const alerts = [
    {
      id: 'n_1',
      title: 'Critical Threat Alert: Fake UPI QR Code Wave',
      time: '10 mins ago',
      level: 'Critical',
      desc: 'High volume of fraudulent UPI collect handles impersonating PhonePe/GPay refunds in your region.'
    },
    {
      id: 'n_2',
      title: 'Phishing Campaign: HDFC Account Suspension SMS',
      time: '1 hour ago',
      level: 'High',
      desc: 'Malicious domain hdfc-kyc-update.xyz flagged and added to global threat blacklist.'
    },
    {
      id: 'n_3',
      title: 'Weekly Security Audit Generated',
      time: '1 day ago',
      level: 'Info',
      desc: 'Your weekly scam protection summary report is ready for download in settings.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end">
      <div className="glass-card w-full max-w-md h-full border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-lg text-white">Security Alerts Center</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Browser Notifications Toggle */}
          <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-gray-200">Browser Push Alerts</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={browserNotifications}
                onChange={e => setBrowserNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Alert List */}
          <div className="space-y-3">
            {alerts.map((item) => (
              <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.level === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    item.level === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {item.level}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.time}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { onClose(); navigate('/threats'); }}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
        >
          <span>View Real-Time Threat Feed</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
