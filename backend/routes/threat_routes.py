from flask import Blueprint, request, jsonify
from services.firebase_service import DataStoreService

threat_bp = Blueprint("threat", __name__)
ds = DataStoreService()

@threat_bp.route("", methods=["GET"])
def get_threats():
    threats = ds.get_threats()
    return jsonify({"status": "success", "threats": threats})

@threat_bp.route("/report", methods=["POST"])
def report_threat():
    data = request.json or {}
    title = data.get("title")
    category = data.get("category", "General Scam")
    description = data.get("description", "")
    severity = data.get("severity", "High")
    mitigation = data.get("mitigation", "Avoid sharing credentials.")

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    new_threat = ds.add_threat({
        "title": title,
        "category": category,
        "description": description,
        "severity": severity,
        "mitigation": mitigation
    })

    return jsonify({"status": "success", "threat": new_threat})
