# Teams API Routes
from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

router = APIRouter(prefix="/api/teams", tags=["Teams"])

class TeamCreatePayload(BaseModel):
    name: str
    description: Optional[str] = ""
    default_role: Optional[str] = "Developer"

class MemberInvitePayload(BaseModel):
    email: str
    name: Optional[str] = None
    role: Optional[str] = "Developer"

# In-memory storage for teams
teams_db: Dict[str, Dict[str, Any]] = {}

@router.get("/")
def list_teams():
    """List all teams."""
    return list(teams_db.values())

@router.post("/")
def create_team(payload: TeamCreatePayload):
    """Create a new team."""
    team_id = f"team-{len(teams_db) + 1}"
    new_team = {
        "id": team_id,
        "name": payload.name,
        "description": payload.description,
        "lead": "Riyan Shah",
        "members": [
            {
                "id": "user-1",
                "name": "Riyan Shah",
                "email": "riyan@impactiq.dev",
                "role": "Owner",
                "status": "active"
            }
        ]
    }
    teams_db[team_id] = new_team
    return {"status": "success", "message": f"Team {payload.name} created.", "team": new_team}

@router.get("/{team_id}/members")
def get_team_members(team_id: str):
    """List team members."""
    team = teams_db.get(team_id)
    if not team:
        return []
    return team.get("members", [])

@router.post("/{team_id}/members")
def invite_team_member(team_id: str, payload: MemberInvitePayload):
    """Invite a member to a team."""
    team = teams_db.get(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found.")
    
    new_member = {
        "id": f"member-{len(team['members']) + 1}",
        "name": payload.name or payload.email.split("@")[0],
        "email": payload.email,
        "role": payload.role,
        "status": "pending"
    }
    team["members"].append(new_member)
    return {"status": "success", "message": f"Invitation sent to {payload.email}.", "member": new_member}

@router.delete("/{team_id}/members/{member_id}")
def remove_team_member(team_id: str, member_id: str):
    """Remove a member from a team."""
    team = teams_db.get(team_id)
    if team:
        team["members"] = [m for m in team["members"] if m["id"] != member_id]
    return {"status": "success", "message": "Member removed."}

