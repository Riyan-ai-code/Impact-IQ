# Security utilities
from core.config import settings

def verify_token(token: str) -> dict:
    """Verify a JWT token and return the payload."""
    # TODO: Implement JWT verification
    return {"user_id": "placeholder"}

def create_token(data: dict) -> str:
    """Create a JWT token."""
    # TODO: Implement JWT creation
    return "placeholder_token"

def hash_password(password: str) -> str:
    """Hash a password."""
    # TODO: Use bcrypt
    return password

def verify_password(plain: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    # TODO: Use bcrypt
    return plain == hashed
