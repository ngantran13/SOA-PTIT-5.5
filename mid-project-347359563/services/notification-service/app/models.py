from sqlalchemy import Integer, String, Column, DateTime, Enum
from sqlalchemy.sql import func
from .database import Base
import enum

class NotificationType(str, enum.Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"
    FAIL = "fail"


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, nullable=False)
    booking_id = Column(Integer, nullable=False)
    notification_type = Column(Enum(NotificationType), default=NotificationType.INFO)
    subject = Column(String(255), nullable=False)
    message = Column(String(255), nullable=False)
    details = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

