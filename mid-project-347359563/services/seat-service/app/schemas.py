from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class SeatType(str, Enum):
    NORMAL = "normal"
    VIP = "vip"
    PREMIUM = "premium"

class SeatStatusType(str, Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    BOOKED = "booked"

class SeatBase(BaseModel):
    seat_name: str
    seat_type: SeatType = SeatType.NORMAL
    price: float = 0.0

class SeatCreate(SeatBase):
    pass

class SeatUpdate(SeatBase):
    seat_name: Optional[str] = None
    seat_type: Optional[SeatType] = None
    price: Optional[float] = None

class Seat(SeatBase):
    seat_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SeatWithStatus(Seat):
    seat_statuses: List["SeatStatus"] = []

    class Config:
        from_attributes = True

class SeatStatusBase(BaseModel):
    seat_id: int
    showtime_id: int
    customer_id: Optional[int] = None
    booking_ticket_id: Optional[int] = None
    price: float = 0.0
    status: SeatStatusType = SeatStatusType.AVAILABLE

class SeatStatusCreate(SeatStatusBase):
    pass

class SeatStatusUpdate(SeatStatusBase):
    seat_id: Optional[int] = None
    showtime_id: Optional[int] = None
    customer_id: Optional[int] = None
    booking_ticket_id: Optional[int] = None
    price: Optional[float] = None
    status: Optional[SeatStatusType] = None

class SeatStatus(SeatStatusBase):
    seat_status_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SeatStatusWithSeat(SeatStatus):
    seat: Seat

    class Config:
        from_attributes = True

class SeatStatusReverse(BaseModel):
    customer_id: int
    booking_ticket_id: int