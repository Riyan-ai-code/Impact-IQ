from pydantic import BaseModel
from typing import Optional

class AnalysisRequest(BaseModel):
    project_id: int

class AnalysisResponse(BaseModel):
    id: int
    project_id: int
    status: str
    risk_score: Optional[float] = 0
