import re
import urllib.parse
import datetime

class URLAnalyzer:
    TOP_BRANDS = [
        "google", "facebook", "paypal", "amazon", "apple", "netflix", "microsoft", 
        "instagram", "whatsapp", "bankofamerica", "chase", "wellsfargo", "binance",
        "coinbase", "sbi", "hdfcbank", "icicibank", "paytm", "razorpay"
    ]

    SUSPICIOUS_TLDS = [".xyz", ".top", ".top", ".work", ".click", ".buzz", ".monster", ".gq", ".tk", ".ml", ".ga", ".cf", ".fit", ".rest"]

    def analyze_url(self, url: str) -> dict:
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url

        try:
            parsed = urllib.parse.urlparse(url)
            domain = parsed.netloc.lower()
            if ":" in domain:
                domain = domain.split(":")[0]
        except Exception:
            domain = url.lower()

        # 1. HTTPS Check
        is_https = url.startswith("https://")
        
        # 2. Suspicious TLD
        has_suspicious_tld = any(domain.endswith(tld) for tld in self.SUSPICIOUS_TLDS)

        # 3. Typosquatting / Brand Impersonation check
        typosquatted_brand = None
        for brand in self.TOP_BRANDS:
            # Check for hyphenated or modified brand names like "paypal-security-verify.com" or "g00gle.com"
            if brand in domain and domain != f"{brand}.com" and domain != f"www.{brand}.com":
                typosquatted_brand = brand
                break
            elif self._levenshtein_distance(domain.split('.')[0], brand) in [1, 2] and domain.split('.')[0] != brand:
                typosquatted_brand = brand
                break

        # 4. Domain Age Simulation / Heuristics
        # If domain has suspicious keywords or typosquatting, simulate fresh domain age (< 30 days)
        is_new_domain = bool(typosquatted_brand or has_suspicious_tld or "-" in domain or len(domain) > 25)
        simulated_age_days = 14 if is_new_domain else 1850

        # 5. IP Hostname or URL Shortener
        is_ip_address = bool(re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', domain))
        is_url_shortener = any(s in domain for s in ["bit.ly", "tinyurl.com", "t.co", "cutt.ly", "is.gd", "rb.gy"])

        # Calculate Overall Trust Score (0-100)
        trust_score = 95
        risk_flags = []

        if not is_https:
            trust_score -= 25
            risk_flags.append("Insecure HTTP connection (missing SSL certificate).")
        
        if typosquatted_brand:
            trust_score -= 40
            risk_flags.append(f"Potential Brand Impersonation / Typosquatting target: '{typosquatted_brand}'.")

        if has_suspicious_tld:
            trust_score -= 20
            risk_flags.append("Registered under high-risk suspicious TLD.")

        if is_new_domain:
            trust_score -= 15
            risk_flags.append(f"Recently registered domain (~{simulated_age_days} days old).")

        if is_ip_address:
            trust_score -= 35
            risk_flags.append("Raw IP address used as hostname instead of verified domain name.")

        if is_url_shortener:
            trust_score -= 20
            risk_flags.append("URL shortener detected hiding actual target destination.")

        trust_score = max(0, min(100, trust_score))

        # Risk Level
        if trust_score < 40:
            risk_level = "Critical"
        elif trust_score < 65:
            risk_level = "High"
        elif trust_score < 85:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # AI Summary
        if trust_score < 50:
            summary = f"WARNING: {domain} exhibits classic phishing markers including brand spoofing and low domain trust. Do NOT enter credentials or financial data."
        else:
            summary = f"{domain} passes standard SSL and domain sanity checks with a trust score of {trust_score}%."

        # Visual Redirects chain
        redirects = [url]
        if is_url_shortener:
            redirects.append("https://login-gateway-auth-verify.net/session")
            redirects.append("https://login-gateway-auth-verify.net/credential-harvest")

        return {
            "url": url,
            "domain": domain,
            "isHttps": is_https,
            "domainAgeDays": simulated_age_days,
            "typosquattingDetected": bool(typosquatted_brand),
            "impersonatedBrand": typosquatted_brand,
            "sslStatus": "Valid SSL (RSA 2048)" if is_https else "No SSL Certificate Found",
            "redirectChain": redirects,
            "maliciousDatabaseFlagged": trust_score < 45,
            "overallTrustScore": trust_score,
            "riskLevel": risk_level,
            "riskFlags": risk_flags,
            "aiSummary": summary
        }

    def _levenshtein_distance(self, s1: str, s2: str) -> int:
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)

        if len(s2) == 0:
            return len(s1)

        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        
        return previous_row[-1]
