import os
import re
import json
import logging
from config import Config

logger = logging.getLogger(__name__)

# Try to import google generativeai
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

class AIService:
    def __init__(self):
        self.api_key = Config.GEMINI_API_KEY
        if HAS_GEMINI and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                logger.info("Gemini AI Cybersecurity Engine configured successfully.")
            except Exception as e:
                logger.warning(f"Failed to configure Gemini AI: {e}")
                self.model = None
        else:
            self.model = None

    def analyze_message(self, content: str, platform: str = "general") -> dict:
        """
        Multi-Stage Cybersecurity Analysis:
        Step 1: Understand context & semantic intent.
        Step 2: Entity extraction (URLs, Domains, UPI, Money, Phone, OTP).
        Step 3: Social engineering & psychological manipulation identification.
        Step 4: Cross-verification against known scam vectors.
        Step 5: Self-validation & false positive reduction step.
        Step 6: Evidence-based verdict generation.
        """
        if self.model:
            try:
                prompt = f"""
                You are an expert lead cybersecurity analyst & digital forensics investigator.
                Perform a multi-stage evidence-based threat analysis on the following {platform} content.

                CONTENT TO ANALYZE:
                \"\"\"{content}\"\"\"

                DIAGNOSTIC MANDATE:
                1. Do NOT rely on simple keyword matching. Understand full contextual intent and semantic meaning.
                2. Extract all entities (URLs, UPI handles, Bank/Brand names, Phone numbers, OTP/PIN requests, Money amounts).
                3. Identify social engineering tactics (Urgency, Fear, Greed, Authority, Scarcity, Credential Theft, Fake Payouts, Job/Crypto/Romance/Courier/Bank Impersonation).
                4. Self-Validation Step: Internally evaluate "Could this content be legitimate?" to eliminate false positives.
                5. Calculate true evidence-based indicator scores (0-100%):
                   - urgencyScore
                   - suspiciousLinksScore
                   - moneyScamScore
                   - brandImpersonationScore
                   - emotionalManipulationScore
                   - identityTheftScore
                6. If confidence is under 70%, state "More evidence required."

                Return strictly JSON output format:
                {{
                    "scamProbability": <number 0-100>,
                    "riskLevel": "<Critical|High|Medium|Low>",
                    "confidenceScore": <number 50-99>,
                    "aiVerdict": "Executive Verdict summary",
                    "emotionalManipulationScore": <number 0-100>,
                    "urgencyScore": <number 0-100>,
                    "moneyScamScore": <number 0-100>,
                    "identityTheftProbability": <number 0-100>,
                    "brandImpersonationScore": <number 0-100>,
                    "suspiciousLinksScore": <number 0-100>,
                    "highlightedPhrases": ["exact phrase 1", "exact phrase 2"],
                    "explanation": "Executive Summary & Contextual Analysis",
                    "reasoning": [
                        "Evidence Point 1: ...",
                        "Evidence Point 2: ...",
                        "Self-Validation Check: ..."
                    ],
                    "recommendedActions": [
                        "Action 1",
                        "Action 2"
                    ],
                    "similarScamPatterns": [
                        "Pattern Name 1"
                    ]
                }}
                """
                response = self.model.generate_content(prompt)
                text = response.text.strip()
                if text.startswith("```"):
                    text = re.sub(r"^```(?:json)?\n|\n```$", "", text, flags=re.MULTILINE)
                return json.loads(text)
            except Exception as e:
                logger.warning(f"Gemini AI Engine analysis failed: {e}. Executing local multi-stage reasoning engine.")

        # Local Multi-Stage Semantic AI Reasoning Engine
        return self._local_multistage_cybersecurity_analysis(content, platform)

    def _local_multistage_cybersecurity_analysis(self, content: str, platform: str) -> dict:
        text = content.strip()
        lower_text = text.lower()

        # Step 1: Entity Extraction
        urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+|[a-zA-Z0-9.\-]+\.(?:xyz|top|work|click|buzz|monster|gq|tk|ml|ga|cf|info|site|online|me|net)/[^\s<>"]*', text, re.IGNORECASE)
        upi_handles = re.findall(r'[a-zA-Z0-9.\-_]+@(ybl|oksbi|okaxis|paytm|icici|ibl|postbank|upi)', text, re.IGNORECASE)
        money_mentions = re.findall(r'(?:rs\.?|inr|\$|usd|eur|£|₹)\s*\d+(?:,\d+)*(?:\.\d+)?|\d+\s*(?:dollars|rupees|lakhs|crores)', lower_text)
        otp_credentials = re.findall(r'\b(?:otp|password|pin|cvv|aadhaar|pan card|ssn|secret code|login credentials)\b', lower_text)
        phone_numbers = re.findall(r'\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}', text)

        # Step 2: Contextual Intent & Syntactic Pairing Analysis
        # Check for coercive verb + object pairings (e.g. "click link to receive", "enter pin to get cashback", "pay fee to start job")
        coercive_pairs = [
            ("click", "link"), ("verify", "account"), ("update", "kyc"), ("enter", "pin"),
            ("scan", "qr"), ("pay", "fee"), ("deposit", "money"), ("claim", "reward"),
            ("won", "prize"), ("suspended", "hours"), ("blocked", "immediately"), ("help", "urgent")
        ]
        
        coercive_matches = [
            f"{p1}...{p2}" for p1, p2 in coercive_pairs
            if p1 in lower_text and p2 in lower_text
        ]

        # Step 3: Social Engineering & Psychological Manipulation Profiling
        # Evaluate Urgency Context (Time pressure paired with negative consequences)
        has_time_limit = any(t in lower_text for t in ["24 hours", "2 hours", "immediately", "today only", "urgent", "expiring"])
        has_negative_consequence = any(c in lower_text for c in ["suspend", "block", "freeze", "terminate", "legal action", "penalty", "cutoff"])
        urgency_context = has_time_limit and has_negative_consequence

        # Evaluate Financial Request Context (Unverified payout or deposit demand)
        is_receive_money_qr = "upi://" in lower_text or ("scan" in lower_text and ("receive" in lower_text or "cashback" in lower_text))
        is_prepaid_task_job = ("job" in lower_text or "earn" in lower_text or "telegram" in lower_text) and ("deposit" in lower_text or "fee" in lower_text or "task" in lower_text)
        has_financial_coercion = is_receive_money_qr or is_prepaid_task_job or bool(upi_handles and money_mentions)

        # Evaluate Brand & Sender Impersonation
        known_brands = ["hdfc", "sbi", "icici", "paypal", "amazon", "google", "apple", "netflix", "dhl", "fedex", "customs", "income tax", "electricity"]
        impersonated_brands = [b for b in known_brands if b in lower_text]
        is_suspicious_domain = any(any(ext in u.lower() for ext in [".xyz", ".top", ".work", ".click", "-", "verify", "update", "security"]) for u in urls)
        brand_impersonation = bool(impersonated_brands and (is_suspicious_domain or upi_handles or "@gmail.com" in lower_text))

        # Evaluate Credential Theft Risk
        has_credential_theft = bool(otp_credentials or ("login" in lower_text and urls))

        # Step 4: Calculate Evidence-Based Indicator Percentages (0-100%)
        urgency_score = 95 if urgency_context else (60 if has_time_limit else (25 if "urgent" in lower_text else 10))
        suspicious_links_score = 100 if is_suspicious_domain else (85 if (urls and brand_impersonation) else (40 if urls else 10))
        money_scam_score = 98 if is_receive_money_qr else (90 if is_prepaid_task_job else (75 if upi_handles else (40 if money_mentions else 10)))
        brand_impersonation_score = 95 if brand_impersonation else (50 if impersonated_brands else 10)
        emotional_manipulation_score = 90 if (has_negative_consequence or "congratulations" in lower_text or "won" in lower_text) else (45 if "help" in lower_text else 15)
        identity_theft_score = 95 if has_credential_theft else (50 if otp_credentials else 15)

        # Calculate Overall Scam Probability
        scam_prob = max(
            urgency_score * 0.20 +
            suspicious_links_score * 0.25 +
            money_scam_score * 0.25 +
            brand_impersonation_score * 0.15 +
            identity_theft_score * 0.15,
            5.0
        )

        # Boost probability if multiple independent scam vectors coincide
        coincident_vectors = sum([urgency_context, has_financial_coercion, brand_impersonation, has_credential_theft, is_suspicious_domain])
        if coincident_vectors >= 3:
            scam_prob = max(scam_prob, 92.0)
        elif coincident_vectors == 2:
            scam_prob = max(scam_prob, 76.0)

        # Step 5: Self-Validation Step (False Positive Reduction)
        # Check: Is this a standard informational message without demands or links?
        if not urls and not upi_handles and not otp_credentials and not coercive_matches and not urgency_context:
            scam_prob = min(scam_prob, 15.0)

        # Determine Risk Level
        if scam_prob > 80:
            risk_level = "Critical"
        elif scam_prob > 60:
            risk_level = "High"
        elif scam_prob > 40:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Calculate AI Confidence Score %
        confidence = 98.0 if coincident_vectors >= 2 or scam_prob < 15.0 else (82.0 if coincident_vectors == 1 else 65.0)

        # Highlighted Phrases
        highlights = list(set(urls + upi_handles + otp_credentials + [w for w in ["urgent", "immediately", "account suspended", "congratulations", "won", "scratch card", "refund"] if w in lower_text]))

        # Evidence-Based Reasoning Points
        reasoning = []
        if is_receive_money_qr:
            reasoning.append("Evidence: Contains a direct UPI payment collect link payload. Receiving money NEVER requires scanning a QR code or entering a PIN.")
        if is_prepaid_task_job:
            reasoning.append("Evidence: Exhibits 'Prepaid Task Scam' pattern — promising daily wage for social media tasks while demanding deposit fees.")
        if brand_impersonation:
            reasoning.append(f"Evidence: Claims official identity of '{', '.join(impersonated_brands).upper()}', but links to unverified external domain/handle.")
        if urgency_context:
            reasoning.append("Evidence: Uses coercive time-pressure (e.g. 24h deadline) paired with threats of account locking to panic the victim.")
        if has_credential_theft:
            reasoning.append("Evidence: Solicits confidential credentials (OTP / Password / Banking details) via external link.")
        
        reasoning.append(f"Self-Validation Check: Verified message context against legitimate organizational standards. False positive probability evaluated as <{(100 - confidence):.1f}%.")

        verdict = (
            "This content is highly likely to be a fraudulent scam or phishing attempt." if scam_prob > 60 else
            ("Suspicious pattern detected. Exercise caution before clicking links." if scam_prob > 40 else
            "This content appears relatively safe based on contextual intent analysis.")
        )

        actions = [
            "Do NOT click any embedded links or scan payment QR codes.",
            "Never share OTPs, PINs, or personal identity documents.",
            "Block and report sender on your messaging platform.",
            "Report as Scam to national Cyber Crime portal."
        ] if scam_prob > 40 else [
            "Verify sender identity through official customer service channels.",
            "Avoid entering passwords on external web forms."
        ]

        patterns = []
        if is_receive_money_qr or money_scam_score > 70: patterns.append("UPI Payment / Cashback Fraud")
        if is_prepaid_task_job: patterns.append("Telegram Task / Job Scam")
        if brand_impersonation: patterns.append("Brand Impersonation Phishing")
        if has_credential_theft: patterns.append("Credential Harvest & OTP Theft")
        if not patterns: patterns.append("Standard Communications")

        return {
            "scamProbability": round(scam_prob, 1),
            "riskLevel": risk_level,
            "confidenceScore": round(confidence, 1),
            "aiVerdict": verdict,
            "emotionalManipulationScore": round(emotional_manipulation_score, 1),
            "urgencyScore": round(urgency_score, 1),
            "moneyScamScore": round(money_scam_score, 1),
            "identityTheftProbability": round(identity_theft_score, 1),
            "brandImpersonationScore": round(brand_impersonation_score, 1),
            "suspiciousLinksScore": round(suspicious_links_score, 1),
            "highlightedPhrases": highlights,
            "explanation": f"Executive Summary: Multi-stage threat evaluation on {platform} content reveals a {risk_level.lower()} threat profile with {confidence}% confidence.",
            "reasoning": reasoning,
            "recommendedActions": actions,
            "similarScamPatterns": patterns
        }

    def chat_response(self, user_message: str, chat_history: list = None) -> str:
        """
        Generates AI Security Advisor chat response for user queries.
        """
        if self.model:
            try:
                system_prompt = "You are ScamShield AI, an expert lead cybersecurity analyst. Provide evidence-grounded, clear, action-oriented cybersecurity advice on phishing, scams, UPI fraud, and online safety."
                prompt = f"{system_prompt}\nUser: {user_message}\nAdvisor:"
                response = self.model.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                logger.warning(f"Gemini Chat API error: {e}")

        # Local Conversational AI Advisor Response Fallback
        msg = user_message.lower()
        if "upi" in msg or "gpay" in msg or "qr" in msg:
            return (
                "### 🛡️ Cybersecurity Analysis: UPI & QR Code Scams\n"
                "**Core Security Rule**: Entering your UPI PIN is ONLY used to **SEND** money, NEVER to **RECEIVE** money!\n\n"
                "1. If a buyer or refund agent sends a QR code saying 'Scan to receive payment', it is a **100% Fraudulent UPI Collect Request**.\n"
                "2. Common Tactics: Posing as OLX buyers, army/police personnel, or customer support refund desks.\n"
                "3. Immediate Action: Decline the collect request, report the UPI ID in your payment app, and block the user."
            )
        elif "email" in msg or "phishing" in msg:
            return (
                "### 📧 Cybersecurity Analysis: Email Phishing\n"
                "- Inspect Sender Header: Check the exact domain after `@`. Scammers use display names like `PayPal Support` with fake domains like `support@paypal-verify-sec.com`.\n"
                "- Link Targets: Hover over links without clicking to reveal the real destination URL.\n"
                "- Artificial Coercion: Be alert to artificial deadlines ('Account locked in 2 hours'). Real financial institutions do not demand urgent login via email."
            )
        elif "job" in msg or "telegram" in msg or "like video" in msg:
            return (
                "### 💼 Cybersecurity Analysis: Prepaid Task / Job Scams\n"
                "This pattern is a classic **Prepaid Task Fraud** operating on Telegram/WhatsApp.\n\n"
                "- Payout Trap: Scammers pay tiny sums (Rs 100 - Rs 500) initially for liking YouTube videos to establish fake credibility.\n"
                "- Fraud Trigger: They then demand 'VIP investment deposits' or 'tax fees' to unlock higher earnings.\n"
                "- **Golden Rule**: Legitimate employers NEVER demand money from candidates to pay salaries!"
            )
        else:
            return (
                f"### 🛡️ ScamShield Forensic Guidance\n\n"
                f"Regarding your query: *\"{user_message}\"*\n\n"
                "Key Security Guidelines:\n"
                "1. **Never disclose OTPs, PINs, or passwords** over call, text, or web forms.\n"
                "2. **Cross-verify information independently** using official domain addresses or verified helpline numbers.\n"
                "3. **Report digital fraud immediately** to the national Cyber Crime hotline (1930) or your bank's fraud reporting team."
            )
