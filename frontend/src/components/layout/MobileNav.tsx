import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Globe,
  Bot,
  History,
  Menu,
  X,
  Mail,
  QrCode,
  Image,
  PhoneCall,
  ShieldAlert,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Message', path: '/scan/message', icon: MessageSquareWarning },
    { label: 'Website', path: '/scan/website', icon: Globe },
    { label: 'AI Advisor', path: '/chat', icon: Bot },
    { label: 'History', path: '/history', icon: History }
  ];

  const allScanners = [
    { label: 'Message Scanner', path: '/scan/message', icon: MessageSquareWarning },
    { label: 'Website Scanner', path: '/scan/website', icon: Globe },
    { label: 'Email Scanner', path: '/scan/email', icon: Mail },
    { label: 'QR Code Scanner', path: '/scan/qr', icon: QrCode },
    { label: 'Image Scanner', path: '/scan/image', icon: Image },
    { label: 'Phone Scanner', path: '/scan/phone', icon: PhoneCall },
    { label: 'Real-Time Threats', path: '/threats', icon: ShieldAlert },
    { label: 'Settings', path: '/settings', icon: Sliders }
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090B]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
                  isActive ? 'text-blue-400 font-bold' : 'text-gray-400'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center py-1 px-2 text-gray-400 hover:text-white text-[10px]"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Slide-out Menu Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end lg:hidden">
          <div className="glass-card rounded-t-3xl border-t border-white/10 p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
                <span className="font-bold text-white text-base">All Modules</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {allScanners.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-xs font-semibold text-gray-200 hover:bg-white/10 transition-all"
                  >
                    <Icon className="w-5 h-5 text-blue-400" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
