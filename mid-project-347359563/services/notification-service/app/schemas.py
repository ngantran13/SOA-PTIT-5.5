from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class NotificationType(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"
    FAIL = "fail"

class NotificationBase(BaseModel):
    customer_id: int
    booking_id: int
    notification_type: Optional[NotificationType] = NotificationType.INFO
    subject: str
    message: str
    details: Optional[str] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(NotificationBase):
    notification_id: Optional[int] = None
    customer_id: Optional[int] = None
    booking_id: Optional[int] = None
    notification_type: Optional[NotificationType] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    details: Optional[str] = None

class Notification(NotificationBase):
    notification_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

