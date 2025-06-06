from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..utils.client import ServiceClient
from ..utils.rabbitmq import send_message_to_queue
import asyncio

router = APIRouter(
    prefix="/api/booking-tickets",
    tags=["Booking Tickets"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

async def send_message_reserve_seat(booking_ticket_id: int, customer_id: int, seat_status_ids: List[int]):
    message = {
        "event": "RESERVE_SEAT_NOTIFICATION",
        "booking_ticket_id": booking_ticket_id,
        "customer_id": customer_id,
        "seat_status_ids": seat_status_ids,
    }
    await send_message_to_queue("seat_queue", message)
    print("Send message successfully to RabbitMQ")

@router.get("/", response_model=List[schemas.BookingTicket])
def get_booking_tickets(
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100
):
    
    booking_tickets = db.query(models.BookingTicket).offset(skip).limit(limit).all()
    return booking_tickets

@router.get("/{booking_ticket_id}", response_model=schemas.BookingTicket)
def get_booking_ticket(
    booking_ticket_id: int,
    db: Session = Depends(database.get_db)
):
    
    booking_ticket = db.query(models.BookingTicket).filter(models.BookingTicket.booking_ticket_id == booking_ticket_id).first()
    if not booking_ticket:
        raise HTTPException(status_code=404, detail="Booking ticket not found")
    return booking_ticket

@router.post("/", response_model=schemas.BookingTicket)
async def create_booking_ticket(
    booking_ticket: schemas.BookingTicketCreate,
    db: Session = Depends(database.get_db),
):
    new_booking_ticket = models.BookingTicket(
        customer_id=booking_ticket.customer_id,
        showtime_id=booking_ticket.showtime_id,
        total_amount=booking_ticket.total_amount,
    )
    db.add(new_booking_ticket)
    db.commit()
    db.refresh(new_booking_ticket)

    asyncio.create_task(
        send_message_reserve_seat(
            booking_ticket_id=new_booking_ticket.booking_ticket_id,
            customer_id=booking_ticket.customer_id,
            seat_status_ids=booking_ticket.seat_status_ids,
        )
    )

    # Create booking seats
    booking_seats = [
        models.BookingSeat(booking_ticket_id=new_booking_ticket.booking_ticket_id, seat_status_id=seat_status_id)
        for seat_status_id in booking_ticket.seat_status_ids
    ]
    db.add_all(booking_seats)
    db.commit()
    return new_booking_ticket

@router.put("/{booking_ticket_id}", response_model=schemas.BookingTicket)
def update_booking_ticket(
    booking_ticket_id: int,
    booking_ticket: schemas.BookingTicketUpdate,
    db: Session = Depends(database.get_db),
):
    
    existing_booking_ticket = db.query(models.BookingTicket).filter(models.BookingTicket.booking_ticket_id == booking_ticket_id).first()
    if not existing_booking_ticket:
        raise HTTPException(status_code=404, detail="Booking ticket not found")

    for key, value in booking_ticket.model_dump(exclude_unset=True).items():
        setattr(existing_booking_ticket, key, value)

    db.commit()
    db.refresh(existing_booking_ticket)
    return existing_booking_ticket

@router.delete("/{booking_ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking_ticket(
    booking_ticket_id: int,
    db: Session = Depends(database.get_db),
):
    
    existing_booking_ticket = db.query(models.BookingTicket).filter(models.BookingTicket.booking_ticket_id == booking_ticket_id).first()
    if not existing_booking_ticket:
        raise HTTPException(status_code=404, detail="Booking ticket not found")

    db.delete(existing_booking_ticket)
    db.commit()
    return None

@router.get("/customer/{customer_id}", response_model=List[schemas.BookingTicket])
def get_booking_tickets_by_customer(
    customer_id: int,
    db: Session = Depends(database.get_db),
):
    
    booking_tickets = db.query(models.BookingTicket).filter(models.BookingTicket.customer_id == customer_id).all()
    if not booking_tickets:
        raise HTTPException(status_code=404, detail="Booking tickets not found")
    
    return booking_tickets