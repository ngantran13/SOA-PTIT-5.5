from fastapi import FastAPI
from .database import engine
from . import models
from .routers import booking_seats, booking_tickets
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
        queue = await channel.declare_queue("booking_ticket_queue")
        await queue.consume(callback=callback)
        print("Waiting for messages...")
        yield
    finally:
        await connection.close()
        print("RabbitMQ connection closed")

app = FastAPI(
    title="Booking Ticket Service",
    description="A service for booking tickets and seats",
    version="1.0.0",
    lifespan=rabbitmq_lifespan
)

app.include_router(booking_seats.router)
app.include_router(booking_tickets.router)

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the Booking Ticket Service"}

