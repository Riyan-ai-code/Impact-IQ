# Projects API Routes
from fastapi import APIRouter

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.get("/")
def list_projects():
    return []

@router.post("/")
def create_project():
    return {"message": "Project created"}

@router.get("/{project_id}")
def get_project(project_id: int):
    return {"id": project_id, "name": "Sample Project"}

@router.put("/{project_id}")
def update_project(project_id: int):
    return {"message": f"Project {project_id} updated"}

@router.delete("/{project_id}")
def delete_project(project_id: int):
    return {"message": f"Project {project_id} deleted"}
