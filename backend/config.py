import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "scamshield-super-secret-jwt-key-2026")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "")
    DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("FLASK_ENV") == "development"

# Ensure data directory exists for offline persistence
os.makedirs(Config.DATA_DIR, exist_ok=True)
