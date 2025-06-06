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

def save_payment_to_db(data):
    db = SessionLocal()
    try:
        from .models import Payment
        print("Lưu payment vào DB:", data)
        payment = Payment(
            transaction_id=data["transaction_id"],
            booking_ticket_id=data["booking_ticket_id"],
            customer_id=data["customer_id"],
            full_name=data["full_name"],
            email=data["email"],
            payment_method="vnpay",
            amount=float(data["amount"])
        )
        db.add(payment)
        db.commit()
    except Exception as e:
        db.rollback()
        print("Lỗi lưu payment:", e)
    finally:
        db.close()

def update_payment_status(transaction_id, status):
    db = SessionLocal()
    try:
        from .models import Payment
        payment = db.query(Payment).filter(Payment.transaction_id == transaction_id).first()
        if payment:
            payment.payment_status = status
            db.commit()
            db.refresh(payment)
            return payment
        else:
            print("Không tìm thấy payment với transaction_id:", transaction_id)
    except Exception as e:
        db.rollback()
        print("Lỗi cập nhật trạng thái payment:", e)
    finally:
        db.close()


