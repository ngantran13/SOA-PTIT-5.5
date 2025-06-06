from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import enum

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class PaymentMethod(str, enum.Enum):
    VNPAY = "vnpay"
    COD = "cod"

class PaymentBase(BaseModel):
    transaction_id: str
    booking_ticket_id: int
    customer_id: int
    full_name: Optional[str] = None
    email: Optional[str] = None
    payment_method: PaymentMethod
    payment_time: Optional[datetime] = None
    amount: float
    payment_status: PaymentStatus = PaymentStatus.PENDING

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(PaymentBase):
    transaction_id: Optional[str] = None
    booking_ticket_id: Optional[int] = None
    customer_id: Optional[int] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    payment_method: Optional[PaymentMethod] = None
    payment_time: Optional[datetime] = None
    amount: Optional[float] = None
    payment_status: Optional[PaymentStatus] = None

class Payment(PaymentBase):
    payment_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True