# Analysis API Routes
from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

class AnalysisRequestPayload(BaseModel):
    repository: str
    branch: str
    mode: Optional[str] = "auto"  # "auto" or "manual"
    user_prompt: Optional[str] = None
    ai_model: Optional[str] = "gemini-1.5-pro"
    security_analysis: Optional[bool] = True
    dependency_analysis: Optional[bool] = True
    api_analysis: Optional[bool] = True

analyses_db: Dict[str, Dict[str, Any]] = {}

@router.post("/")
def start_analysis(payload: AnalysisRequestPayload):
    """Trigger a new AI risk analysis (Automatic scan or Manual custom prompt)."""
    analysis_id = f"anl-{len(analyses_db) + 1}"
    
    if payload.mode == "manual":
        report = {
            "id": analysis_id,
            "mode": "manual",
            "repository": payload.repository,
            "branch": payload.branch,
            "prompt": payload.user_prompt or "Analyze this PR for code safety.",
            "status": "completed",
            "ai_response": f"AI Assistant analysis for: '{payload.user_prompt}':\n\n1. No SQL injection vulnerabilities detected in ORM calls.\n2. API response payload for /api/v1/charge changed (removed legacy transaction_id property).\n3. Stripe webhook handler lacks HMAC signature verification.",
            "key_takeaways": [
                "Re-add legacy transaction_id alias for mobile client v2.1 compatibility.",
                "Implement stripe.Webhook.construct_event() signature verification."
            ],
            "flagged_snippets": [
                "backend/api/webhooks.py: L42 - missing signature verification",
                "backend/api/charge.py: L18 - removed transaction_id"
            ]
        }
    else:
        report = {
            "id": analysis_id,
            "mode": "auto",
            "repository": payload.repository,
            "branch": payload.branch,
            "risk_score": 78,
            "risk_level": "High",
            "status": "completed",
            "summary": [
                "PR introduces new webhook handler in backend/api/webhooks.py.",
                "Altered REST API response payload schema for /api/v1/charge, removing legacy transaction_id field.",
                "Dockerfile uses node:18 base image running as root user."
            ],
            "security_issues": [
                "Missing HMAC SHA256 signature verification on Stripe webhook payload.",
                "Hardcoded test API secret key in test fixture."
            ],
            "api_contract_issues": [
                "Removed deprecated transaction_id property from /api/v1/charge schema."
            ],
            "checklist": [
                "Add Stripe HMAC signature validation check.",
                "Keep legacy transaction_id alias field.",
                "Add USER node directive to Dockerfile."
            ]
        }
    
    analyses_db[analysis_id] = report
    return {"status": "success", "analysis": report}

@router.get("/{analysis_id}")
def get_analysis(analysis_id: str):
    """Retrieve an analysis report by ID."""
    report = analyses_db.get(analysis_id)
    if not report:
        raise HTTPException(status_code=404, detail="Analysis report not found.")
    return report


