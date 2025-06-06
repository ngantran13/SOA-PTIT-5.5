import aio_pika
import json
from ..database import update_booking_ticket_on_receive_message
import os
from dotenv import load_dotenv

load_dotenv()
RABBITMQ_URL = os.getenv("RABBITMQ_URL")

async def callback(message: aio_pika.IncomingMessage) -> None:
    async with message.process():
        try:
            event = json.loads(message.body.decode())
            print(f"Received message: {event}")

            if event['event'] == 'PAYMENT_NOTIFICATION':
                booking_ticket_id = event['booking_ticket_id']
                update_booking_ticket_on_receive_message(booking_ticket_id, event['payment_id'], event['status'])

        except Exception as e:
            print(f"Error processing message: {e}")


async def send_message_to_queue(queue_name: str, message: dict) -> None:

    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    async with connection.channel() as channel:
        await channel.default_exchange.publish(
            aio_pika.Message(body=json.dumps(message).encode()),
            routing_key=queue_name,
        )
    print(f"Sent message to queue {queue_name}: {message}")

