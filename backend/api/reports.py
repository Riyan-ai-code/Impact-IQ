# Reports API Routes
from fastapi import APIRouter

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/")
def list_reports():
    return []

@router.get("/{report_id}")
def get_report(report_id: int):
    return {"id": report_id, "title": "Sample Report"}

@router.get("/{report_id}/download")
def download_report(report_id: int):
    return {"message": "Download link for report"}
