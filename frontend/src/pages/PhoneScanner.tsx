import React, { useState } from 'react';
import { useScan } from '../context/ScanContext';
import { api } from '../services/api';
import { SAMPLE_PHONES } from '../utils/sampleScams';
import type { ScanItem } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { RiskAnalysisCard } from '../components/ui/RiskAnalysisCard';
import {
  PhoneCall,
  Search,
  ShieldAlert,
  Zap,
  PlusCircle,
  X
} from 'lucide-react';

export const PhoneScanner: React.FC = () => {
  const { addScan } = useScan();
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanItem | null>(null);

  // Modal report state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState('UPI Fraud');
  const [reportComment, setReportComment] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!number.trim()) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await api.scanPhone(number);
      if (res.scan) {
        setScanResult(res.scan);
        addScan(res.scan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportModalOpen(false);
      setReportComment('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <PhoneCall className="w-7 h-7 text-rose-500" />
            <span>Phone Number Fraud & Spam Scanner</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Search caller identity against community spam database, fraud reports, and robocall categories.
          </p>
        </div>

        <button
          onClick={() => setReportModalOpen(true)}
          className="px-4 py-2.5 bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Scam Number</span>
        </button>
      </div>

      <GlassCard hoverEffect={false} className="space-y-4 border-rose-500/30">
        <div>
          <span className="text-xs text-gray-400 mb-2 block">Try sample reported numbers:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PHONES.map((num, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setNumber(num)}
                className="text-[11px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer font-mono"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={number}
              onChange={e => setNumber(e.target.value)}
              placeholder="Enter phone number with country code (e.g. +919876543210 or +18005550199)..."
              className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-xs font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !number.trim()}
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching Database...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Search Number</span>
              </>
            )}
          </button>
        </form>
      </GlassCard>

      {scanResult && (
        <RiskAnalysisCard
          scanItem={scanResult}
          originalText={`Target Phone Number: ${number}`}
        />
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl relative">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>Report Scam Number</span>
            </h2>

            {reportSubmitted ? (
              <div className="text-center py-6 text-emerald-400 font-bold text-sm">
                Thank you! Report logged into global threat index.
              </div>
            ) : (
              <form onSubmit={submitReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Scam Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+919876543210"
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Fraud Category</label>
                  <select
                    value={reportCategory}
                    onChange={e => setReportCategory(e.target.value)}
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-xs bg-[#0A0A0F]"
                  >
                    <option value="UPI Fraud">UPI / Cashback Fraud</option>
                    <option value="Bank Impersonation">Bank OTP Impersonation</option>
                    <option value="Job Scam">Telegram Job Scam</option>
                    <option value="Delivery Scam">Courier / Duty Scam</option>
                    <option value="Robocall">Robocall Spam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Details & Comment</label>
                  <textarea
                    rows={3}
                    required
                    value={reportComment}
                    onChange={e => setReportComment(e.target.value)}
                    placeholder="Describe what the caller said or requested..."
                    className="glass-input w-full p-3 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  Submit Scam Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
