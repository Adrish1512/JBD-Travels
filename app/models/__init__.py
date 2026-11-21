from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .destination import Destination, TouristAttraction
from .hotel import Hotel
from .flight import FlightOffer
from .itinerary import Itinerary
from .booking import BookingInquiry
from .travel_doc import TravelDocRequirement
from .settings import SystemSetting

__all__ = [
    'db',
    'User',
    'Destination',
    'TouristAttraction',
    'Hotel',
    'FlightOffer',
    'Itinerary',
    'BookingInquiry',
    'TravelDocRequirement',
    'SystemSetting'
]
