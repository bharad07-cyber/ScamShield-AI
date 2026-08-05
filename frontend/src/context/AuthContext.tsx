import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('scamshield_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_demo_89',
      email: 'alex.shield@scamshield.ai',
      name: 'Alex Johnson',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('scamshield_token') || 'demo-jwt-token-scamshield-2026';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('scamshield_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('scamshield_user');
    }
  }, [user]);

  const login = async (email: string, _password: string, remember: boolean = true) => {
    const role = email.includes('admin') ? 'admin' : 'user';
    const newUser: User = {
      id: `usr_${Math.floor(Math.random() * 10000)}`,
      email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    setUser(newUser);
    const mockToken = `jwt-token-${Date.now()}`;
    setToken(mockToken);
    if (remember) {
      localStorage.setItem('scamshield_token', mockToken);
    }
    return true;
  };

  const loginWithGoogle = async () => {
    const googleUser: User = {
      id: `usr_g_${Math.floor(Math.random() * 10000)}`,
      email: 'user.google@gmail.com',
      name: 'Google Verified User',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Google'
    };
    setUser(googleUser);
    setToken(`google-jwt-${Date.now()}`);
    return true;
  };

  const register = async (name: string, email: string, _password: string) => {
    const newUser: User = {
      id: `usr_${Math.floor(Math.random() * 10000)}`,
      email,
      name,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };
    setUser(newUser);
    setToken(`jwt-register-${Date.now()}`);
    return true;
  };

  const forgotPassword = async (_email: string) => {
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('scamshield_user');
    localStorage.removeItem('scamshield_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, loginWithGoogle, register, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
