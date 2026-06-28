from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class GitHubCallbackResponse(BaseModel):
    access_token: str
    user: Optional[dict] = None
