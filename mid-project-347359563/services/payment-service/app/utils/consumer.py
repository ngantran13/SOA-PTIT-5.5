import pika, json

def callback(ch, method, properties, body):
    data = json.loads(body)
    print("Received message:", data)

def start_consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='PAYMENT_SERVICE')
    channel.basic_consume(queue='PAYMENT_SERVICE', on_message_callback=callback)
    channel.start_consuming()

if __name__ == "__main__":
    start_consumer()
