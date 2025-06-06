from sqlalchemy import Column, Integer, Float, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class BookingStatus(enum.Enum):
    PENDING = "pending"
    CANCELED = "canceled"
    COMPLETED = "completed"

class BookingTicket(Base):
    __tablename__ = "booking_tickets"
    
    booking_ticket_id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, nullable=False)
    showtime_id = Column(Integer, nullable=False)
    booking_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)
    total_amount = Column(Float, nullable=False)
    payment_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    seats = relationship("BookingSeat", back_populates="booking_ticket")
    
class BookingSeat(Base):
    __tablename__ = "booking_seats"
    
    booking_seat_id = Column(Integer, primary_key=True, autoincrement=True)
    booking_ticket_id = Column(Integer, ForeignKey("booking_tickets.booking_ticket_id"), nullable=False)
    seat_status_id = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    booking_ticket = relationship("BookingTicket", back_populates="seats")
