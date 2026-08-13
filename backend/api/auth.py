from fastapi import APIRouter, HTTPException, Header, Query, status
from fastapi.responses import RedirectResponse
from typing import Optional
import os

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.get("/github/login")
def github_login():
    # Load OAuth app credentials from .env
    client_id = os.getenv("GITHUB_CLIENT_ID")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI")
    
    # Build GitHub authorization URL
    # client_id   → tells GitHub which app is requesting access
    # redirect_uri → where GitHub sends the user after they approve
    # scope        → permissions: repo (read repos) + read:user (read profile)
    url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=repo,read:user"
    
    # Send user to GitHub login & authorization page
    return RedirectResponse(url)


@router.get("/github/callback")
async def github_callback(code: str = "", error: Optional[str] = None):
    # GitHub sends a temporary `code` in the query params after user approves
    # This code expires in 10 minutes and can only be used once
    import httpx
    
    # Load credentials from .env
    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    frontend_url = os.getenv("FRONTEND_URL")

    # If GitHub OAuth returned an error
    if error:
        return RedirectResponse(f"{frontend_url}/auth/callback?error={error}")

    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authorization code is missing."
        )

    # Exchange the temporary code for a real access token
    # GitHub needs client_id + client_secret to verify this request is from our app
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code
            },
            headers={"Accept": "application/json"}  # return JSON not URL-encoded string
        )
    
    token_data = response.json()
    
    if "error" in token_data:
        error_desc = token_data.get("error_description", token_data["error"])
        return RedirectResponse(f"{frontend_url}/auth/callback?error={error_desc}")

    access_token = token_data.get("access_token")  # extract token from response
    refresh_token = token_data.get("refresh_token") or ""
    expires_in = token_data.get("expires_in") or 900  # 15 minutes default

    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Access token not found in GitHub response."
        )

    # Redirect user back to frontend with access_token, refresh_token & expires_in
    return RedirectResponse(f"{frontend_url}/auth/callback?token={access_token}&refresh_token={refresh_token}&expires_in={expires_in}")


@router.post("/github/refresh")
async def refresh_github_token(payload: dict):
    import httpx
    
    refresh_token = payload.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=400, detail="Missing refresh_token parameter.")
        
    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": client_id,
                "client_secret": client_secret,
                "grant_type": "refresh_token",
                "refresh_token": refresh_token
            },
            headers={"Accept": "application/json"}
        )
    
    token_data = response.json()
    if "error" in token_data:
        raise HTTPException(status_code=400, detail=token_data.get("error_description", token_data["error"]))
        
    return token_data


@router.get("/github/repos")
async def get_github_repos(
    token: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None)
):
    import httpx
    
    # Extract token from query param or Authorization header
    github_token = token
    if not github_token and authorization and authorization.startswith("Bearer "):
        github_token = authorization.split(" ")[1]

    if not github_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing GitHub access token. Use Bearer token in Authorization header or pass in query."
        )
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user/repos?per_page=100",
            headers={
                "Authorization": f"Bearer {github_token}",      # authenticate as the GitHub user
                "Accept": "application/vnd.github+json",  # use latest GitHub API response format
                "User-Agent": "Impact-IQ-Backend"
            }
        )
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to fetch repositories from GitHub."
        )
    
    # Return the list of repositories to the frontend
    return response.json()


@router.get("/github/repos/{owner}/{repo}/branches")
async def get_github_repo_branches(
    owner: str,
    repo: str,
    token: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None)
):
    import httpx
    
    # Extract token from query param or Authorization header
    github_token = token
    if not github_token and authorization and authorization.startswith("Bearer "):
        github_token = authorization.split(" ")[1]

    if not github_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing GitHub access token. Use Bearer token in Authorization header or pass in query."
        )
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/branches?per_page=100",
            headers={
                "Authorization": f"Bearer {github_token}",
                "Accept": "application/vnd.github+json",
                "User-Agent": "Impact-IQ-Backend"
            }
        )
        
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to fetch branches from GitHub."
        )
        
    branches_data = response.json()
    return [b.get("name") for b in branches_data]


@router.get("/github/user")
async def get_github_user_profile(
    token: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None)
):
    import httpx
    
    github_token = token
    if not github_token and authorization and authorization.startswith("Bearer "):
        github_token = authorization.split(" ")[1]

    if not github_token:
        # Fallback to demo profile if no token passed
        return {
            "name": "Riyan Shah",
            "login": "Riyan-ai-code",
            "avatar_url": "https://github.com/Riyan-ai-code.png",
            "email": "riyan@impactiq.dev"
        }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {github_token}",
                "Accept": "application/vnd.github+json",
                "User-Agent": "Impact-IQ-Backend"
            }
        )
    
    if response.status_code != 200:
        return {
            "name": "Riyan Shah",
            "login": "Riyan-ai-code",
            "avatar_url": "https://github.com/Riyan-ai-code.png",
            "email": "riyan@impactiq.dev"
        }
    
    user_data = response.json()
    return {
        "name": user_data.get("name") or user_data.get("login") or "Riyan Shah",
        "login": user_data.get("login") or "Riyan-ai-code",
        "avatar_url": user_data.get("avatar_url") or "https://github.com/Riyan-ai-code.png",
        "email": user_data.get("email") or f"{user_data.get('login', 'riyan')}@impactiq.dev",
        "html_url": user_data.get("html_url")
    }