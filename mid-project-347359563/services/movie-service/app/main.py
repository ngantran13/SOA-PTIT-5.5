from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import movies, genres, showtimes

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Movie Service API",
    description="API for managing movies and genres",
    version="1.0.0",
)

app.include_router(movies.router)
app.include_router(genres.router)
app.include_router(showtimes.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Movie Service API!"}