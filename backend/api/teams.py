# Teams API Routes
from fastapi import APIRouter

router = APIRouter(prefix="/api/teams", tags=["Teams"])

@router.get("/")
def list_teams():
    return []

@router.post("/")
def create_team():
    return {"message": "Team created"}

@router.get("/{team_id}/members")
def get_team_members(team_id: int):
    return []
