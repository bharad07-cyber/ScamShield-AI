import React, { useState } from 'react';
import { useScan } from '../context/ScanContext';
import { api } from '../services/api';
import { SAMPLE_URLS } from '../utils/sampleScams';
import type { ScanItem } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { RiskAnalysisCard } from '../components/ui/RiskAnalysisCard';
import {
  Globe,
  Zap
} from 'lucide-react';

export const WebsiteScanner: React.FC = () => {
  const { addScan } = useScan();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanItem | null>(null);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await api.scanUrl(url);
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

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-purple-500" />
            <span>Website & Domain Threat Scanner</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Detect typosquatting, brand impersonation, SSL errors, recent domain registration, and redirect hops.
          </p>
        </div>
      </div>

      <GlassCard hoverEffect={false} className="space-y-4 border-purple-500/30">
        <div>
          <span className="text-xs text-gray-400 mb-2 block">Sample Dangerous URLs:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS.map((sampleUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrl(sampleUrl)}
                className="text-[11px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer font-mono truncate max-w-xs"
              >
                {sampleUrl}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Paste website URL (e.g. https://amaz0n-security-login.xyz)..."
              className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Scanning Domain...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Scan Website</span>
              </>
            )}
          </button>
        </form>
      </GlassCard>

      {scanResult && (
        <RiskAnalysisCard
          scanItem={scanResult}
          originalText={`Website URL Target: ${url}`}
        />
      )}
    </div>
  );
};
