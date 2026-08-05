from flask import Blueprint, request, jsonify
from services.ai_service import AIService

chat_bp = Blueprint("chat", __name__)
ai_service = AIService()

@chat_bp.route("/message", methods=["POST"])
def send_chat_message():
    data = request.json or {}
    message = data.get("message", "").strip()
    history = data.get("history", [])

    if not message:
        return jsonify({"error": "Message text is required"}), 400

    reply = ai_service.chat_response(message, history)
    return jsonify({
        "status": "success",
        "reply": reply,
        "timestamp": "Just now"
    })
