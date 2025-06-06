from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime

class GenreBase(BaseModel):
    name: str

class GenreCreate(GenreBase):
    pass

class Genre(GenreBase):
    genre_id: int

    class Config:
        from_attributes = True

class MovieBase(BaseModel):
    title: str
    description: Optional[str] = None
    release_date: Optional[datetime] = None
    duration: Optional[int] = None
    rating: Optional[float] = Field(None, ge=0, le=10)
    poster_url: Optional[HttpUrl] = None

class MovieCreate(MovieBase):
    genres: List[int] = []

class MovieUpdate(MovieBase):
    title: Optional[str] = None
    description: Optional[str] = None
    release_date: Optional[datetime] = None
    duration: Optional[int] = None
    rating: Optional[float] = Field(None, ge=0, le=10)
    poster_url: Optional[HttpUrl] = None
    genres: Optional[List[int]] = None

class Movie(MovieBase):
    movie_id: int
    created_at: datetime
    updated_at: datetime
    genres: List[Genre] = []

    class Config:
        from_attributes = True

class ShowtimeBase(BaseModel):
    name: str
    theater: str
    starttime: datetime
    endtime: datetime
    price: float = Field(..., ge=0)


    class Config:
        from_attributes = True

class ShowtimeCreate(ShowtimeBase):
    movie_id: int

class ShowtimeUpdate(ShowtimeBase):
    movie_id: Optional[int] = None
    name: Optional[str] = None
    theater: Optional[str] = None
    starttime: Optional[datetime] = None
    endtime: Optional[datetime] = None

class Showtime(ShowtimeBase):
    showtime_id: int
    created_at: datetime
    updated_at: datetime
    movie: Movie

    class Config:
        from_attributes = True

class ShowtimeOnly(ShowtimeBase):
    showtime_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
