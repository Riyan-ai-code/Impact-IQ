from pydantic import BaseModel
from typing import Optional

class ReportResponse(BaseModel):
    id: int
    analysis_id: int
    title: str
    summary: str
