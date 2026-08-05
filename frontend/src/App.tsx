import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScanProvider } from './context/ScanContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { Dashboard } from './pages/Dashboard';
import { MessageScanner } from './pages/MessageScanner';
import { WebsiteScanner } from './pages/WebsiteScanner';
import { EmailScanner } from './pages/EmailScanner';
import { QRScanner } from './pages/QRScanner';
import { ImageScanner } from './pages/ImageScanner';
import { PhoneScanner } from './pages/PhoneScanner';
import { AIChat } from './pages/AIChat';
import { History } from './pages/History';
import { ThreatFeed } from './pages/ThreatFeed';
import { AdminPanel } from './pages/AdminPanel';
import { Settings } from './pages/Settings';

export const AppContent: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#09090B] text-gray-100 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar onOpenLogin={() => setLoginModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan/message" element={<MessageScanner />} />
            <Route path="/scan/website" element={<WebsiteScanner />} />
            <Route path="/scan/email" element={<EmailScanner />} />
            <Route path="/scan/qr" element={<QRScanner />} />
            <Route path="/scan/image" element={<ImageScanner />} />
            <Route path="/scan/phone" element={<PhoneScanner />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/history" element={<History />} />
            <Route path="/threats" element={<ThreatFeed />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Drawers & Modals */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onOpenRegister={() => setRegisterModalOpen(true)}
        onOpenForgot={() => setForgotModalOpen(true)}
      />

      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        onOpenLogin={() => setLoginModalOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScanProvider>
          <AppContent />
        </ScanProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
