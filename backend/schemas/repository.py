from pydantic import BaseModel
from typing import Optional

class RepositoryResponse(BaseModel):
    id: int
    name: str
    full_name: str
    is_private: bool
    language: Optional[str] = None
    stars: Optional[int] = 0
    updated_at: Optional[str] = None
