import hashlib
import hmac
import urllib.parse
from datetime import datetime
import os
from dotenv import load_dotenv
from ..utils.rabbitmq import send_message_to_queue

load_dotenv()

vnp_TmnCode = os.getenv('VNP_TMN_CODE')
vnp_HashSecret = os.getenv('VNP_HASH_SECRET')
vnp_Url = os.getenv('VNP_URL')
vnp_ReturnUrl = os.getenv('VNP_RETURN_URL')

def hmacsha512(key, data):
    return hmac.new(key.encode('utf-8'), data.encode('utf-8'), hashlib.sha512).hexdigest()

def create_payment_url(amount, order_id, ip_address):
    vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_Amount': str(amount * 100),  # nhân 100
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': order_id,
        'vnp_OrderInfo': f'Thanh toan don hang {order_id}',
        'vnp_OrderType': 'other',
        'vnp_Locale': 'vn',
        'vnp_ReturnUrl': vnp_ReturnUrl,
        'vnp_IpAddr': ip_address,
        'vnp_CreateDate': datetime.now().strftime('%Y%m%d%H%M%S')
    }

    sorted_params = sorted(vnp_Params.items())
    query_string = ''
    hash_data = ''
    for idx, (key, value) in enumerate(sorted_params):
        encoded_value = urllib.parse.quote_plus(str(value))
        if idx != 0:
            query_string += '&'
            hash_data += '&'
        query_string += f"{key}={encoded_value}"
        hash_data += f"{key}={encoded_value}"

    secure_hash = hmacsha512(vnp_HashSecret, hash_data)
    payment_url = f"{vnp_Url}?{query_string}&vnp_SecureHash={secure_hash}"
    return payment_url

def validate_vnpay_response(params: dict, secret_key: str) -> bool:
    received_hash = params.pop("vnp_SecureHash", None)
    params.pop("vnp_SecureHashType", None)

    sorted_params = sorted(params.items())
    hash_data = '&'.join(f"{k}={urllib.parse.quote_plus(str(v))}" for k, v in sorted_params)

    secure_hash = hmac.new(
        secret_key.encode("utf-8"),
        hash_data.encode("utf-8"),
        hashlib.sha512
    ).hexdigest()

    return secure_hash == received_hash

def send_payment_success_message(data):
    
    message = {
        "event": "PAYMENT_NOTIFICATION",
        "booking_ticket_id": data.booking_ticket_id,
        "payment_id": data.payment_id,
        "customer_id": data.customer_id,
        "status": "success",
        "email": data.email,
    }

    send_message_to_queue("booking_ticket_queue", message)
    send_message_to_queue("seat_queue", message)
    send_message_to_queue("notification_queue", message)

    print("Đã gửi message payment success to notification_queue đến RabbitMQ")

def send_payment_fail_message(data):
    message = {
        "event": "PAYMENT_NOTIFICATION",
        "booking_ticket_id": data.booking_ticket_id,
        "payment_id": data.payment_id,
        "customer_id": data.customer_id,
        "status": "fail",
        "email": data.email,
    }

    send_message_to_queue("booking_ticket_queue", message)
    send_message_to_queue("seat_queue", message)
    send_message_to_queue("notification_queue", message)
    print("Đã gửi message payment fail to notification_queue đến RabbitMQ")
