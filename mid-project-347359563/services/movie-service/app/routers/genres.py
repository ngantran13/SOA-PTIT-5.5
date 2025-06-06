from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/api/genres",
    tags=["genres"],
    responses={
        404: {"description": "Not Found"}
    }
)

@router.get("/", response_model=List[schemas.Genre])
def get_genres(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
):
    genres = db.query(models.Genre).offset(skip).limit(limit).all()
    return genres

@router.get("/{genre_id}", response_model=schemas.Genre)
def get_genre_by_id(
    genre_id: int,
    db: Session = Depends(database.get_db),
):
    genre = db.query(models.Genre).filter(models.Genre.genre_id == genre_id).first()
    if not genre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Genre not found")
    return genre

@router.post("/", response_model=schemas.Genre, status_code=status.HTTP_201_CREATED)
def create_genre(
    genre: schemas.GenreCreate,
    db: Session = Depends(database.get_db),
):
    db_genre = db.query(models.Genre).filter(models.Genre.name == genre.name).first()
    if db_genre:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Genre already exists")
    db_genre = models.Genre(**genre.model_dump())
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

@router.put("/{genre_id}", response_model=schemas.Genre)
def update_genre(
    genre_id: int,
    genre: schemas.GenreCreate,
    db: Session = Depends(database.get_db),
):
    db_genre = db.query(models.Genre).filter(models.Genre.genre_id == genre_id).first()
    if not db_genre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Genre not found")
    db_genre.name = genre.name
    db.commit()
    db.refresh(db_genre)
    return db_genre

@router.delete("/{genre_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_genre(
    genre_id: int,
    db: Session = Depends(database.get_db),
):
    db_genre = db.query(models.Genre).filter(models.Genre.genre_id == genre_id).first()
    if not db_genre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Genre not found")
    db.delete(db_genre)
    db.commit()
    return None