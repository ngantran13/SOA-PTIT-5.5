from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/api/movies",
    tags=["movies"],
    responses={
        404: { "description": "Not Found"}}
)

@router.get("/", response_model=List[schemas.Movie])
def get_movies(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
):
    movies = db.query(models.Movie).offset(skip).limit(limit).all()
    return movies

@router.get("/{movie_id}", response_model=schemas.Movie)
def get_movie_by_id(
    movie_id: int,
    db: Session = Depends(database.get_db),
):
    movie = db.query(models.Movie).filter(models.Movie.movie_id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    return movie

@router.post("/", response_model=schemas.Movie, status_code=status.HTTP_201_CREATED)
def create_movie(
    movie: schemas.MovieCreate,
    db: Session = Depends(database.get_db),
):
    db_movie = models.Movie(
        title=movie.title,
        description=movie.description,
        release_date=movie.release_date,
        duration=movie.duration,
        rating=movie.rating,
        poster_url=movie.poster_url,
    )

    if movie.genres:
        genres = db.query(models.Genre).filter(models.Genre.genre_id.in_(movie.genres)).all()
        if not genres:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Genres not found")
        if len(genres) != len(movie.genres):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more genres not found"
            )
        db_movie.genres = genres

    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.put("/{movie_id}", response_model=schemas.Movie)
def update_movie(
    movie_id: int,
    movie: schemas.MovieUpdate,
    db: Session = Depends(database.get_db),
):
    db_movie = db.query(models.Movie).filter(models.Movie.movie_id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")

    for key, value in movie.model_dump(exclude_unset=True, exclude={"genres"}).items():
        setattr(db_movie, key, value)

    if movie.genres is not None:
        genres = db.query(models.Genre).filter(models.Genre.genre_id.in_(movie.genres)).all()
        if not genres:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Genres not found")
        if len(genres) != len(movie.genres):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more genres not found"
            )
        db_movie.genres = genres

    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_movie(
    movie_id: int,
    db: Session = Depends(database.get_db),
):
    db_movie = db.query(models.Movie).filter(models.Movie.movie_id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")

    db.delete(db_movie)
    db.commit()
    return None

