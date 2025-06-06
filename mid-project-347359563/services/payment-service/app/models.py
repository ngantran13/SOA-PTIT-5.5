from sqlalchemy import Column, Integer, String, DateTime, Float, Enum
from .database import Base
from sqlalchemy.sql import func
import enum

class PaymentStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class PaymentMethod(enum.Enum):
    VNPAY = "vnpay"
    COD = "cod"

class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(String(255), nullable=False)
    booking_ticket_id = Column(Integer, nullable=False)
    customer_id = Column(Integer, nullable=False)
    full_name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    payment_time = Column(DateTime(timezone=True), server_default=func.now())
    amount = Column(Float, nullable=False)
    payment_status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
