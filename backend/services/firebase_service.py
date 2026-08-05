import os
import json
import uuid
import datetime
from config import Config

class DataStoreService:
    def __init__(self):
        self.scans_path = os.path.join(Config.DATA_DIR, "scans.json")
        self.users_path = os.path.join(Config.DATA_DIR, "users.json")
        self.threats_path = os.path.join(Config.DATA_DIR, "threats.json")
        self._init_files()

    def _init_files(self):
        if not os.path.exists(self.scans_path):
            with open(self.scans_path, "w") as f:
                json.dump([], f)

        if not os.path.exists(self.users_path):
            initial_users = [
                {
                    "id": "usr_demo_1",
                    "email": "user@scamshield.ai",
                    "name": "Alex Johnson",
                    "role": "user",
                    "scansCount": 18,
                    "threatsFound": 6,
                    "joinedAt": "2026-07-15",
                    "status": "Active"
                },
                {
                    "id": "usr_admin_1",
                    "email": "admin@scamshield.ai",
                    "name": "Sarah Connor (Admin)",
                    "role": "admin",
                    "scansCount": 142,
                    "threatsFound": 49,
                    "joinedAt": "2026-06-01",
                    "status": "Active"
                }
            ]
            with open(self.users_path, "w") as f:
                json.dump(initial_users, f, indent=2)

        if not os.path.exists(self.threats_path):
            initial_threats = [
                {
                    "id": "th_1",
                    "title": "Fake UPI 'Receive Money' QR Code Fraud",
                    "category": "UPI & Payment Fraud",
                    "severity": "Critical",
                    "description": "Scammers sending QR codes claiming victims will receive money upon scanning and entering PIN.",
                    "affectedCount": 4200,
                    "reportedAt": "2026-08-05T10:30:00Z",
                    "status": "Active Threat",
                    "mitigation": "Never enter UPI PIN to receive money."
                },
                {
                    "id": "th_2",
                    "title": "Part-Time Telegram Video Liking Job Scam",
                    "category": "Employment Fraud",
                    "severity": "High",
                    "description": "Victims promised Rs 500/day for liking YouTube videos, then asked to deposit VIP investment fees.",
                    "affectedCount": 8900,
                    "reportedAt": "2026-08-04T16:15:00Z",
                    "status": "Active Threat",
                    "mitigation": "Legitimate employers never demand payment upfront."
                },
                {
                    "id": "th_3",
                    "title": "Fake Electricity Bill Power Cut Notice SMS",
                    "category": "Impersonation Scam",
                    "severity": "High",
                    "description": "SMS warning that electricity will be disconnected tonight unless victim calls fake helpline officer.",
                    "affectedCount": 6100,
                    "reportedAt": "2026-08-03T18:45:00Z",
                    "status": "Active Threat",
                    "mitigation": "Verify bill status on official utility portal only."
                }
            ]
            with open(self.threats_path, "w") as f:
                json.dump(initial_threats, f, indent=2)

    # Scans Operations
    def save_scan(self, scan_data: dict) -> dict:
        with open(self.scans_path, "r") as f:
            scans = json.load(f)

        scan_record = {
            "id": f"scn_{uuid.uuid4().hex[:8]}",
            "timestamp": datetime.datetime.now().isoformat(),
            "isFavorite": False,
            "isDeleted": False,
            **scan_data
        }
        scans.insert(0, scan_record)
        with open(self.scans_path, "w") as f:
            json.dump(scans, f, indent=2)

        return scan_record

    def get_scans(self, include_deleted=False) -> list:
        with open(self.scans_path, "r") as f:
            scans = json.load(f)
        if not include_deleted:
            return [s for s in scans if not s.get("isDeleted", False)]
        return scans

    def toggle_favorite(self, scan_id: str) -> bool:
        with open(self.scans_path, "r") as f:
            scans = json.load(f)
        found = False
        for s in scans:
            if s["id"] == scan_id:
                s["isFavorite"] = not s.get("isFavorite", False)
                found = True
                break
        if found:
            with open(self.scans_path, "w") as f:
                json.dump(scans, f, indent=2)
        return found

    def delete_scan(self, scan_id: str) -> bool:
        with open(self.scans_path, "r") as f:
            scans = json.load(f)
        found = False
        for s in scans:
            if s["id"] == scan_id:
                s["isDeleted"] = True
                found = True
                break
        if found:
            with open(self.scans_path, "w") as f:
                json.dump(scans, f, indent=2)
        return found

    def restore_scan(self, scan_id: str) -> bool:
        with open(self.scans_path, "r") as f:
            scans = json.load(f)
        found = False
        for s in scans:
            if s["id"] == scan_id:
                s["isDeleted"] = False
                found = True
                break
        if found:
            with open(self.scans_path, "w") as f:
                json.dump(scans, f, indent=2)
        return found

    # User & Admin Operations
    def get_users(self) -> list:
        with open(self.users_path, "r") as f:
            return json.load(f)

    def get_threats(self) -> list:
        with open(self.threats_path, "r") as f:
            return json.load(f)

    def add_threat(self, threat_data: dict) -> dict:
        with open(self.threats_path, "r") as f:
            threats = json.load(f)
        record = {
            "id": f"th_{uuid.uuid4().hex[:6]}",
            "reportedAt": datetime.datetime.now().isoformat(),
            "status": "Active Threat",
            "affectedCount": 1,
            **threat_data
        }
        threats.insert(0, record)
        with open(self.threats_path, "w") as f:
            json.dump(threats, f, indent=2)
        return record
