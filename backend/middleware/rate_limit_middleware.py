# Rate Limit Middleware
# Limits how many requests a user can make per minute
# TODO: Implement actual rate limiting with Redis

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # TODO: Check rate limits
        # For now, allow all requests
        response = await call_next(request)
        return response
