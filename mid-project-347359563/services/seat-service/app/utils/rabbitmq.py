import aio_pika
import json
from ..database import update_seat_status_on_receive_message, reserve_seat_on_receive_message

async def callback(message: aio_pika.IncomingMessage):
    async with message.process():
        try:
            event = json.loads(message.body.decode())
            print(f"Received message: {event}")

            if event['event'] == 'PAYMENT_NOTIFICATION':
                booking_ticket_id = event['booking_ticket_id']
                update_seat_status_on_receive_message(booking_ticket_id, event['status'])

            elif event['event'] == 'RESERVE_SEAT_NOTIFICATION':
                booking_ticket_id = event['booking_ticket_id']
                customer_id = event['customer_id']
                seat_status_ids = event['seat_status_ids']
                reserve_seat_on_receive_message(booking_ticket_id, customer_id, seat_status_ids)
                print(f"Reserved seats for booking ticket ID {booking_ticket_id}")
                
        except Exception as e:
            print(f"Lỗi xử lý message: {e}")