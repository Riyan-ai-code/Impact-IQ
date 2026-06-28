from pydantic import BaseModel
from typing import Optional

class NotificationResponse(BaseModel):
    id: int
    message: str
    is_read: bool
