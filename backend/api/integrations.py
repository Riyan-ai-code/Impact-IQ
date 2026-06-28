# Integrations API Routes
from fastapi import APIRouter

router = APIRouter(prefix="/api/integrations", tags=["Integrations"])

@router.get("/")
def list_integrations():
    return []

@router.post("/")
def create_integration():
    return {"message": "Integration created"}

@router.delete("/{integration_id}")
def delete_integration(integration_id: int):
    return {"message": f"Integration {integration_id} deleted"}
