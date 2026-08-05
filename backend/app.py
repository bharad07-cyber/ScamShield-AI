import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config

from routes.auth_routes import auth_bp
from routes.scan_routes import scan_bp
from routes.chat_routes import chat_bp
from routes.history_routes import history_bp
from routes.threat_routes import threat_bp
from routes.admin_routes import admin_bp

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend/dist'))

app = Flask(__name__, static_folder=frontend_dist, static_url_path='')
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

@app.route("/api/health")
def health_check():
    return jsonify({
        "app": "ScamShield AI Backend API",
        "status": "healthy",
        "version": "1.0.0",
        "mode": "Production Ready"
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path.startswith('api/'):
        return jsonify({"error": "Endpoint not found"}), 404
        
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    elif os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    else:
        return jsonify({
            "app": "ScamShield AI Backend API",
            "status": "healthy",
            "version": "1.0.0",
            "mode": "Production Ready",
            "message": "Backend API is running live. Connect your Vercel or Render Frontend to start scanning."
        })

if __name__ == "__main__":
    print(f"Starting ScamShield AI Flask Backend on port {Config.PORT}...")
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)
