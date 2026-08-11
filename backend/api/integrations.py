# Integrations API Routes
from fastapi import APIRouter, HTTPException, Body
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

router = APIRouter(prefix="/api/integrations", tags=["Integrations"])

class IntegrationPayload(BaseModel):
    id: str
    name: str
    category: str
    webhook_url: Optional[str] = None
    api_key: Optional[str] = None
    domain_url: Optional[str] = None
    auto_comment_pr: Optional[bool] = True
    auto_create_jira_bug: Optional[bool] = True
    min_alert_score: Optional[int] = 60

# In-memory integration configs storage (or connected database)
integrations_db: Dict[str, Dict[str, Any]] = {
    "github": {
        "id": "github",
        "name": "GitHub",
        "category": "vcs",
        "connected": True,
        "auto_comment_pr": True
    },
    "github_bot": {
        "id": "github_bot",
        "name": "GitHub PR Comment Bot",
        "category": "cicd",
        "connected": True,
        "auto_comment_pr": True
    }
}

@router.get("/")
def list_integrations():
    """List all configured integrations."""
    return list(integrations_db.values())

@router.post("/")
def save_integration(payload: IntegrationPayload):
    """Save or update an integration configuration."""
    integrations_db[payload.id] = {
        **payload.dict(),
        "connected": True
    }
    return {
        "status": "success",
        "message": f"{payload.name} integration configured successfully.",
        "integration": integrations_db[payload.id]
    }

@router.post("/{integration_id}/test")
async def test_integration(integration_id: str):
    """Fire a test notification alert for Slack, Teams, or Discord."""
    config = integrations_db.get(integration_id)
    if not config:
        raise HTTPException(status_code=404, detail="Integration not found or not connected.")
    
    webhook_url = config.get("webhook_url")
    if not webhook_url:
        return {
            "status": "simulated",
            "message": f"Test alert triggered for {config['name']} (Simulated payload)."
        }
    
    import httpx
    async with httpx.AsyncClient() as client:
        try:
            res = await client.post(
                webhook_url,
                json={"text": "🛡️ ImpactIQ Integration Test Alert: Connection Verified Successfully!"}
            )
            return {
                "status": "success",
                "message": f"Test alert sent to {config['name']}.",
                "status_code": res.status_code
            }
        except Exception as e:
            return {
                "status": "failed",
                "message": f"Failed to deliver test payload: {str(e)}"
            }

@router.delete("/{integration_id}")
def delete_integration(integration_id: str):
    """Disconnect an integration."""
    if integration_id in integrations_db:
        del integrations_db[integration_id]
    return {"status": "success", "message": f"Integration {integration_id} disconnected."}

