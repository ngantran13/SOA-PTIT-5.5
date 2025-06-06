from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
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

from sqlalchemy.orm import Session
from sqlalchemy import update
from fastapi import HTTPException
from .models import SeatStatus, SeatStatusType

def reserve_seat_on_receive_message(booking_ticket_id: int, customer_id: int, seat_status_ids: list) -> None:
    try:
        db = SessionLocal()
        seat_status_list = db.query(SeatStatus).filter(
            SeatStatus.seat_status_id.in_(seat_status_ids),
            SeatStatus.status == SeatStatusType.AVAILABLE
        ).all()

        if not seat_status_list:
            raise HTTPException(status_code=404, detail="No available seats found")

        if len(seat_status_list) != len(seat_status_ids):
            raise HTTPException(status_code=400, detail="Some seats are not available")

        db.execute(
            update(SeatStatus)
            .where(SeatStatus.seat_status_id.in_(seat_status_ids))
            .values(
                status=SeatStatusType.RESERVED,
                booking_ticket_id=booking_ticket_id,
                customer_id=customer_id
            )
        )
        db.commit()
        print(f"Reserved seats for booking ticket ID {booking_ticket_id} and customer ID {customer_id}")
    except HTTPException as e:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")


def update_seat_status_on_receive_message(booking_ticket_id: int, status: str) -> None:

    valid_statuses = {"success", "fail"}
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status: {status}. Must be one of {valid_statuses}")

    try:
        db = SessionLocal()
        seat_status_count = db.query(SeatStatus).filter(
            SeatStatus.booking_ticket_id == booking_ticket_id
        ).count()

        if seat_status_count == 0:
            raise HTTPException(status_code=404, detail="No seats found for booking ticket")

        update_values = (
            {"status": SeatStatusType.BOOKED}
            if status == "success"
            else {
                "status": SeatStatusType.AVAILABLE,
                "booking_ticket_id": None,
                "customer_id": None
            }
        )

        db.execute(
            update(SeatStatus)
            .where(SeatStatus.booking_ticket_id == booking_ticket_id)
            .values(**update_values)
        )
        db.commit()
        print(f"Updated seat status for booking ticket ID {booking_ticket_id} to {status}")
    except HTTPException as e:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")        
        db.close()