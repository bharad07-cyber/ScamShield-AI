import React, { useState } from 'react';
import { useScan } from '../context/ScanContext';
import { api } from '../services/api';
import type { ScanItem } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { RiskAnalysisCard } from '../components/ui/RiskAnalysisCard';
import { processImageForOcrAndQr } from '../utils/imageProcessor';
import {
  Image as ImageIcon,
  Upload,
  Sparkles,
  AlertTriangle,
  QrCode,
  FileText
} from 'lucide-react';

export const ImageScanner: React.FC = () => {
  const { addScan } = useScan();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [scanResult, setScanResult] = useState<ScanItem | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [lowQualityWarning, setLowQualityWarning] = useState<string | null>(null);

  const sampleScamScreenshots = [
    {
      label: "HDFC Bank KYC Lock Screenshot",
      text: "ALERT: Your HDFC Bank Account No. XX3942 is locked due to non-KYC update. Click https://hdfc-kyc-update-verify.com/login immediately to prevent permanent block. Do not share OTP 892104 with anyone."
    },
    {
      label: "Telegram Part-Time Work Screenshot",
      text: "Telegram VIP Job Offer: Earn Rs 3,000/day by liking YouTube videos. Pay Rs 500 refundable registration fee to receive tasks."
    },
    {
      label: "Fake PhonePe Cashback QR Screenshot",
      text: "upi://pay?pa=refund-agent-9921@ybl&pn=PhonePeRefund&am=7500"
    }
  ];

  const processAndScanText = async (textToScan: string, isQr: boolean = false) => {
    setLoading(true);
    setScanResult(null);
    setLowQualityWarning(null);

    try {
      if (isQr || textToScan.startsWith('upi://') || textToScan.includes('pay')) {
        setLoadingStatus("Analyzing QR payment payload...");
        const res = await api.scanQrPayload(textToScan);
        if (res.scan) {
          setScanResult(res.scan);
          addScan(res.scan);
        }
      } else {
        setLoadingStatus("Running AI Neural Threat Engine...");
        const res = await api.scanMessage(textToScan, 'Screenshot OCR Analysis');
        if (res.scan) {
          setScanResult(res.scan);
          addScan(res.scan);
        }
      }
    } catch (err) {
      console.error("Image analysis error:", err);
      setLowQualityWarning("Analysis service error. Please try scanning again.");
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setScanResult(null);
    setLowQualityWarning(null);
    setExtractedText('');
    setQrPayload(null);
    setLoading(true);

    try {
      setLoadingStatus("Preprocessing image (Grayscale & Contrast boost)...");
      const prep = await processImageForOcrAndQr(file);

      setExtractedText(prep.extractedText);
      setQrPayload(prep.qrPayload);

      // Check if image has QR code payload or extracted text
      if (prep.qrPayload) {
        setLoadingStatus("QR Code detected! Analyzing target payment URL...");
        await processAndScanText(prep.qrPayload, true);
      } else if (prep.extractedText && prep.extractedText.trim().length > 8) {
        setLoadingStatus("Text extracted via OCR! Analyzing scam indicators...");
        await processAndScanText(prep.extractedText, false);
      } else {
        setLoading(false);
        setLowQualityWarning("Low quality image or no clear readable text/QR code found. Please upload a clearer screenshot.");
      }
    } catch (err) {
      console.error("Pipeline error:", err);
      setLoading(false);
      setLowQualityWarning("Unable to process image. Please try uploading a clearer image file.");
    }
  };

  const handleSampleClick = (sampleText: string) => {
    setPreviewUrl('');
    setExtractedText(sampleText);
    const isQr = sampleText.startsWith('upi://');
    if (isQr) setQrPayload(sampleText);
    else setQrPayload(null);
    processAndScanText(sampleText, isQr);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ImageIcon className="w-7 h-7 text-cyan-500" />
            <span>Image OCR & Screenshot Threat Scanner</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Upload screenshots of WhatsApp chats, Telegram job posters, bank SMS notices, or QR codes to extract text & evaluate scam risk.
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <GlassCard hoverEffect={false} className="space-y-4 border-cyan-500/30">
        <div className="border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-2xl p-8 text-center space-y-3 transition-all bg-white/5 relative">
          <Upload className="w-10 h-10 text-cyan-400 mx-auto" />
          <div>
            <p className="text-sm font-semibold text-white">Upload Screenshot or Image Document</p>
            <p className="text-xs text-gray-400 mt-0.5">Supports PNG, JPG, JPEG, WEBP formats up to 15MB</p>
          </div>

          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileUpload}
            className="hidden"
            id="ocr-file-input"
          />

          <label
            htmlFor="ocr-file-input"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer mt-2"
          >
            Select Image Screenshot
          </label>
        </div>

        {/* Sample Screenshots */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Or test with sample screenshot texts:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleScamScreenshots.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(s.text)}
                className="text-[11px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer font-sans"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Processing Indicator */}
        {loading && (
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-xs font-bold text-cyan-300">Processing Screenshot Image</p>
              <p className="text-[11px] text-gray-300 font-mono">{loadingStatus}</p>
            </div>
          </div>
        )}

        {/* Low Quality Warning */}
        {lowQualityWarning && (
          <div className="p-4 bg-amber-500/15 border border-amber-500/40 rounded-xl flex items-center gap-3 text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">{lowQualityWarning}</p>
          </div>
        )}

        {/* Extracted Text Preview */}
        {extractedText && (
          <div className="space-y-1 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Extracted OCR Text Preview</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">{extractedText.length} Characters Recognized</span>
            </div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl font-mono text-xs text-gray-200 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
              {extractedText}
            </div>
          </div>
        )}

        {/* QR Payload Preview */}
        {qrPayload && (
          <div className="space-y-1 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Decoded QR Code Destination Link</span>
            </div>
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl font-mono text-xs text-emerald-200">
              {qrPayload}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Identical Risk Analysis Card Result Display */}
      {scanResult && (
        <RiskAnalysisCard
          scanItem={scanResult}
          originalText={extractedText || scanResult.target}
          imagePreviewUrl={previewUrl}
        />
      )}
    </div>
  );
};
