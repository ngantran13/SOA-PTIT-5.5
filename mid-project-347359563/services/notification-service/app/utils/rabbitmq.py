import asyncio
import aio_pika
import json
from .send_mail import send_email_async
from ..database import create_notification

def save_notification_to_db(event, subject, body):
    notification = {
        'customer_id': event['customer_id'],
        'booking_id': event['booking_ticket_id'],
        'notification_type': event['status'],
        'subject': subject,
        'message': body,
        'details': None
    }
    create_notification(notification_data=notification)
    print(f"Saved notification to DB: {notification}")


async def callback(message: aio_pika.IncomingMessage):
    async with message.process():
        try:
            event = json.loads(message.body.decode())
            print(f"Received message: {event}")
            
            if event['event'] == 'PAYMENT_NOTIFICATION':
                if event['status'] == 'success':
                    subject = "Payment Successful"
                    body = f"Your payment with Booking ID: {event['booking_ticket_id']} was successful."
                else:
                    subject = "Payment Failed"
                    body = f"Your payment with Booking ID: {event['booking_ticket_id']} failed. Please try again."
                
                save_notification_to_db(event, subject, body)

                task = asyncio.create_task(
                    send_email_async(
                        subject=subject,
                        body=body,
                        to_email=event['email']
                    )
                )
                task.add_done_callback(
                    lambda t: print("Task done!") if not t.exception() else print(f"Error: {t.exception()}")
                )
            print(f"Đã kích hoạt task gửi email cho event: {event['event']}")
        except Exception as e:
            print(f"Lỗi xử lý message: {e}")
