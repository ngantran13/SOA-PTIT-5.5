from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .routers import payments
from . import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Payment Service",
    description="API for handling payments",
    version="1.0.0",
)

app.include_router(payments.router)

@app.get("/", tags=["Root"])
def root():
    return {"message": "Welcome to the Payment Service API"}