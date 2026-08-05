import os
import json
import random
from config import Config

class PhoneAnalyzer:
    def __init__(self):
        self.db_path = os.path.join(Config.DATA_DIR, "phone_database.json")
        self._ensure_db()

    def _ensure_db(self):
        if not os.path.exists(self.db_path):
            sample_data = {
                "+18005550199": {
                    "number": "+18005550199",
                    "carrier": "T-Mobile USA",
                    "location": "New York, USA",
                    "spamReports": 1420,
                    "fraudReports": 890,
                    "category": "Fake Bank Verification / OTP Scam",
                    "communityTrustScore": 12,
                    "riskLevel": "Critical",
                    "recentReports": [
                        {"date": "2026-08-04", "comment": "Called claiming to be Chase fraud department asking for my OTP.", "tag": "Bank Fraud"},
                        {"date": "2026-08-02", "comment": "Automated voice message about account lock.", "tag": "Robocall"}
                    ]
                },
                "+919876543210": {
                    "number": "+919876543210",
                    "carrier": "Bharti Airtel",
                    "location": "New Delhi, India",
                    "spamReports": 2340,
                    "fraudReports": 1890,
                    "category": "Fake UPI Cashback / Army Officer Scam",
                    "communityTrustScore": 8,
                    "riskLevel": "Critical",
                    "recentReports": [
                        {"date": "2026-08-05", "comment": "Sent fake QR code on WhatsApp for OLX item purchase.", "tag": "UPI Fraud"},
                        {"date": "2026-08-03", "comment": "Posed as CISF officer demanding advance delivery fee.", "tag": "Impersonation"}
                    ]
                }
            }
            with open(self.db_path, "w") as f:
                json.dump(sample_data, f, indent=2)

    def analyze_phone(self, phone_number: str) -> dict:
        clean_num = phone_number.strip().replace(" ", "").replace("-", "")
        
        with open(self.db_path, "r") as f:
            db = json.load(f)

        if clean_num in db:
            return db[clean_num]

        # Dynamic heuristic generation for unregistered numbers
        digits_hash = sum(ord(c) for c in clean_num)
        has_suspicious_pattern = digits_hash % 3 == 0

        spam_count = (digits_hash * 7) % 400 if has_suspicious_pattern else (digits_hash % 5)
        fraud_count = (spam_count * 3) // 4
        trust_score = max(5, 100 - (spam_count // 3))

        if trust_score < 30:
            risk_level = "Critical"
            category = "Robocall / Financial Phishing"
        elif trust_score < 60:
            risk_level = "High"
            category = "Telemarketing / Unsolicited Lead"
        elif trust_score < 80:
            risk_level = "Medium"
            category = "Unknown Commercial Caller"
        else:
            risk_level = "Low"
            category = "Verified / Safe Contact"

        result = {
            "number": phone_number,
            "carrier": "Global Telecom Network",
            "location": "International Gateway",
            "spamReports": spam_count,
            "fraudReports": fraud_count,
            "category": category,
            "communityTrustScore": trust_score,
            "riskLevel": risk_level,
            "recentReports": [
                {"date": "2026-08-01", "comment": "Unsolicited promotional calls received.", "tag": "Spam Caller"}
            ] if spam_count > 10 else []
        }
        return result

    def report_phone(self, phone_number: str, category: str, comment: str) -> dict:
        clean_num = phone_number.strip().replace(" ", "").replace("-", "")
        with open(self.db_path, "r") as f:
            db = json.load(f)

        entry = db.get(clean_num, {
            "number": phone_number,
            "carrier": "Telecom Provider",
            "location": "Global",
            "spamReports": 0,
            "fraudReports": 0,
            "category": category,
            "communityTrustScore": 80,
            "riskLevel": "Medium",
            "recentReports": []
        })

        entry["spamReports"] += 1
        entry["fraudReports"] += 1
        entry["communityTrustScore"] = max(0, entry["communityTrustScore"] - 15)
        if entry["communityTrustScore"] < 35:
            entry["riskLevel"] = "Critical"
        entry["recentReports"].insert(0, {"date": "2026-08-05", "comment": comment, "tag": category})

        db[clean_num] = entry
        with open(self.db_path, "w") as f:
            json.dump(db, f, indent=2)

        return entry
