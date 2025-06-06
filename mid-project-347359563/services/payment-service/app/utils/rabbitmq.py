import pika
import json
import os
from dotenv import load_dotenv

load_dotenv()

def send_message_to_queue(queue_name, message):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=os.getenv('RABBITMQ_URL')))

    channel = connection.channel()

    channel.queue_declare(queue=queue_name)

    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        body=json.dumps(message)
    )

    print(f" [x] Sent {message}")

    connection.close()