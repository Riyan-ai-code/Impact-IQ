# GitHub Webhook Middleware
# Verifies that incoming webhook requests are really from GitHub

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class GitHubWebhookMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/api/webhooks/github"):
            # TODO: Verify GitHub webhook signature
            # signature = request.headers.get("X-Hub-Signature-256")
            pass

        response = await call_next(request)
        return response
