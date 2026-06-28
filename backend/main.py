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
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Header, status
from fastapi.responses import RedirectResponse

# Load .env file
load_dotenv()

# Read settings from .env
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "")
GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:8000/api/auth/github/callback")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


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


# =============================================================
# GitHub OAuth — Login (redirect to GitHub)
# =============================================================
@app.get("/api/auth/github/login", tags=["GitHub OAuth"])
def github_login():
    url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={GITHUB_REDIRECT_URI}"
        f"&scope=repo user"
    )
    return RedirectResponse(url=url)


# =============================================================
# GitHub OAuth — Callback (exchange code for token)
# =============================================================
@app.get("/api/auth/github/callback", tags=["GitHub OAuth"])
async def github_callback(code: str = Query(None), error: str = Query(None)):
    if error:
        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?error={error}")

    if not code:
        raise HTTPException(status_code=400, detail="Code is missing")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": GITHUB_REDIRECT_URI,
            },
            timeout=10.0
        )

    data = response.json()

    if "error" in data:
        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?error={data.get('error_description', data['error'])}")

    token = data.get("access_token")
    if not token:
        raise HTTPException(status_code=500, detail="No access token received")

    return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?token={token}")


# =============================================================
# GitHub OAuth — Get user's repositories
# =============================================================
@app.get("/api/auth/github/repos", tags=["GitHub OAuth"])
async def get_github_repos(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token. Use: Bearer <token>")

    token = authorization.split(" ")[1]

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user/repos?per_page=100&sort=updated",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github+json",
                "User-Agent": "Impact-IQ-Backend"
            },
            timeout=10.0
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch repos")

    repos = response.json()
    return [
        {
            "id": r.get("id"),
            "name": r.get("name"),
            "full_name": r.get("full_name"),
            "html_url": r.get("html_url"),
            "description": r.get("description"),
            "is_private": r.get("private"),
            "language": r.get("language"),
            "stars": r.get("stargazers_count"),
            "updated_at": r.get("updated_at"),
        }
        for r in repos
    ]
