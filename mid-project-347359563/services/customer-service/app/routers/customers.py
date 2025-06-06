from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..utils.jwt import create_jwt_token
from time import time
router = APIRouter(
    prefix="/api/customers",
    tags=["customers"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

@router.get("/", response_model=List[schemas.Customer])
def get_list_customer(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    customers = db.query(models.Customer).offset(skip).limit(limit).all()
    return customers

@router.get("/{customer_id}", response_model=schemas.Customer)
def get_customer_by_id(
    customer_id: int,
    db: Session = Depends(database.get_db)
):
    customer = db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer

@router.post("/", response_model=schemas.Customer)
def create_customer(
    customer: schemas.CustomerCreate,
    db: Session = Depends(database.get_db)
):
    db_customer = db.query(models.Customer).filter(models.Customer.email == customer.email).first()
    if db_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@router.put("/{customer_id}", response_model=schemas.Customer)
def update_customer(
    customer_id: int,
    customer: schemas.CustomerUpdate,
    db: Session = Depends(database.get_db)
):
    db_customer = db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    
    for key, value in customer.model_dump(exclude_unset=True).items():
        setattr(db_customer, key, value)
    
    db.commit()
    db.refresh(db_customer)
    return db_customer

@router.delete("/{customer_id}", response_model=schemas.Customer)
def delete_customer(
    customer_id: int,
    db: Session = Depends(database.get_db)
):
    db_customer = db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    
    db.delete(db_customer)
    db.commit()
    return db_customer

@router.post("/login")
def login(
    customer: schemas.CustomerLogin,
    db: Session = Depends(database.get_db)
):
    db_customer = db.query(models.Customer).filter(models.Customer.email == customer.email).first()
    if not db_customer or db_customer.password != customer.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    data = {
        "customer_id": db_customer.customer_id,
        "email": db_customer.email,
        "full_name": db_customer.full_name,
        "iat": int(time()),
        "exp": int(time()) + 3600 * 24 * 30
    }

    token = create_jwt_token(data)

    return {"message": "Login successful", 
            "id": db_customer.customer_id, 
            "full_name": db_customer.full_name, 
            "email": db_customer.email,
            "phone_number": db_customer.phone_number,
            "address": db_customer.address,
            "token": token}
