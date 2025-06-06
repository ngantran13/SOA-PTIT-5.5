from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..utils.client import ServiceClient


router = APIRouter(
    prefix="/api/booking-seats",
    tags=["Booking Seats"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

@router.get("/", response_model=List[schemas.BookingSeat])
def get_booking_seats(
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100
):
    
    booking_seats = db.query(models.BookingSeat).offset(skip).limit(limit).all()
    return booking_seats

@router.get("/{booking_seat_id}", response_model=schemas.BookingSeat)
def get_booking_seat(
    booking_seat_id: int,
    db: Session = Depends(database.get_db)
):
    
    booking_seat = db.query(models.BookingSeat).filter(models.BookingSeat.booking_seat_id == booking_seat_id).first()
    if not booking_seat:
        raise HTTPException(status_code=404, detail="Booking seat not found")
    return booking_seat

@router.post("/", response_model=schemas.BookingSeat)
def create_booking_seat(
    booking_seat: schemas.BookingSeatCreate,
    db: Session = Depends(database.get_db),
):
    new_booking_seat = models.BookingSeat(**booking_seat.model_dump())

    db.add(new_booking_seat)
    db.commit()
    db.refresh(new_booking_seat)

    return new_booking_seat

@router.put("/{booking_seat_id}", response_model=schemas.BookingSeat)
def update_booking_seat(
    booking_seat_id: int,
    booking_seat: schemas.BookingSeatUpdate,
    db: Session = Depends(database.get_db),
):
    
    existing_booking_seat = db.query(models.BookingSeat).filter(models.BookingSeat.booking_seat_id == booking_seat_id).first()
    if not existing_booking_seat:
        raise HTTPException(status_code=404, detail="Booking seat not found")

    for key, value in booking_seat.model_dump(exclude_unset=True).items():
        setattr(existing_booking_seat, key, value)

    db.commit()
    db.refresh(existing_booking_seat)

    return existing_booking_seat

@router.delete("/{booking_seat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking_seat(
    booking_seat_id: int,
    db: Session = Depends(database.get_db),
):
    
    existing_booking_seat = db.query(models.BookingSeat).filter(models.BookingSeat.booking_seat_id == booking_seat_id).first()
    if not existing_booking_seat:
        raise HTTPException(status_code=404, detail="Booking seat not found")

    db.delete(existing_booking_seat)
    db.commit()
    return None