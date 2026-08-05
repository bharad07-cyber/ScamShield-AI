import re

class EmailAnalyzer:
    SUSPICIOUS_EXTENSIONS = [".exe", ".scr", ".iso", ".vbs", ".bat", ".cmd", ".zip", ".xlsm", ".docm"]
    CREDENTIAL_PHISHING_KEYWORDS = [
        "reset password", "verify account", "security alert", "unauthorized login", 
        "billing error", "account lock", "update payment details", "tax refund", "mailbox full"
    ]

    def analyze_email(self, sender: str, subject: str, body: str, attachments: list = None) -> dict:
        sender_clean = sender.strip().lower()
        subject_clean = subject.strip().lower()
        body_clean = body.strip().lower()
        attachments = attachments or []

        # Extract domain from sender
        domain_match = re.search(r'@([a-zA-Z0-9.\-]+)', sender_clean)
        sender_domain = domain_match.group(1) if domain_match else "unknown"

        # 1. Spoofing & Fake Sender detection
        is_free_provider_spoof = False
        display_name_match = re.search(r'^"?([^"<]+)"?\s*<', sender)
        if display_name_match:
            display_name = display_name_match.group(1).lower()
            if any(brand in display_name for brand in ["paypal", "bank", "amazon", "google", "netflix", "apple"]) and ("gmail.com" in sender_domain or "yahoo.com" in sender_domain or "hotmail.com" in sender_domain):
                is_free_provider_spoof = True

        # 2. Suspicious Attachments Check
        flagged_attachments = []
        for att in attachments:
            name = att.get("name", "").lower() if isinstance(att, dict) else str(att).lower()
            if any(name.endswith(ext) for ext in self.SUSPICIOUS_EXTENSIONS):
                flagged_attachments.append(name)

        # 3. Phishing Keywords & Credential Theft Score
        found_phishing_kw = [kw for kw in self.CREDENTIAL_PHISHING_KEYWORDS if kw in subject_clean or kw in body_clean]
        
        # 4. Look for links matching external suspicious domains
        links = re.findall(r'https?://[^\s<>"]+', body)

        # Calculate Threat Metrics
        phishing_score = min(
            (40 if is_free_provider_spoof else 0) +
            (35 if flagged_attachments else 0) +
            (len(found_phishing_kw) * 15) +
            (20 if len(links) > 0 else 0),
            99
        )

        if phishing_score >= 70:
            risk_level = "Critical"
        elif phishing_score >= 45:
            risk_level = "High"
        elif phishing_score >= 20:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Email Section Breakdown for frontend UI rendering
        sections = [
            {
                "title": "Header & Sender Verification",
                "status": "Warning" if is_free_provider_spoof else "Pass",
                "details": f"Sender domain: {sender_domain}. " + ("CRITICAL: Display name claims official corporate identity, but email originates from free webmail provider!" if is_free_provider_spoof else "Sender domain format appears valid.")
            },
            {
                "title": "Subject Line Threat Scan",
                "status": "Warning" if any(kw in subject_clean for kw in ["urgent", "alert", "verify", "suspended"]) else "Pass",
                "details": f"Subject: '{subject}'. " + ("Urgency triggers detected in subject line." if any(kw in subject_clean for kw in ["urgent", "alert", "verify"]) else "Subject line appears standard.")
            },
            {
                "title": "Attachment Security Audit",
                "status": "Critical" if flagged_attachments else "Pass",
                "details": f"Found {len(flagged_attachments)} executable or archived attachment payload(s): {', '.join(flagged_attachments)}" if flagged_attachments else "No dangerous executable attachment formats detected."
            },
            {
                "title": "Body & Link Credential Harvest Risk",
                "status": "High" if found_phishing_kw else "Pass",
                "details": f"Detected {len(found_phishing_kw)} credential theft trigger phrases ({', '.join(found_phishing_kw[:3])})." if found_phishing_kw else "No overt credential harvest phrases found."
            }
        ]

        return {
            "sender": sender,
            "senderDomain": sender_domain,
            "subject": subject,
            "isSpoofed": is_free_provider_spoof,
            "flaggedAttachments": flagged_attachments,
            "phishingScore": phishing_score,
            "riskLevel": risk_level,
            "foundPhishingKeywords": found_phishing_kw,
            "emailSections": sections,
            "recommendation": "DO NOT reply, click links, or open attachments. Report email to IT Security." if phishing_score > 40 else "Safe to review, but remain vigilant for unexpected login requests."
        }
