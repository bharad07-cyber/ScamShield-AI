import React, { useState } from 'react';
import { useScan } from '../context/ScanContext';
import { api } from '../services/api';
import type { ScanItem } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { RiskAnalysisCard } from '../components/ui/RiskAnalysisCard';
import {
  QrCode,
  Upload,
  Zap,
  Sparkles
} from 'lucide-react';

export const QRScanner: React.FC = () => {
  const { addScan } = useScan();
  const [payload, setPayload] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanItem | null>(null);

  const presets = [
    { label: "UPI Refund QR (Scam)", value: "upi://pay?pa=refund-desk-9902@ybl&pn=PhonePeCashback&am=5000" },
    { label: "OLX Buyer Payment QR", value: "upi://pay?pa=army-cisf-buyer@oksbi&pn=OLXAdvance" },
    { label: "Shortened Redirect Link", value: "https://bit.ly/claim-free-gift-card-2026" }
  ];

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!payload.trim()) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await api.scanQrPayload(payload);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPayload("upi://pay?pa=refund-desk-9902@ybl&pn=PhonePeCashback&am=5000");
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <QrCode className="w-7 h-7 text-emerald-500" />
            <span>QR Code Destination & Payment Scanner</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Analyze destination URLs in QR codes, detect fake payment collect handles, and short URL redirects.
          </p>
        </div>
      </div>

      <GlassCard hoverEffect={false} className="space-y-4 border-emerald-500/30">
        <div className="border-2 border-dashed border-white/10 hover:border-emerald-500/50 rounded-2xl p-6 text-center space-y-2 transition-all bg-white/5">
          <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-xs font-semibold text-white">Upload QR Code Image or Screenshot</p>
          <p className="text-[10px] text-gray-400">Supports PNG, JPG, WEBP</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="qr-file-input"
          />
          <label
            htmlFor="qr-file-input"
            className="inline-block px-4 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-600/30 transition-all cursor-pointer mt-2"
          >
            Browse Image File
          </label>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Or test preset QR payloads:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPayload(p.value)}
                className="text-[11px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer font-mono truncate max-w-xs"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={payload}
            onChange={e => setPayload(e.target.value)}
            placeholder="Decoded QR payload string (e.g. upi://pay?pa=... or https://...)"
            className="glass-input flex-1 px-4 py-3 rounded-xl text-xs font-mono"
          />
          <button
            type="submit"
            disabled={loading || !payload.trim()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Scanning QR Target...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Scan QR Target</span>
              </>
            )}
          </button>
        </form>
      </GlassCard>

      {scanResult && (
        <RiskAnalysisCard
          scanItem={scanResult}
          originalText={`QR Payload Target: ${payload}`}
        />
      )}
    </div>
  );
};
