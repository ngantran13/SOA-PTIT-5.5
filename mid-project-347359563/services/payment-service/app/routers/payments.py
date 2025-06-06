from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..utils.vnpay import create_payment_url, validate_vnpay_response
from fastapi.responses import RedirectResponse, JSONResponse
from ..utils.vnpay import send_payment_success_message, send_payment_fail_message
import os
from dotenv import load_dotenv
from ..database import save_payment_to_db, update_payment_status
import time
import uuid
load_dotenv()

vnp_HashSecret = os.getenv('VNP_HASH_SECRET')

router = APIRouter(
    prefix="/api/payments",
    tags=["Payments"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

@router.get("/", response_model=List[schemas.Payment])
def get_payments(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(database.get_db)
):
    payments = db.query(models.Payment).offset(skip).limit(limit).all()
    return payments

@router.get("/{payment_id}", response_model=schemas.Payment)
def get_payment_by_id(
    payment_id: int, 
    db: Session = Depends(database.get_db)
):
    payment = db.query(models.Payment).filter(models.Payment.payment_id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return payment

@router.post("/", response_model=schemas.Payment)
def create_payment(
    payment: schemas.PaymentCreate, 
    db: Session = Depends(database.get_db)
):
    db_payment = models.Payment(**payment.model_dump())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.put("/{payment_id}", response_model=schemas.Payment)
def update_payment(
    payment_id: int, 
    payment: schemas.PaymentUpdate, 
    db: Session = Depends(database.get_db)
):
    db_payment = db.query(models.Payment).filter(models.Payment.payment_id == payment_id).first()
    if not db_payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    
    for key, value in payment.model_dump(exclude_unset=True).items():
        setattr(db_payment, key, value)
    
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.delete("/{payment_id}", response_model=schemas.Payment)
def delete_payment(
    payment_id: int,
    db: Session = Depends(database.get_db)
):
    db_payment = db.query(models.Payment).filter(models.Payment.payment_id == payment_id).first()
    if not db_payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    
    db.delete(db_payment)
    db.commit()
    return None

@router.get("/pay/place")
def create_payment_vnpay(
    request: Request,
    booking_ticket_id: int,
    customer_id: int,
    full_name: str,
    email: str,
    amount: int
):
    
    timestamp = int(time.time())
    unique_id = str(uuid.uuid4().hex[:8])
    transaction_id = f"{booking_ticket_id}_{timestamp}_{unique_id}"
    
    client_ip = request.client.host
    save_payment_to_db({
        "transaction_id": transaction_id,
        "booking_ticket_id": booking_ticket_id,
        "customer_id": customer_id,
        "full_name": full_name,
        "email": email,
        "amount": amount,
    })
    payment_url = create_payment_url(amount, transaction_id, client_ip)
    print(f"Payment URL: {payment_url}")
    return RedirectResponse(url=payment_url)

@router.get("/pay/payment_return")
def payment_return(
    request: Request
):
    params = dict(request.query_params)
    if validate_vnpay_response(params, vnp_HashSecret):
        transaction_id = params.get("vnp_TxnRef")
        if params.get("vnp_ResponseCode") == "00":
            payment = update_payment_status(transaction_id, models.PaymentStatus.COMPLETED)
            send_payment_success_message(payment)
            
        else:
            payment = update_payment_status(transaction_id, models.PaymentStatus.FAILED)
            send_payment_fail_message(payment)
        
        url = os.getenv("FRONTEND_URL") + "/my-bookings/" + str(payment.booking_ticket_id)
        return RedirectResponse(url=url)
    else:
        return JSONResponse(content={"message": "Checksum không hợp lệ"})
    
