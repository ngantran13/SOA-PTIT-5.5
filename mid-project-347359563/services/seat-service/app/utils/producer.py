import pika
import json

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
channel.queue_declare(queue='seat_queue')
event = {
    "event": "RESERVE_SEAT_NOTIFICATION",
    "booking_ticket_id": 1,
    "customer_id": 1,
    "seat_status_ids": [1, 2, 3],
}
channel.basic_publish(
    exchange='',
    routing_key='seat_queue',
    body=json.dumps(event),
)

print(f"Sent message to queue seat_queue: {event}")