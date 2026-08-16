# Teams API Routes
from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

router = APIRouter(prefix="/api/teams", tags=["Teams"])

class TeamCreatePayload(BaseModel):
    name: str
    description: Optional[str] = ""
    default_role: Optional[str] = "Developer"
    lead_name: Optional[str] = "Lead Developer"
    lead_email: Optional[str] = "dev@impactiq.dev"

class MemberInvitePayload(BaseModel):
    email: str
    name: Optional[str] = None
    role: Optional[str] = "Developer"

# In-memory storage for teams (synced across all connected browsers)
teams_db: Dict[str, Dict[str, Any]] = {}

@router.get("/")
def list_teams():
    """List all teams."""
    return list(teams_db.values())

@router.post("/")
def create_team(payload: TeamCreatePayload):
    """Create a new team."""
    team_id = f"team-{len(teams_db) + 1}"
    lead_name = payload.lead_name or "Lead Developer"
    lead_email = payload.lead_email or "dev@impactiq.dev"
    new_team = {
        "id": team_id,
        "name": payload.name,
        "description": payload.description,
        "lead": lead_name,
        "members": [
            {
                "id": "user-1",
                "name": lead_name,
                "email": lead_email,
                "role": "Owner",
                "status": "active"
            }
        ]
    }
    teams_db[team_id] = new_team
    return {"status": "success", "message": f"Team {payload.name} created.", "team": new_team}

@router.delete("/{team_id}")
def delete_team(team_id: str):
    """Delete a team."""
    if team_id in teams_db:
        deleted = teams_db.pop(team_id)
        return {"status": "success", "message": f"Team {deleted.get('name')} deleted."}
    return {"status": "success", "message": "Team deleted."}

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
        "id": f"member-{len(team.get('members', [])) + 1}",
        "name": payload.name or payload.email.split("@")[0],
        "email": payload.email,
        "role": payload.role,
        "status": "pending"
    }
    team.setdefault("members", []).append(new_member)
    return {"status": "success", "message": f"Invitation sent to {payload.email}.", "member": new_member}

class RoleUpdatePayload(BaseModel):
    role: str

# RBAC Role Permission Matrix
ROLE_PERMISSIONS = {
    "Owner": {
        "description": "Full access to organization, team management, billing, and project destruction.",
        "permissions": ["team:manage", "team:invite", "team:delete", "project:create", "project:delete", "analysis:trigger", "integrations:manage", "audit:view"],
        "level": 1
    },
    "Admin": {
        "description": "Administrative access to configure projects, invite members, and configure integrations.",
        "permissions": ["team:invite", "project:create", "project:edit", "analysis:trigger", "integrations:manage", "audit:view"],
        "level": 2
    },
    "Maintainer": {
        "description": "Can manage repositories, trigger risk scans, and configure deployment rules.",
        "permissions": ["project:edit", "analysis:trigger", "reports:export", "audit:view"],
        "level": 3
    },
    "Developer": {
        "description": "Standard engineering access to view repositories, initiate pull request scans, and view reports.",
        "permissions": ["analysis:trigger", "reports:view", "reports:export"],
        "level": 4
    },
    "Viewer": {
        "description": "Read-only access to view risk reports, architecture graphs, and dashboard metrics.",
        "permissions": ["reports:view"],
        "level": 5
    }
}

@router.get("/roles")
def get_rbac_roles():
    """Retrieve all available RBAC roles and their associated permissions."""
    return {
        "roles": ROLE_PERMISSIONS,
        "role_names": list(ROLE_PERMISSIONS.keys())
    }

@router.put("/{team_id}/members/{member_id}/role")
def update_member_role(team_id: str, member_id: str, payload: RoleUpdatePayload):
    """Update a team member's RBAC role."""
    if payload.role not in ROLE_PERMISSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(ROLE_PERMISSIONS.keys())}")
    
    team = teams_db.get(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found.")
    
    member = next((m for m in team.get("members", []) if m["id"] == member_id), None)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found in this team.")
    
    old_role = member.get("role")
    member["role"] = payload.role
    return {
        "status": "success",
        "message": f"Updated {member.get('name')} role from {old_role} to {payload.role}.",
        "member": member,
        "permissions": ROLE_PERMISSIONS[payload.role]["permissions"]
    }

@router.delete("/{team_id}/members/{member_id}")
def remove_team_member(team_id: str, member_id: str):
    """Remove a member from a team."""
    team = teams_db.get(team_id)
    if team:
        team["members"] = [m for m in team.get("members", []) if m["id"] != member_id]
    return {"status": "success", "message": "Member removed."}

class CheckPermissionPayload(BaseModel):
    role: str
    required_permission: str

@router.post("/check-permission")
def check_permission(payload: CheckPermissionPayload):
    """Verify if a given role has the required permission."""
    role_info = ROLE_PERMISSIONS.get(payload.role)
    if not role_info:
        return {"allowed": False, "role": payload.role, "reason": "Role not found."}
    
    has_perm = payload.required_permission in role_info["permissions"]
    return {
        "allowed": has_perm,
        "role": payload.role,
        "permission": payload.required_permission,
        "description": role_info["description"]
    }
