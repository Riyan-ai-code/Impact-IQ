# Settings API Routes
from fastapi import APIRouter

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("/")
def get_settings():
    return {"theme": "dark", "notifications_enabled": True}

@router.put("/")
def update_settings():
    return {"message": "Settings updated"}
