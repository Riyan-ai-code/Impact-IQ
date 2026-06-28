# Notifications API Routes
from fastapi import APIRouter

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("/")
def list_notifications():
    return []

@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int):
    return {"message": f"Notification {notification_id} marked as read"}

@router.delete("/clear")
def clear_notifications():
    return {"message": "All notifications cleared"}
