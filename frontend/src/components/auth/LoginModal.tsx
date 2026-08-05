import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Lock, ShieldCheck, Globe } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onOpenForgot: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onOpenRegister, onOpenForgot }) => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      onClose();
    } catch (err) {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-card w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-gray-400 mt-1">Sign in to ScamShield AI Dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-gray-300">Password</label>
              <button
                type="button"
                onClick={() => { onClose(); onOpenForgot(); }}
                className="text-xs text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-300">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-black/50 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-[#12121A] px-3 text-xs text-gray-400 uppercase tracking-widest absolute">Or</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Globe className="w-4 h-4 text-red-400" />
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => { onClose(); onOpenRegister(); }}
            className="text-blue-400 font-medium hover:underline"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
};
