import os

# Production Gunicorn configuration for Render / Railway / Heroku
bind = f"0.0.0.0:{os.getenv('PORT', '5000')}"
workers = int(os.getenv("WEB_CONCURRENCY", "2"))
threads = int(os.getenv("PYTHON_GET_WORKER_THREADS", "2"))
timeout = 120
keepalive = 5
loglevel = os.getenv("LOG_LEVEL", "info")
accesslog = "-"
errorlog = "-"
