from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

from routes.auth_routes import auth_bp
from routes.scan_routes import scan_bp
from routes.chat_routes import chat_bp
from routes.history_routes import history_bp
from routes.threat_routes import threat_bp
from routes.admin_routes import admin_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend integration
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register API Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(scan_bp, url_prefix="/api/scan")
app.register_blueprint(chat_bp, url_prefix="/api/chat")
app.register_blueprint(history_bp, url_prefix="/api/history")
app.register_blueprint(threat_bp, url_prefix="/api/threats")
app.register_blueprint(admin_bp, url_prefix="/api/admin")

@app.route("/")
@app.route("/api/health")
def health_check():
    return jsonify({
        "app": "ScamShield AI Backend API",
        "status": "healthy",
        "version": "1.0.0",
        "mode": "Production Ready"
    })

if __name__ == "__main__":
    print(f"Starting ScamShield AI Flask Backend on port {Config.PORT}...")
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)
