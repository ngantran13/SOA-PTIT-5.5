from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .routers import customers
from . import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Customer Service API",
    description="API for managing customer data",
    version="1.0.0"
)

app.include_router(customers.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Customer Service API!"}