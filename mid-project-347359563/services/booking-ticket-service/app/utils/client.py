import os
import requests
from dotenv import load_dotenv
from typing import Dict, Any, Optional
import httpx

load_dotenv()

MOVIE_SERVICE_URL = os.getenv("MOVIE_SERVICE_URL")
SEAT_SERVICE_URL = os.getenv("SEAT_SERVICE_URL")
PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL")

class ServiceClient:

    @staticmethod
    def get_customer(customer_id: str) -> Optional[Dict[str, Any]]:
        """Get customer details from the customer service."""
        try:
            url = f"{MOVIE_SERVICE_URL}/customers/{customer_id}"
            response = requests.get(url)
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Error fetching customer: {e}")
            return None

    @staticmethod
    def get_showtime(showtime_id: str) -> Optional[Dict[str, Any]]:
        """Get showtime details from the movie service."""
        try:
            url = f"{MOVIE_SERVICE_URL}/showtimes/{showtime_id}"
            response = requests.get(url)
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Error fetching showtime: {e}")
            return None
    
    @staticmethod
    def get_seat(seat_id: str) -> Optional[Dict[str, Any]]:
        """Get seat details from the seat service."""
        try:
            url = f"{SEAT_SERVICE_URL}/seats/{seat_id}"
            response = requests.get(url)
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Error fetching seat: {e}")
            return None

    @staticmethod
    async def get_seat_status(seat_status_id: str) -> Optional[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient() as client:
                url = f"{SEAT_SERVICE_URL}/seat-status/{seat_status_id}"
                response = await client.get(url)
                if response.status_code == 200:
                    return response.json()
                return None
        except Exception as e:
            print(f"Error fetching seat status: {e}")
            return None
        
    @staticmethod
    def get_payment(payment_id: str) -> Optional[Dict[str, Any]]:
        """Get payment details from the payment service."""
        try:
            url = f"{PAYMENT_SERVICE_URL}/payments/{payment_id}"
            response = requests.get(url)
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Error fetching payment: {e}")
            return None