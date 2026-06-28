import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # App settings
    APP_NAME = "Impact-IQ API"
    VERSION = "1.0.0"
    DEBUG = os.getenv("DEBUG", "True") == "True"

    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./impact_iq.db")

    # GitHub OAuth
    GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "")
    GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:8000/api/auth/github/callback")

    # Frontend
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

settings = Settings()
