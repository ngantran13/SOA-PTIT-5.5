from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import seats, seat_statuses
from contextlib import asynccontextmanager
import aio_pika
from .utils.rabbitmq import callback
import os
from dotenv import load_dotenv

load_dotenv()

models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def rabbitmq_lifespan(app: FastAPI):
    connection = await aio_pika.connect_robust(
        os.getenv("RABBITMQ_URL"),
    )
    print("Connected to RabbitMQ")

    try:
        channel = await connection.channel()
        queue = await channel.declare_queue("seat_queue")
        await queue.consume(callback=callback)
        print("Waiting for messages...")
        yield
    finally:
        await connection.close()
        print("RabbitMQ connection closed")

app = FastAPI(
    title="Seat Service API",
    description="API for managing seat reservations and statuses",
    version="1.0.0",
    lifespan=rabbitmq_lifespan
)

app.include_router(seats.router)
app.include_router(seat_statuses.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Seat Service API!"}