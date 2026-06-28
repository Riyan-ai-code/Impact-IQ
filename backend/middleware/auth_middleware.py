# Authentication Middleware
# Checks if the user is authenticated before accessing protected routes

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Public routes that don't need authentication
        public_paths = ["/api/health", "/api/auth", "/docs", "/openapi.json"]

        if any(request.url.path.startswith(path) for path in public_paths):
            return await call_next(request)

        # Check for Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            # For now, let all requests through
            # TODO: Return 401 when auth is fully implemented
            pass

        response = await call_next(request)
        return response
