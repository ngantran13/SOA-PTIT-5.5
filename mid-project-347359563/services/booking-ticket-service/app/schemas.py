from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class BookingStatus(str, Enum):
    PENDING = "pending"
    CANCELED = "canceled"
    COMPLETED = "completed"

class BookingTicketBase(BaseModel):
    customer_id: int
    showtime_id: int
    booking_date: datetime
    status: BookingStatus = BookingStatus.PENDING
    total_amount: float 
    payment_id: Optional[int] = None

class BookingTicketCreate(BaseModel):
    customer_id: int
    showtime_id: int
    total_amount: float
    seat_status_ids: list[int]

class BookingTicketUpdate(BookingTicketBase):
    customer_id: Optional[int] = None
    showtime_id: Optional[int] = None
    booking_date: Optional[datetime] = None
    status: Optional[BookingStatus] = None
    total_amount: Optional[float] = None
    payment_id: Optional[int] = None

class BookingTicket(BookingTicketBase):
    booking_ticket_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BookingSeatBase(BaseModel):
    booking_ticket_id: int
    seat_status_id: int

class BookingSeatCreate(BookingSeatBase):
    pass

class BookingSeatUpdate(BookingSeatBase):
    booking_ticket_id: Optional[int] = None
    seat_status_id: Optional[int] = None

class BookingSeat(BookingSeatBase):
    booking_seat_id: int
    created_at: datetime
    updated_at: datetime
    booking_ticket: BookingTicket

    class Config:
        from_attributes = True