# 🛡️ ScamShield AI - Think Before You Trust

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-blue)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask%20Python%203-000000)](https://flask.palletsprojects.com/)

> **ScamShield AI** is an advanced, commercial-grade SaaS cybersecurity web application designed to protect everyday users from phishing emails, fraudulent UPI payment requests, Telegram job scams, typosquatted websites, malicious QR codes, and SMS fraud.

---

## 🌐 Deploy to Vercel (Frontend Static / SPA Deployment)

### Method 1: Import via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
2. Select your repository: `bharad07-cyber/ScamShield-AI`.
3. Set **Framework Preset**: `Vite`.
4. Set **Root Directory**: `frontend` (or leave default root directory).
5. Set **Build Command**: `npm run build`
6. Set **Output Directory**: `dist`
7. Click **Deploy**. Vercel will build and host your frontend web app!

---

## 🚀 Deploy to Render (1-Click Fullstack Deployment)

### Method 1: Automatic Blueprint (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/select-repo?type=blueprint) and select **Blueprints**.
2. Connect repository `bharad07-cyber/ScamShield-AI`.
3. Render will read `render.yaml` and automatically create two services:
   - **`scamshield-backend`** (Flask Python Web Service using `gunicorn app:app`).
   - **`scamshield-frontend`** (Static Site using React Vite output `frontend/dist`).
4. Add your environment variable `GEMINI_API_KEY` under backend settings.
5. Click **Apply**. Both your frontend and backend will be live!

### Method 2: Manual Render Services
- **Backend Web Service**:
  - Build Command: `pip install -r backend/requirements.txt`
  - Start Command: `cd backend && gunicorn app:app`
- **Frontend Static Site**:
  - Root Directory: `frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`
  - Add Rewrite Rule: `/*` -> `/index.html`

---

## ✨ Features & Threat Vectors Analyzed

1. **💬 Message Scanner (`/scan/message`)**: Analyzes SMS, WhatsApp, Telegram, Email, IG, Discord, and LinkedIn messages. Evaluates urgency triggers, financial coercion, emotional manipulation, and credential harvesting risks.
2. **🌐 Website & Domain Scanner (`/scan/website`)**: Evaluates target URLs, HTTPS & SSL certificate status, domain registration age, typosquatting/brand impersonation flags, and redirect chains.
3. **📧 Email Phishing Scanner (`/scan/email`)**: Audits email sender domain spoofing, subject line urgency, dangerous attachment extensions (`.exe`, `.iso`, `.vbs`), and credential harvest risk.
4. **📱 QR Code Scanner (`/scan/qr`)**: Decodes QR code payloads, detects fake UPI payment collect links (`upi://pay`), short URL expanders, and redirect targets.
5. **🖼️ Image OCR & Screenshot Scanner (`/scan/image`)**: Upload screenshots of WhatsApp chats, bank SMS alerts, or posters. Uses client-side Tesseract OCR + HTML5 Canvas image preprocessing (grayscale & contrast boost) to extract text and auto-detect QR codes.
6. **📞 Phone Number Fraud Scanner (`/scan/phone`)**: Looks up phone numbers against community spam databases, fraud report counts, and provides a "Report Scam Number" modal.
7. **🤖 AI Security Advisor Chat (`/chat`)**: ChatGPT-style interactive cybersecurity advisor for safety guidance and threat explanations.
8. **📊 Scan History & PDF Generator (`/history`)**: Filter, search, favorite, soft-delete/restore, and export commercial PDF Security Audit Reports (`jsPDF`).

---

## 🛠️ Local Development Setup

```bash
# Frontend (React + Vite)
cd frontend
npm install
npm run dev

# Backend (Flask Python API)
cd backend
pip install -r requirements.txt
python app.py
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
