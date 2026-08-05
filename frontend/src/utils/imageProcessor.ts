import jsQR from 'jsqr';
import { createWorker } from 'tesseract.js';

export interface PreprocessingResult {
  extractedText: string;
  qrPayload: string | null;
  ocrConfidence: number;
  processedDataUrl: string;
}

/**
 * Preprocesses an image on HTML5 Canvas (Grayscale & Contrast Boost)
 * to maximize OCR accuracy for Tesseract.
 */
export async function processImageForOcrAndQr(file: File): Promise<PreprocessingResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        if (!ctx) {
          resolve({ extractedText: '', qrPayload: null, ocrConfidence: 0, processedDataUrl: img.src });
          return;
        }

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Check for QR code first on original image data
        let qrPayload: string | null = null;
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
          if (qrCode && qrCode.data) {
            qrPayload = qrCode.data;
          }
        } catch (err) {
          console.warn("QR detection error:", err);
        }

        // Apply Image Preprocessing (Grayscale & Contrast Enhancement)
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const contrast = 40; // Contrast boost factor
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

          for (let i = 0; i < data.length; i += 4) {
            // Grayscale conversion using luminance formula
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            // Contrast adjustment
            const contrastGray = factor * (gray - 128) + 128;
            const finalVal = Math.min(255, Math.max(0, contrastGray));

            data[i] = finalVal;     // Red
            data[i + 1] = finalVal; // Green
            data[i + 2] = finalVal; // Blue
          }

          ctx.putImageData(imageData, 0, 0);
        } catch (err) {
          console.warn("Canvas preprocessing warning:", err);
        }

        const processedDataUrl = canvas.toDataURL('image/png');

        // Run Tesseract OCR on preprocessed canvas image
        let extractedText = "";
        let ocrConfidence = 0;

        try {
          const worker = await createWorker('eng');
          const ret = await worker.recognize(processedDataUrl);
          extractedText = ret.data.text.trim();
          ocrConfidence = ret.data.confidence;
          await worker.terminate();
        } catch (ocrErr) {
          console.warn("Client Tesseract OCR error, using fallback parser:", ocrErr);
        }

        resolve({
          extractedText,
          qrPayload,
          ocrConfidence,
          processedDataUrl
        });
      };

      img.onerror = () => {
        resolve({ extractedText: '', qrPayload: null, ocrConfidence: 0, processedDataUrl: '' });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
