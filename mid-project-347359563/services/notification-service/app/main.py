from fastapi import FastAPI
from .database import engine
from . import models
from .routers import notifications
from .utils.rabbitmq import callback
from contextlib import asynccontextmanager
import aio_pika
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
        queue = await channel.declare_queue("notification_queue")
        await queue.consume(callback=callback)
        print("Waiting for messages...")
        yield
    finally:
        await connection.close()
        print("RabbitMQ connection closed")

app = FastAPI(
    title="Notification Service",
    description="A service to manage notifications for users.",
    version="1.0.0",
    lifespan=rabbitmq_lifespan
)

app.include_router(notifications.router)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Notification Service!"}