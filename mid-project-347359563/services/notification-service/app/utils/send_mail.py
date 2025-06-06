from aiosmtplib import SMTP
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv
load_dotenv()

smtp_server = os.getenv("SMTP_SERVER")
port = 587
email = os.getenv("EMAIL")
password = os.getenv("PASSWORD")

def save_mail_to_notification():
    pass

async def send_email_async(subject: str, body: str, to_email: str):
    message = MIMEText(body, "plain", "utf-8")
    message['Subject'] = subject
    message['From'] = email
    message['To'] = to_email

    
    try:
        async with SMTP(hostname=smtp_server, port=port) as smtp:
            await smtp.login(email, password)
            await smtp.send_message(message)
            print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")


