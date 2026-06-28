# Repositories API Routes
from fastapi import APIRouter

router = APIRouter(prefix="/api/repositories", tags=["Repositories"])

@router.get("/")
def list_repositories():
    return []

@router.get("/{repo_id}")
def get_repository(repo_id: int):
    return {"id": repo_id, "name": "sample-repo"}

@router.get("/{repo_id}/branches")
def get_branches(repo_id: int):
    return ["main", "develop"]

@router.get("/{repo_id}/contributors")
def get_contributors(repo_id: int):
    return []
