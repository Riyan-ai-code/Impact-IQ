# CORS Middleware Configuration
# Configures CORS dynamically for Localhost, Vercel, Render, and AWS deployments

import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app: FastAPI):
    """Add dynamic CORS middleware to the FastAPI app."""
    # Origins to always permit for local development
    default_origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    # Explicit frontend URL from env
    frontend_url = os.getenv("FRONTEND_URL", "").strip()
    if frontend_url and frontend_url not in default_origins:
        default_origins.append(frontend_url)

    # Additional comma-separated allowed origins from env
    allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "").strip()
    if allowed_origins_env:
        if allowed_origins_env == "*":
            app.add_middleware(
                CORSMiddleware,
                allow_origins=["*"],
                allow_credentials=False,
                allow_methods=["*"],
                allow_headers=["*"],
            )
            return
        
        for origin in allowed_origins_env.split(","):
            cleaned = origin.strip().rstrip("/")
            if cleaned and cleaned not in default_origins:
                default_origins.append(cleaned)

    # Regex to support Vercel preview domains, Render apps, and AWS domains
    origin_regex = os.getenv(
        "CORS_ALLOW_ORIGIN_REGEX",
        r"^https://([a-zA-Z0-9_-]+\.)?(vercel\.app|onrender\.com|awsapprunner\.com|elasticbeanstalk\.com|amplifyapp\.com)$"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=default_origins,
        allow_origin_regex=origin_regex,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"]
    )

