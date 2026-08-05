import jwt
import datetime
from flask import Blueprint, request, jsonify
from config import Config

auth_bp = Blueprint("auth", __name__)

def generate_token(user_data):
    payload = {
        "id": user_data.get("id"),
        "email": user_data.get("email"),
        "name": user_data.get("name"),
        "role": user_data.get("role", "user"),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Role determination (admin test login or standard user)
    role = "admin" if "admin" in email else "user"
    name = email.split("@")[0].capitalize().replace(".", " ")

    user = {
        "id": f"usr_{hash(email) % 10000}",
        "email": email,
        "name": name,
        "role": role,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}"
    }

    token = generate_token(user)
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user
    })

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    name = data.get("name", "").strip()
    password = data.get("password", "")

    if not email or not password or not name:
        return jsonify({"error": "Name, email and password are required"}), 400

    user = {
        "id": f"usr_{hash(email) % 10000}",
        "email": email,
        "name": name,
        "role": "user",
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}"
    }

    token = generate_token(user)
    return jsonify({
        "message": "Account created successfully",
        "token": token,
        "user": user
    })

@auth_bp.route("/google", methods=["POST"])
def google_login():
    data = request.json or {}
    email = data.get("email", "google.user@scamshield.ai")
    name = data.get("name", "Google User")

    user = {
        "id": f"usr_g_{hash(email) % 10000}",
        "email": email,
        "name": name,
        "role": "user",
        "avatar": data.get("picture", f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}")
    }

    token = generate_token(user)
    return jsonify({
        "message": "Google Login successful",
        "token": token,
        "user": user
    })

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json or {}
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    return jsonify({
        "message": f"Password reset instructions sent to {email}"
    })
