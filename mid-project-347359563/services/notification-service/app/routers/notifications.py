from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

@router.get("/", response_model=List[schemas.Notification])
def get_notifications(
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100
):
    notifications = db.query(models.Notification).offset(skip).limit(limit).all()
    return notifications

@router.get("/{notification_id}", response_model=schemas.Notification)
def get_notification(
    notification_id: int,
    db: Session = Depends(database.get_db)
):
    notification = db.query(models.Notification).filter(models.Notification.notification_id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notification

@router.post("/", response_model=schemas.Notification, status_code=status.HTTP_201_CREATED)
def create_notification(
    notification: schemas.NotificationCreate,
    db: Session = Depends(database.get_db)
):
    db_notification = models.Notification(**notification.model_dump())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

@router.put("/{notification_id}", response_model=schemas.Notification)
def update_notification(
    notification_id: int,
    notification: schemas.NotificationUpdate,
    db: Session = Depends(database.get_db)
):
    db_notification = db.query(models.Notification).filter(models.Notification.notification_id == notification_id).first()
    if not db_notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    
    for key, value in notification.model_dump(exclude_unset=True).items():
        setattr(db_notification, key, value)
    
    db.commit()
    db.refresh(db_notification)
    return db_notification

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    db: Session = Depends(database.get_db)
):
    db_notification = db.query(models.Notification).filter(models.Notification.notification_id == notification_id).first()
    if not db_notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    
    db.delete(db_notification)
    db.commit()
    return None