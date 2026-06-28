# Shared dependencies for FastAPI routes
from fastapi import Header, HTTPException

async def get_current_user(authorization: str = Header(None)):
    """Get the current user from the Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    # TODO: Verify token and return user
    return {"token": token}
