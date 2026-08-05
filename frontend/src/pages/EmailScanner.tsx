import React, { useState } from 'react';
import { useScan } from '../context/ScanContext';
import { api } from '../services/api';
import { SAMPLE_EMAILS } from '../utils/sampleScams';
import type { ScanItem } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { RiskAnalysisCard } from '../components/ui/RiskAnalysisCard';
import {
  Mail,
  Zap,
  Sparkles,
  User
} from 'lucide-react';

export const EmailScanner: React.FC = () => {
  const { addScan } = useScan();
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanItem | null>(null);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!body.trim() && !subject.trim()) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await api.scanEmail(sender, subject, body);
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

  const loadSample = (sample: typeof SAMPLE_EMAILS[0]) => {
    setSender(sample.sender);
    setSubject(sample.subject);
    setBody(sample.body);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Mail className="w-7 h-7 text-amber-500" />
            <span>Email Phishing & Header Scanner</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Analyze email headers, sender domain mismatches, malicious attachments, and credential theft text.
          </p>
        </div>
      </div>

      <GlassCard hoverEffect={false} className="space-y-4 border-amber-500/30">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Try sample phishing emails:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_EMAILS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSample(s)}
                className="text-[11px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer truncate max-w-xs"
              >
                {s.subject}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleScan} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Sender Email / Header</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={sender}
                  onChange={e => setSender(e.target.value)}
                  placeholder="e.g. PayPal Support <support@paypal-security.org>"
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. URGENT: Account Suspension Alert"
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Body Content</label>
            <textarea
              rows={6}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Paste raw email body or header text..."
              className="glass-input w-full p-4 rounded-2xl text-xs font-sans placeholder-gray-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-mono">Full Header & Body Inspection</span>
            <button
              type="submit"
              disabled={loading || (!body.trim() && !subject.trim())}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Auditing Email...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Scan Email Threat</span>
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      {scanResult && (
        <RiskAnalysisCard
          scanItem={scanResult}
          originalText={`Sender: ${sender}\nSubject: ${subject}\n\n${body}`}
        />
      )}
    </div>
  );
};
