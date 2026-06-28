from pydantic import BaseModel
from typing import Optional

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    repo_id: Optional[int] = None

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str
