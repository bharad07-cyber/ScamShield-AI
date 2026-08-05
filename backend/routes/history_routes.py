from flask import Blueprint, request, jsonify
from services.firebase_service import DataStoreService

history_bp = Blueprint("history", __name__)
ds = DataStoreService()

@history_bp.route("", methods=["GET"])
def get_history():
    include_deleted = request.args.get("include_deleted", "false").lower() == "true"
    scans = ds.get_scans(include_deleted=include_deleted)
    return jsonify({"status": "success", "scans": scans})

@history_bp.route("/favorite/<scan_id>", methods=["POST"])
def toggle_favorite(scan_id):
    success = ds.toggle_favorite(scan_id)
    if success:
        return jsonify({"status": "success", "message": "Favorite status updated"})
    return jsonify({"error": "Scan not found"}), 404

@history_bp.route("/<scan_id>", methods=["DELETE"])
def delete_scan(scan_id):
    success = ds.delete_scan(scan_id)
    if success:
        return jsonify({"status": "success", "message": "Scan moved to trash"})
    return jsonify({"error": "Scan not found"}), 404

@history_bp.route("/restore/<scan_id>", methods=["POST"])
def restore_scan(scan_id):
    success = ds.restore_scan(scan_id)
    if success:
        return jsonify({"status": "success", "message": "Scan restored"})
    return jsonify({"error": "Scan not found"}), 404
