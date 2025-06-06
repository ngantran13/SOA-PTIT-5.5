import jwt
import os
from dotenv import load_dotenv
import base64

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

def create_jwt_token(data: dict) -> str:
    secret_key = base64.urlsafe_b64decode(JWT_SECRET_KEY)
    token = jwt.encode(data, secret_key, algorithm="HS256")
    return token
