from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
import os
from .. import models, schemas, database
from dotenv import load_dotenv

load_dotenv()

MOVIE_SERVICE_URL = os.getenv("MOVIE_SERVICE_URL")

router = APIRouter(
    prefix="/api/seat-status",
    tags=["SeatStatus"],
    responses={404: {"description": "Not found"},
               500: {"description": "Internal server error"},},
)

@router.get("/", response_model=List[schemas.SeatStatus])
def get_seat_statuses(
    db: Session = Depends(database.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
):
    seat_statuses = db.query(models.SeatStatus).offset(skip).limit(limit).all()
    
    return seat_statuses

@router.get("/{seat_status_id}", response_model=schemas.SeatStatus)
def get_seat_status(
    seat_status_id: int,
    db: Session = Depends(database.get_db),
):
    seat_status = db.query(models.SeatStatus).filter(models.SeatStatus.seat_status_id == seat_status_id).first()
    
    if not seat_status:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat status not found")
    
    return seat_status

@router.post("/", response_model=schemas.SeatStatus, status_code=status.HTTP_201_CREATED)
def create_seat_status(
    seat_status: schemas.SeatStatusCreate,
    db: Session = Depends(database.get_db),
):
    db_seat_status = models.SeatStatus(**seat_status.model_dump())
    db.add(db_seat_status)
    db.commit()
    db.refresh(db_seat_status)
    
    return db_seat_status

@router.put("/{seat_status_id}", response_model=schemas.SeatStatus)
def update_seat_status(
    seat_status_id: int,
    seat_status: schemas.SeatStatusUpdate,
    db: Session = Depends(database.get_db),
):
    db_seat_status = db.query(models.SeatStatus).filter(models.SeatStatus.seat_status_id == seat_status_id).first()
    
    if not db_seat_status:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat status not found")
    
    for key, value in seat_status.model_dump(exclude_unset=True).items():
        setattr(db_seat_status, key, value)
    
    db.commit()
    db.refresh(db_seat_status)
    
    return db_seat_status

@router.delete("/{seat_status_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_seat_status(
    seat_status_id: int,
    db: Session = Depends(database.get_db),
):
    db_seat_status = db.query(models.SeatStatus).filter(models.SeatStatus.seat_status_id == seat_status_id).first()
    
    if not db_seat_status:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat status not found")
    
    db.delete(db_seat_status)
    db.commit()
    return None

@router.put("/{seat_status_id}/reserve", response_model=schemas.SeatStatus)
def reserve_seat_status(
    seat_status_id: int,
    seat_status: schemas.SeatStatusReverse,
    db: Session = Depends(database.get_db),
):
    db_seat_status = db.query(models.SeatStatus).filter(models.SeatStatus.seat_status_id == seat_status_id).first()
    if not db_seat_status:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat status not found")
    
    db_seat_status.customer_id = seat_status.customer_id
    db_seat_status.status = models.SeatStatusType.RESERVED
    db_seat_status.booking_ticket_id = seat_status.booking_ticket_id
    
    db.commit()
    db.refresh(db_seat_status)
    
    return db_seat_status

@router.put("/{seat_status_id}/cancel", response_model=schemas.SeatStatus)
def cancel_seat_status(
    seat_status_id: int,
    db: Session = Depends(database.get_db),
):
    db_seat_status = db.query(models.SeatStatus).filter(models.SeatStatus.seat_status_id == seat_status_id).first()
    
    if not db_seat_status:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat status not found")
    
    db_seat_status.customer_id = None
    db_seat_status.status = models.SeatStatusType.AVAILABLE
    db_seat_status.booking_ticket_id = None
    
    db.commit()
    db.refresh(db_seat_status)
    
    return db_seat_status

@router.get("/showtime/{showtime_id}", response_model=List[schemas.SeatStatus])
def get_seat_status_by_showtime(
    showtime_id: int,
    db: Session = Depends(database.get_db),
):
    seat_statuses = db.query(models.SeatStatus).filter(models.SeatStatus.showtime_id == showtime_id).all()
    
    if not seat_statuses:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat statuses not found")
    
    return seat_statuses
