# 🛡️ ScamShield AI - Think Before You Trust

[![Live Web Application](https://img.shields.io/badge/Live_App-https%3A%2F%2Fscamshield--ai--cfij.onrender.com-00E5FF?style=for-the-badge&logo=render&logoColor=white)](https://scamshield-ai-cfij.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React 18](https://img.shields.io/badge/Frontend-React_18_%7C_TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind v4](https://img.shields.io/badge/Styling-Tailwind_v4_%7C_Glassmorphism-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Flask Python](https://img.shields.io/badge/Backend-Flask_Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://flask.palletsprojects.com/)
[![AI Engine](https://img.shields.io/badge/AI_Engine-Multi--Stage_Cybersecurity_Analyst-7C3AED?style=for-the-badge&logo=openai&logoColor=white)](https://deepmind.google/)

---

## 🌟 About ScamShield AI

**ScamShield AI** is an enterprise-grade SaaS cybersecurity web application engineered to protect everyday users and businesses against digital fraud. Every day millions of users fall victim to phishing emails, fake UPI payment QR traps, Telegram job scams, typosquatted brand websites, and coercive SMS alerts.

ScamShield AI features a **Multi-Stage Evidence Reasoning AI Engine** that performs deep semantic NLP parsing, entity extraction, psychological manipulation profiling, and evidence-grounded threat scoring to deliver transparent, evidence-backed security verdicts.

🌐 **Live Application URL**: [https://scamshield-ai-cfij.onrender.com](https://scamshield-ai-cfij.onrender.com)

---

## 🚀 Threat Vectors & Feature Capabilities

### 💬 Message Threat Scanner
- Scans text messages across SMS, WhatsApp, Telegram, Email, Instagram, Discord, and LinkedIn.
- Analyzes urgency cues, financial coercion, emotional manipulation, and credential harvesting risks.
- Highlights suspicious phrases with interactive tooltips and recommended action checklists.

### 🌐 Website & Domain Threat Scanner
- Evaluates target URLs for typosquatting and brand impersonation against top corporate brands (Levenshtein distance).
- Calculates domain registration age, verifies HTTPS & SSL status, and inspects redirect chains.

### 📧 Email Phishing Auditor
- Audits email headers for domain spoofing (e.g. `support@paypal-security-update.com` vs `@paypal.com`).
- Scans subject lines for coercive deadlines and flags dangerous executable attachment payloads (`.exe`, `.iso`, `.vbs`, `.scr`).

### 📱 QR Code & Payment Trap Scanner
- Decodes QR code payloads, detects fake UPI payment collect links (`upi://pay`), short URL expanders, and unverified payment gateways.
- Enforces the golden cybersecurity rule: *"Entering a UPI PIN is ONLY to send money, NEVER to receive money."*

### 🖼️ Image OCR & Screenshot Scanner
- Upload screenshots of WhatsApp chats, bank notices, or posters (PNG, JPG, WEBP).
- Preprocesses images on HTML5 Canvas (grayscale & contrast boost) for **Tesseract OCR** text extraction and automatic **QR code detection**.

### 📞 Phone Fraud Lookup
- Cross-references caller phone numbers against community spam databases, fraud report counts, and robocall categories.
- Includes an interactive submission modal allowing users to report scam numbers to the global threat index.

### 🤖 AI Security Advisor Chat
- ChatGPT-style conversational cybersecurity expert providing real-time safety guidance, scam explanations, and threat mitigation steps.

### 📊 Scan History & PDF Audit Reports
- Data grid featuring live search, vector filtering, risk sorting, favorite toggles, soft-delete/restore, and one-click **Commercial PDF Security Audit Report** generation (`jsPDF`).

---

## 🔬 Multi-Stage AI Reasoning Architecture

Unlike simple keyword matchers, **ScamShield AI** uses a 5-Stage Evidence Reasoning Engine:

- **Stage 1: Contextual Intent & Syntactic Analysis**: Parses sentence structures and coercive verb-object pairings (e.g. *"click link to verify"*, *"enter PIN to receive"*).
- **Stage 2: Entity Extractor**: Extracts URLs, domain extensions (`.xyz`, `.click`), UPI handles (`@ybl`, `@oksbi`), phone numbers, and OTP requests.
- **Stage 3: Social Engineering Profiling**: Profiles urgency, fear, greed, scarcity, authority impersonation, and fake payout traps.
- **Stage 4: Self-Validation Step (False Positive Guardrail)**: Evaluates *"Could this content be legitimate based on organizational standards?"* to eliminate false positives.
- **Stage 5: Evidence-Grounded Indicators & Confidence Threshold**: Dynamically calculates percentages for all threat indicators. If confidence falls below 70%, it clearly flags *"More evidence required"*.

---

## 📊 Cybersecurity Risk Analysis Tiers

| Score | Risk Level | Emoji | Action Required |
| :---: | :--- | :---: | :--- |
| **0 – 20** | **Safe** | 🟢 | Content appears legitimate. Follow standard security hygiene. |
| **21 – 40** | **Low Risk** | 🟡 | Low threat indicators. Verify sender identity via official channels. |
| **41 – 60** | **Suspicious** | 🟠 | Moderate threat cues detected. Do not click embedded links. |
| **61 – 80** | **High Risk** | 🔴 | High threat probability. Block sender and avoid entering credentials. |
| **81 – 100** | **Critical Scam** | 🚨 | Severe fraudulent scam attempt. Report immediately to Cyber Crime. |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), Framer Motion, Lucide Icons, Chart.js, `tesseract.js`, `jsqr`, `jsPDF`.
- **Backend**: Python 3.11, Flask, Flask-CORS, PyJWT, Gunicorn WSGI, Google Gemini API (`gemini-1.5-flash`), Pillow, Local Persistence Engine.
- **Design System**: Glassmorphism dark UI (`#09090B`), glowing neon risk indicators, Inter typography.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
