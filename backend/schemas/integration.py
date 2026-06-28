from pydantic import BaseModel
from typing import Optional

class IntegrationCreate(BaseModel):
    name: str
    type: str
    config: Optional[dict] = {}

class IntegrationResponse(BaseModel):
    id: int
    name: str
    type: str
    is_active: bool
