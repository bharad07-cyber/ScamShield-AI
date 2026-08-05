import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ScanItem, ThreatItem } from '../types';
import { api } from '../services/api';

interface ScanContextType {
  scans: ScanItem[];
  threats: ThreatItem[];
  addScan: (scan: ScanItem) => void;
  toggleFavorite: (scanId: string) => void;
  deleteScan: (scanId: string) => void;
  restoreScan: (scanId: string) => void;
  todayScansCount: number;
  threatsDetectedCount: number;
  averageRiskScore: number;
  loading: boolean;
  refreshScans: () => Promise<void>;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scans, setScans] = useState<ScanItem[]>(() => {
    const saved = localStorage.getItem('scamshield_scans');
    if (saved) return JSON.parse(saved);
    
    return [
      {
        id: 'scn_8941',
        type: 'Message',
        target: 'CONGRATULATIONS! You won Rs 7,500 Scratch Card...',
        timestamp: new Date().toISOString(),
        riskLevel: 'Critical',
        scamProbability: 94.5,
        isFavorite: true,
        result: {
          scamProbability: 94.5,
          riskLevel: 'Critical',
          emotionalManipulationScore: 85,
          urgencyScore: 90,
          moneyScamScore: 95,
          identityTheftProbability: 70,
          explanation: 'Fraudulent UPI cashback refund scam. Scanning QR code will drain account.',
          reasoning: ['Artificial urgency', 'Direct UPI collect link payload', 'Unverified refund claim'],
          recommendedActions: ['Do not click link or scan QR', 'Report sender']
        }
      },
      {
        id: 'scn_8942',
        type: 'Website',
        target: 'http://amaz0n-security-login.xyz/verify-account',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        riskLevel: 'Critical',
        scamProbability: 98.0,
        result: {
          overallTrustScore: 2,
          scamProbability: 98.0,
          riskLevel: 'Critical',
          isHttps: false,
          domainAgeDays: 14,
          typosquattingDetected: true,
          impersonatedBrand: 'Amazon',
          sslStatus: 'No SSL Certificate Found',
          explanation: 'Dangerous brand impersonation site spoofing Amazon login page.',
          riskFlags: ['Insecure HTTP', 'Brand typosquatting', 'Suspicious TLD .xyz']
        }
      },
      {
        id: 'scn_8943',
        type: 'Email',
        target: 'URGENT: Account Suspension (support@paypal-security.org)',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        riskLevel: 'High',
        scamProbability: 78.0,
        result: {
          scamProbability: 78.0,
          riskLevel: 'High',
          explanation: 'Phishing email posing as PayPal support to steal login credentials.',
          isSpoofed: true,
          flaggedAttachments: ['Account_Verification_Form.exe']
        }
      }
    ];
  });

  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('scamshield_scans', JSON.stringify(scans));
  }, [scans]);

  useEffect(() => {
    api.getThreats().then(res => {
      if (res.threats) setThreats(res.threats);
    });
  }, []);

  const addScan = (scan: ScanItem) => {
    setScans(prev => [scan, ...prev]);
  };

  const toggleFavorite = (scanId: string) => {
    setScans(prev => prev.map(s => s.id === scanId ? { ...s, isFavorite: !s.isFavorite } : s));
  };

  const deleteScan = (scanId: string) => {
    setScans(prev => prev.map(s => s.id === scanId ? { ...s, isDeleted: true } : s));
  };

  const restoreScan = (scanId: string) => {
    setScans(prev => prev.map(s => s.id === scanId ? { ...s, isDeleted: false } : s));
  };

  const refreshScans = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory();
      if (res.scans && res.scans.length) {
        setScans(res.scans);
      }
    } finally {
      setLoading(false);
    }
  };

  const activeScans = scans.filter(s => !s.isDeleted);
  const todayScansCount = activeScans.length;
  const threatsDetectedCount = activeScans.filter(s => s.riskLevel === 'Critical' || s.riskLevel === 'High').length;
  const averageRiskScore = activeScans.length ? Math.round(activeScans.reduce((acc, s) => acc + s.scamProbability, 0) / activeScans.length) : 0;

  return (
    <ScanContext.Provider value={{
      scans: activeScans,
      threats,
      addScan,
      toggleFavorite,
      deleteScan,
      restoreScan,
      todayScansCount,
      threatsDetectedCount,
      averageRiskScore,
      loading,
      refreshScans
    }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) throw new Error('useScan must be used within a ScanProvider');
  return context;
};
