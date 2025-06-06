from sqlalchemy import Integer, String, Column, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import DateTime, ForeignKey
from .database import Base

class Genre(Base):
    __tablename__ = "genres"

    genre_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)
    movies = relationship("Movie", secondary="movie_genres", back_populates="genres")

class Movie(Base):
    __tablename__ = "movies"

    movie_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    release_date = Column(DateTime, nullable=True)
    duration = Column(Integer, nullable=True)
    rating = Column(Float, nullable=True)
    poster_url = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    genres = relationship("Genre", secondary="movie_genres", back_populates="movies")
    showtimes = relationship("Showtime", back_populates="movie")

class MovieGenre(Base):
    __tablename__ = "movie_genres"

    movie_id = Column(Integer, ForeignKey("movies.movie_id"), primary_key=True)
    genre_id = Column(Integer, ForeignKey("genres.genre_id"), primary_key=True)

class Showtime(Base):
    __tablename__ = "showtimes"

    showtime_id = Column(Integer, primary_key=True, autoincrement=True)
    movie_id = Column(Integer, ForeignKey("movies.movie_id"), nullable=False)
    name = Column(String(100), nullable=False)
    theater = Column(String(100), nullable=False)
    starttime = Column(DateTime, nullable=False)
    endtime = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    movie = relationship("Movie", back_populates="showtimes")