from pydantic import BaseModel

class ContributorResponse(BaseModel):
    username: str
    avatar_url: str
    contributions: int
