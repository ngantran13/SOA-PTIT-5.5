from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/api/seats",
    tags=["Seats"],
    responses={404: {"description": "Not found"},
               500: {"description": "Internal server error"},},
)

@router.get("/", response_model=List[schemas.Seat])
def get_seats(
    db: Session = Depends(database.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
) -> List[schemas.Seat]:
    seats = db.query(models.Seat).offset(skip).limit(limit).all()
    
    return seats

@router.get("/{seat_id}", response_model=schemas.Seat)
def get_seat(
    seat_id: int,
    db: Session = Depends(database.get_db),
):
    seat = db.query(models.Seat).filter(models.Seat.seat_id == seat_id).first()
    
    if not seat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat not found")
    
    return seat

@router.post("/", response_model=schemas.Seat, status_code=status.HTTP_201_CREATED)
def create_seat(
    seat: schemas.SeatCreate,
    db: Session = Depends(database.get_db),
):
    db_seat = models.Seat(**seat.model_dump())
    db.add(db_seat)
    db.commit()
    db.refresh(db_seat)
    
    return db_seat

@router.put("/{seat_id}", response_model=schemas.Seat)
def update_seat(
    seat_id: int,
    seat: schemas.SeatUpdate,
    db: Session = Depends(database.get_db),
):
    db_seat = db.query(models.Seat).filter(models.Seat.seat_id == seat_id).first()
    
    if not db_seat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat not found")
    
    for key, value in seat.model_dump(exclude_unset=True).items():
        setattr(db_seat, key, value)
    
    db.commit()
    db.refresh(db_seat)
    
    return db_seat

@router.delete("/{seat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_seat(
    seat_id: int,
    db: Session = Depends(database.get_db),
):
    db_seat = db.query(models.Seat).filter(models.Seat.seat_id == seat_id).first()
    
    if not db_seat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat not found")
    
    db.delete(db_seat)
    db.commit()
    return None

@router.get("/booking/{booking_ticket_id}", response_model=List[schemas.Seat])
def get_seats_by_booking(
    booking_ticket_id: int,
    db: Session = Depends(database.get_db),
):
    seat_statuses = db.query(models.SeatStatus).filter(
        models.SeatStatus.booking_ticket_id == booking_ticket_id
    ).all()
    
    if not seat_statuses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"No seats found for booking ticket ID {booking_ticket_id}"
        )
    
    result = []
    for seat_status in seat_statuses:
        seat = db.query(models.Seat).filter(models.Seat.seat_id == seat_status.seat_id).first()
        if seat:
            result.append(seat)
    
    return result