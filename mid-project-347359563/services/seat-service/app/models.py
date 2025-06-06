from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base
import enum

class SeatType(str, enum.Enum):
    NORMAL = "normal"
    VIP = "vip"
    PREMIUM = "premium"

class SeatStatusType(str, enum.Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    BOOKED = "booked"

class Seat(Base):
    __tablename__ = "seats"

    seat_id = Column(Integer, primary_key=True, autoincrement=True)
    seat_name = Column(String(255), nullable=False)
    seat_type = Column(Enum(SeatType), nullable=False)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    seat_statuses = relationship("SeatStatus", back_populates="seat", cascade="all, delete-orphan")

class SeatStatus(Base):
    __tablename__ = "seat_statuses"

    seat_status_id = Column(Integer, primary_key=True, autoincrement=True)
    seat_id = Column(Integer, ForeignKey("seats.seat_id"))
    showtime_id = Column(Integer, nullable=False)
    customer_id = Column(Integer, nullable=True)
    booking_ticket_id = Column(Integer, nullable=True)
    price = Column(Float, nullable=False)
    status = Column(Enum(SeatStatusType), nullable=False, default=SeatStatusType.AVAILABLE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    seat = relationship("Seat", back_populates="seat_statuses")

