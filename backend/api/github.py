# GitHub API Routes
from fastapi import APIRouter

router = APIRouter(prefix="/api/github", tags=["GitHub"])

@router.get("/repos")
def list_github_repos():
    return []

@router.get("/user")
def get_github_user():
    return {"message": "GitHub user info"}

@router.post("/webhooks")
def handle_webhook():
    return {"message": "Webhook received"}
