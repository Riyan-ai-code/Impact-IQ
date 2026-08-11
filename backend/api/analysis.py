# Analysis API Routes
from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

class AnalysisRequestPayload(BaseModel):
    repository: str
    branch: str
    ai_model: Optional[str] = "gemini-1.5-pro"
    custom_rules: Optional[str] = ""
    security_analysis: Optional[bool] = True
    dependency_analysis: Optional[bool] = True
    api_analysis: Optional[bool] = True

analyses_db: Dict[str, Dict[str, Any]] = {}

@router.post("/")
def start_analysis(payload: AnalysisRequestPayload):
    """Trigger a new AI risk analysis for a repository branch."""
    analysis_id = f"anl-{len(analyses_db) + 1}"
    
    # Calculate mock risk score based on model & scanners
    risk_score = 78 if payload.api_analysis else 42
    risk_level = "High" if risk_score > 70 else "Medium" if risk_score > 40 else "Low"

    report = {
        "id": analysis_id,
        "repository": payload.repository,
        "branch": payload.branch,
        "ai_model": payload.ai_model,
        "custom_rules": payload.custom_rules,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "status": "completed",
        "summary": [
            f"PR introduces new webhook handler in backend/api/webhooks.py analyzed via {payload.ai_model}.",
            "Altered REST API response payload schema for /api/v1/charge, removing legacy transaction_id field.",
            "Dockerfile uses node:18 base image running as root user without non-root drop."
        ],
        "security_issues": [
            "Missing HMAC SHA256 signature verification on Stripe webhook payload.",
            "Hardcoded test API secret key detected in test fixture test_stripe.py."
        ],
        "api_contract_issues": [
            "Removed deprecated transaction_id property from /api/v1/charge schema (Breaks mobile client v2.1)."
        ],
        "checklist": [
            "Add Stripe HMAC signature validation check before parsing webhook payload.",
            "Keep legacy transaction_id alias field for backward compatibility.",
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

