from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def update_booking_ticket_on_receive_message(booking_ticket_id: int, payment_id: int, status: str):
    db = SessionLocal()
    try:
        from .models import BookingTicket, BookingStatus
        booking_ticket = db.query(BookingTicket).filter(BookingTicket.booking_ticket_id == booking_ticket_id).first()
        if not booking_ticket:
            raise Exception("Booking ticket not found", 404)
        
        booking_ticket.payment_id = payment_id
        if status == "success":
            booking_ticket.status = BookingStatus.COMPLETED
        else:
            booking_ticket.status = BookingStatus.CANCELED
        db.commit()
        db.refresh(booking_ticket)
        print(f"Booking ticket {booking_ticket_id} updated with payment ID {payment_id} and status {status}")
        return booking_ticket
    finally:
        db.close()