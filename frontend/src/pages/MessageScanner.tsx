import React, { useState } from 'react';
import { useScan } from '../context/ScanContext';
import { api } from '../services/api';
import { SAMPLE_MESSAGES } from '../utils/sampleScams';
import type { ScanItem } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { RiskAnalysisCard } from '../components/ui/RiskAnalysisCard';
import {
  MessageSquareWarning,
  Trash2,
  Sparkles,
  Zap
} from 'lucide-react';

export const MessageScanner: React.FC = () => {
  const { addScan } = useScan();
  const [platform, setPlatform] = useState('WhatsApp');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanItem | null>(null);

  const platforms = ['SMS', 'WhatsApp', 'Telegram', 'Email', 'Instagram', 'Discord', 'LinkedIn'];

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await api.scanMessage(content, platform);
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

  const loadSample = (sample: typeof SAMPLE_MESSAGES[0]) => {
    setPlatform(sample.platform);
    setContent(sample.text);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <MessageSquareWarning className="w-7 h-7 text-blue-500" />
            <span>Message Scam Scanner</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Detect UPI fraud, emotional manipulation, urgency triggers, and identity theft risk in text messages.
          </p>
        </div>
      </div>

      {/* Input Card */}
      <GlassCard hoverEffect={false} className="space-y-4 border-blue-500/30">
        {/* Platform Pills */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">Select Messaging Platform</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  platform === p
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Sample Preset Presets */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Try sample scam messages:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_MESSAGES.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSample(s)}
                className="text-[11px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <form onSubmit={handleScan} className="space-y-3">
          <div className="relative">
            <textarea
              rows={5}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste SMS, WhatsApp message, Telegram job offer, or email text here..."
              className="glass-input w-full p-4 rounded-2xl text-sm font-sans placeholder-gray-500"
            />
            {content && (
              <button
                type="button"
                onClick={() => { setContent(''); setScanResult(null); }}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-400 p-1"
                title="Clear text"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-mono">{content.length} characters</span>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Threat Vector...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Analyze Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Identical Risk Analysis Card Result Display */}
      {scanResult && (
        <RiskAnalysisCard
          scanItem={scanResult}
          originalText={content}
        />
      )}
    </div>
  );
};
