from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/api/showtimes",
    tags=["showtimes"],
    responses={
        404: {"description": "Not Found"}
    }
)

@router.get("/", response_model=List[schemas.Showtime])
def get_showtimes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
):
    showtimes = db.query(models.Showtime).offset(skip).limit(limit).all()
    return showtimes

@router.get("/{showtime_id}", response_model=schemas.Showtime)
def get_showtime_by_id(
    showtime_id: int,
    db: Session = Depends(database.get_db),
):
    showtime = db.query(models.Showtime).filter(models.Showtime.showtime_id == showtime_id).first()
    if not showtime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Showtime not found")
    return showtime

@router.post("/", response_model=schemas.Showtime, status_code=status.HTTP_201_CREATED)
def create_showtime(
    showtime: schemas.ShowtimeCreate,
    db: Session = Depends(database.get_db),
):
    db_showtime = models.Showtime(
        name=showtime.name,
        theater=showtime.theater,
        starttime=showtime.starttime,
        endtime=showtime.endtime,
        price=showtime.price,
    )

    movie = db.query(models.Movie).filter(models.Movie.movie_id == showtime.movie_id).first()
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    db_showtime.movie = movie
    db.add(db_showtime)
    db.commit()
    db.refresh(db_showtime)
    return db_showtime

@router.put("/{showtime_id}", response_model=schemas.Showtime)
def update_showtime(
    showtime_id: int,
    showtime: schemas.ShowtimeUpdate,
    db: Session = Depends(database.get_db),
):
    db_showtime = db.query(models.Showtime).filter(models.Showtime.showtime_id == showtime_id).first()
    if not db_showtime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Showtime not found")
    
    for key, value in showtime.model_dump(exclude_unset=True, exclude={'movie_id'}).items():
        setattr(db_showtime, key, value)

    if showtime.movie_id:
        movie = db.query(models.Movie).filter(models.Movie.movie_id == showtime.movie_id).first()
        if not movie:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
        db_showtime.movie = movie
    
    db.commit()
    db.refresh(db_showtime)
    return db_showtime

@router.delete("/{showtime_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_showtime(
    showtime_id: int,
    db: Session = Depends(database.get_db),
):
    db_showtime = db.query(models.Showtime).filter(models.Showtime.showtime_id == showtime_id).first()
    if not db_showtime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Showtime not found")
    
    db.delete(db_showtime)
    db.commit()

@router.get("/movie/{movie_id}", response_model=List[schemas.ShowtimeOnly])
def get_showtimes_by_movie_id(
    movie_id: int,
    db: Session = Depends(database.get_db),
):
    showtimes = db.query(models.Showtime).filter(models.Showtime.movie_id == movie_id).all()
    if not showtimes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Showtimes not found")
    return showtimes