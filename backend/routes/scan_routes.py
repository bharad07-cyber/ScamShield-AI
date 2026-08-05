from flask import Blueprint, request, jsonify
from services.ai_service import AIService
from services.url_analyzer import URLAnalyzer
from services.email_analyzer import EmailAnalyzer
from services.phone_analyzer import PhoneAnalyzer
from services.ocr_service import OCRService
from services.firebase_service import DataStoreService

scan_bp = Blueprint("scan", __name__)

ai_service = AIService()
url_analyzer = URLAnalyzer()
email_analyzer = EmailAnalyzer()
phone_analyzer = PhoneAnalyzer()
ocr_service = OCRService()
ds = DataStoreService()

@scan_bp.route("/message", methods=["POST"])
def scan_message():
    data = request.json or {}
    content = data.get("content", "").strip()
    platform = data.get("platform", "general")

    if not content:
        return jsonify({"error": "Message content is required"}), 400

    result = ai_service.analyze_message(content, platform)
    scan_entry = ds.save_scan({
        "type": "Message",
        "target": content[:60] + "..." if len(content) > 60 else content,
        "platform": platform,
        "content": content,
        "result": result,
        "riskLevel": result["riskLevel"],
        "scamProbability": result["scamProbability"]
    })

    return jsonify({"status": "success", "scan": scan_entry})

@scan_bp.route("/url", methods=["POST"])
def scan_url():
    data = request.json or {}
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "URL is required"}), 400

    result = url_analyzer.analyze_url(url)
    scan_entry = ds.save_scan({
        "type": "Website",
        "target": url,
        "url": url,
        "result": result,
        "riskLevel": result["riskLevel"],
        "scamProbability": 100 - result["overallTrustScore"]
    })

    return jsonify({"status": "success", "scan": scan_entry})

@scan_bp.route("/email", methods=["POST"])
def scan_email():
    data = request.json or {}
    sender = data.get("sender", "").strip()
    subject = data.get("subject", "").strip()
    body = data.get("body", "").strip()
    attachments = data.get("attachments", [])

    if not body and not subject:
        return jsonify({"error": "Subject or email body is required"}), 400

    result = email_analyzer.analyze_email(sender, subject, body, attachments)
    scan_entry = ds.save_scan({
        "type": "Email",
        "target": f"{subject} ({sender})",
        "sender": sender,
        "subject": subject,
        "result": result,
        "riskLevel": result["riskLevel"],
        "scamProbability": result["phishingScore"]
    })

    return jsonify({"status": "success", "scan": scan_entry})

@scan_bp.route("/qr", methods=["POST"])
def scan_qr():
    data = request.json or {}
    payload = data.get("payload", "").strip()

    if not payload:
        return jsonify({"error": "QR decoded content payload required"}), 400

    # Analyze QR payload if it's a URL or payment scheme (e.g. upi://pay)
    if payload.startswith("upi://") or "pay" in payload.lower():
        result = {
            "payload": payload,
            "targetType": "UPI Deep Link Payment",
            "isPaymentLink": True,
            "scamProbability": 88.5,
            "riskLevel": "Critical",
            "explanation": "Dangerous QR Code containing direct payment request link. Scanning will trigger instant money deduction if PIN is entered.",
            "suspiciousFactors": ["Requests direct transfer without product invoice", "Unregistered individual VPA handle"],
            "recommendation": "DO NOT enter UPI PIN to receive money!"
        }
    else:
        url_res = url_analyzer.analyze_url(payload)
        result = {
            "payload": payload,
            "targetType": "Website Link",
            "isPaymentLink": False,
            "scamProbability": 100 - url_res["overallTrustScore"],
            "riskLevel": url_res["riskLevel"],
            "explanation": url_res["aiSummary"],
            "suspiciousFactors": url_res["riskFlags"],
            "recommendation": "Do not enter login credentials on unverified destination site."
        }

    scan_entry = ds.save_scan({
        "type": "QR Code",
        "target": payload,
        "result": result,
        "riskLevel": result["riskLevel"],
        "scamProbability": result["scamProbability"]
    })

    return jsonify({"status": "success", "scan": scan_entry})

@scan_bp.route("/image", methods=["POST"])
def scan_image():
    file = request.files.get("file")
    text_content = ""
    if file:
        img_bytes = file.read()
        text_content = ocr_service.extract_text_from_bytes(img_bytes)
    else:
        data = request.json or {}
        text_content = data.get("text", "")

    if not text_content:
        return jsonify({"error": "Failed to extract text from image"}), 400

    result = ai_service.analyze_message(text_content, platform="Image OCR Screenshot")
    scan_entry = ds.save_scan({
        "type": "Image",
        "target": f"Screenshot: {text_content[:40]}...",
        "extractedText": text_content,
        "result": result,
        "riskLevel": result["riskLevel"],
        "scamProbability": result["scamProbability"]
    })

    return jsonify({"status": "success", "scan": scan_entry, "extractedText": text_content})

@scan_bp.route("/phone", methods=["POST"])
def scan_phone():
    data = request.json or {}
    number = data.get("number", "").strip()

    if not number:
        return jsonify({"error": "Phone number is required"}), 400

    result = phone_analyzer.analyze_phone(number)
    scam_prob = 100 - result["communityTrustScore"]

    scan_entry = ds.save_scan({
        "type": "Phone",
        "target": number,
        "number": number,
        "result": result,
        "riskLevel": result["riskLevel"],
        "scamProbability": scam_prob
    })

    return jsonify({"status": "success", "scan": scan_entry})

@scan_bp.route("/phone/report", methods=["POST"])
def report_phone():
    data = request.json or {}
    number = data.get("number")
    category = data.get("category", "General Fraud")
    comment = data.get("comment", "")

    if not number:
        return jsonify({"error": "Phone number is required"}), 400

    updated = phone_analyzer.report_phone(number, category, comment)
    return jsonify({"status": "success", "phone": updated})
