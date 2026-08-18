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
    
    # Build GitHub authorization URL with user:email scope
    url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=repo,read:user,user:email"
    
    # Send user to GitHub login & authorization page
    return RedirectResponse(url)


@router.get("/github/callback")
async def github_callback(code: str = "", error: Optional[str] = None):
    # GitHub sends a temporary `code` in the query params after user approves
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
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code
            },
            headers={"Accept": "application/json"}
        )
    
    token_data = response.json()
    
    if "error" in token_data:
        error_desc = token_data.get("error_description", token_data["error"])
        return RedirectResponse(f"{frontend_url}/auth/callback?error={error_desc}")

    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token") or ""
    expires_in = token_data.get("expires_in") or 900

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
                "Authorization": f"Bearer {github_token}",
                "Accept": "application/vnd.github+json",
                "User-Agent": "Impact-IQ-Backend"
            }
        )
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to fetch repositories from GitHub."
        )
    
    return response.json()


@router.get("/github/repos/{owner}/{repo}/branches")
async def get_github_repo_branches(
    owner: str,
    repo: str,
    token: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None)
):
    import httpx
    
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
        return {
            "name": "Connected Developer",
            "login": "dev",
            "avatar_url": "https://github.com/github.png",
            "email": "dev@impactiq.dev",
            "bio": ""
        }
    
    async with httpx.AsyncClient() as client:
        # 1. Fetch user base profile
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
                "name": "Connected Developer",
                "login": "dev",
                "avatar_url": "https://github.com/github.png",
                "email": "dev@impactiq.dev",
                "bio": ""
            }
        
        user_data = response.json()
        user_login = user_data.get("login") or "dev"
        user_name = user_data.get("name") or user_login
        user_bio = user_data.get("bio") or ""
        avatar_url = user_data.get("avatar_url") or "https://github.com/github.png"
        resolved_email = user_data.get("email")

        # 2. If email is not public, query user/emails to find primary verified email
        if not resolved_email:
            try:
                emails_res = await client.get(
                    "https://api.github.com/user/emails",
                    headers={
                        "Authorization": f"Bearer {github_token}",
                        "Accept": "application/vnd.github+json",
                        "User-Agent": "Impact-IQ-Backend"
                    }
                )
                if emails_res.status_code == 200:
                    emails_data = emails_res.json()
                    if isinstance(emails_data, list):
                        primary_email = next((e.get("email") for e in emails_data if e.get("primary") and e.get("verified")), None)
                        if not primary_email:
                            primary_email = next((e.get("email") for e in emails_data if e.get("verified")), None)
                        if not primary_email and len(emails_data) > 0:
                            primary_email = emails_data[0].get("email")
                        if primary_email:
                            resolved_email = primary_email
            except Exception:
                pass

        if not resolved_email:
            resolved_email = f"{user_login}@users.noreply.github.com"

        return {
            "name": user_name,
            "login": user_login,
            "avatar_url": avatar_url,
            "email": resolved_email,
            "bio": user_bio,
            "html_url": user_data.get("html_url")
        }


@router.post("/logout")
async def logout_user():
    return {"message": "Logged out successfully", "status": "ok"}