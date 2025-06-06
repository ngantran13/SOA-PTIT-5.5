from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CustomerBase(BaseModel):
    full_name: str
    email: str
    password: str
    phone_number: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

class CustomerInDB(CustomerBase):
    customer_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Customer(CustomerInDB):
    pass

class CustomerLogin(BaseModel):
    email: str
    password: str