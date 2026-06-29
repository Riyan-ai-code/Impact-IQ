# =============================================================
# Impact-IQ Backend — Main Application Entry Point
# =============================================================
#
# HOW TO RUN:
#   1. cd backend
#   2. .\venv\Scripts\Activate.ps1
#   3. fastapi dev main.py
#
# Server:  http://localhost:8000
# Docs:    http://localhost:8000/docs
# =============================================================

import os
from dotenv import load_dotenv
from fastapi import FastAPI

# Load .env file
load_dotenv(override=True)

# ---- Create the app ----
app = FastAPI(
    title="Impact-IQ API",
    version="1.0.0",
    description="Backend API for Impact-IQ"
)

# ---- CORS (allow frontend to talk to backend) ----
from middleware.cors_middleware import setup_cors
setup_cors(app)

# ---- Register all API routers ----
from api.auth import router as auth_router
from api.dashboard import router as dashboard_router
from api.projects import router as projects_router
from api.repositories import router as repositories_router
from api.analysis import router as analysis_router
from api.reports import router as reports_router
from api.github import router as github_router
from api.integrations import router as integrations_router
from api.notifications import router as notifications_router
from api.teams import router as teams_router
from api.settings import router as settings_router

app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(projects_router)
app.include_router(repositories_router)
app.include_router(analysis_router)
app.include_router(reports_router)
app.include_router(github_router)
app.include_router(integrations_router)
app.include_router(notifications_router)
app.include_router(teams_router)
app.include_router(settings_router)

# =============================================================
# Health Check
# =============================================================
@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "message": "Impact-IQ API is running!"}
