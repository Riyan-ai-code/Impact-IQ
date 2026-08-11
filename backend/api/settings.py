# Settings API Routes
from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any
from pydantic import BaseModel

router = APIRouter(prefix="/api/settings", tags=["Settings"])

class ProjectSettingsPayload(BaseModel):
    project_id: str
    project_name: str
    description: Optional[str] = ""
    branch: Optional[str] = "main"
    team: Optional[str] = "Platform Engineering"
    ai_model: Optional[str] = "gemini-1.5-pro"
    custom_rules: Optional[str] = ""

# In-memory storage for project settings
project_settings_db: Dict[str, Dict[str, Any]] = {}

@router.get("/{project_id}")
def get_project_settings(project_id: str):
    """Retrieve settings for a given project."""
    return project_settings_db.get(project_id, {
        "project_id": project_id,
        "project_name": "Payment Platform",
        "description": "Microservices based payment platform.",
        "branch": "main",
        "team": "Platform Engineering",
        "ai_model": "gemini-1.5-pro",
        "custom_rules": "Flag raw SQL queries without parameterization.\nVerify Dockerfile does not run as root user."
    })

@router.put("/{project_id}")
def update_project_settings(project_id: str, payload: ProjectSettingsPayload):
    """Save or update settings for a given project."""
    project_settings_db[project_id] = payload.dict()
    return {
        "status": "success",
        "message": f"Settings saved for {payload.project_name}.",
        "settings": project_settings_db[project_id]
    }

