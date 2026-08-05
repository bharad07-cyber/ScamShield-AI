# 🛡️ ScamShield AI - Think Before You Trust

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4%20%7C%20Glassmorphism-06B6D4)](https://tailwindcss.com/)
[![Flask](https://img.shields.io/badge/Backend-Flask%20Python%203-000000)](https://flask.palletsprojects.com/)
[![AI Engine](https://img.shields.io/badge/AI-Multi--Stage%20Cybersecurity%20Analyst-7C3AED)](https://deepmind.google/)

> **ScamShield AI** is an advanced, commercial-grade SaaS cybersecurity web application designed to protect everyday users from phishing emails, fraudulent UPI payment requests, Telegram job scams, typosquatted websites, malicious QR codes, and SMS fraud.

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
9. **🚨 Real-Time Threat Feed (`/threat-feed`)**: Live attack ticker tracking active UPI frauds, Telegram job scams, and electric bill phishing campaigns.
10. **🛡️ Admin Command Center (`/admin`)**: System telemetry, total scans, detection accuracy %, and user moderation table.

---

## 🔬 Multi-Stage AI Reasoning Architecture

Unlike simple keyword matchers, **ScamShield AI** employs a 5-Stage Evidence Reasoning Engine:
- **Stage 1: Contextual Intent & Syntactic Analysis**: Evaluates full sentence context and coercive verb-object pairings.
- **Stage 2: Entity & Structural Extractor**: Extracts URLs, domain extensions (`.xyz`, `.top`), UPI handles (`@ybl`, `@oksbi`), phone numbers, and OTP requests.
- **Stage 3: Social Engineering Profiling**: Profiles urgency, fear, greed, scarcity, authority impersonation, and fake payouts.
- **Stage 4: Self-Validation Step (False Positive Guardrail)**: Evaluates *"Could this content be legitimate?"* to minimize false positives.
- **Stage 5: Evidence-Grounded Indicators & Confidence Threshold**: Dynamically calculates percentages for all threat indicators. If confidence falls below 70%, it clearly flags *"More evidence required"*.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+
- Python 3.10+

### 1. Frontend Setup (React + Vite + Tailwind v4)
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

### 2. Backend Setup (Flask Python API)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
- Starts API server on `http://localhost:5000`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), Framer Motion, Lucide Icons, Chart.js, `tesseract.js`, `jsqr`, `jsPDF`.
- **Backend**: Python, Flask, Flask-CORS, PyJWT, Google Gemini API (`gemini-1.5-flash`), Pillow, Local JSON Data Store.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
