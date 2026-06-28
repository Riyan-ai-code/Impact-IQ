# Dashboard API Routes
from fastapi import APIRouter

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/")
def get_dashboard():
    return {
        "total_projects": 0,
        "total_repositories": 0,
        "total_analyses": 0,
        "risk_score": 0,
        "recent_activity": []
    }

@router.get("/stats")
def get_stats():
    return {"message": "Dashboard stats"}
