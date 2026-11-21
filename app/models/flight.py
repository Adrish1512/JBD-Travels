from datetime import datetime
from . import db

class FlightOffer(db.Model):
    __tablename__ = 'flight_offers'

    id = db.Column(db.Integer, primary_key=True)
    origin_code = db.Column(db.String(10), nullable=False, index=True)      # e.g. 'JFK', 'LHR', 'DXB'
    origin_city = db.Column(db.String(100), nullable=False)
    destination_code = db.Column(db.String(10), nullable=False, index=True) # e.g. 'HND', 'CDG', 'DPS'
    destination_city = db.Column(db.String(100), nullable=False)
    airline_name = db.Column(db.String(100), nullable=False)
    airline_logo = db.Column(db.String(500), nullable=True)
    flight_number = db.Column(db.String(20), nullable=False)
    departure_time = db.Column(db.String(20), nullable=False)               # e.g. "08:30"
    arrival_time = db.Column(db.String(20), nullable=False)                 # e.g. "16:45"
    duration_minutes = db.Column(db.Integer, nullable=False)               # e.g. 495
    stops = db.Column(db.Integer, default=0)                               # 0 = Direct, 1 = 1 stop, 2 = 2 stops
    stop_cities = db.Column(db.String(100), nullable=True)                 # e.g. "Doha (DOH)"
    cabin_class = db.Column(db.String(30), default='Economy')              # Economy, Premium Economy, Business
    base_price_usd = db.Column(db.Float, nullable=False)
    tax_usd = db.Column(db.Float, default=45.0)
    baggage_allowance = db.Column(db.String(100), default='1 x 23kg checked bag + 1 carry-on')
    is_simulated = db.Column(db.Boolean, default=True)                     # Flag required by spec
    data_source_label = db.Column(db.String(100), default='JBD Global Flight GDS (Simulated API)')
    aircraft_type = db.Column(db.String(80), default='Boeing 787 Dreamliner')
    available_seats = db.Column(db.Integer, default=9)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def total_price_usd(self):
        return round(self.base_price_usd + self.tax_usd, 2)

    @property
    def duration_formatted(self):
        hours = self.duration_minutes // 60
        mins = self.duration_minutes % 60
        return f"{hours}h {mins}m"

    def to_dict(self):
        return {
            'id': self.id,
            'origin_code': self.origin_code,
            'origin_city': self.origin_city,
            'destination_code': self.destination_code,
            'destination_city': self.destination_city,
            'airline_name': self.airline_name,
            'airline_logo': self.airline_logo or '',
            'flight_number': self.flight_number,
            'departure_time': self.departure_time,
            'arrival_time': self.arrival_time,
            'duration_minutes': self.duration_minutes,
            'duration_formatted': self.duration_formatted,
            'stops': self.stops,
            'stop_cities': self.stop_cities or 'Non-stop',
            'cabin_class': self.cabin_class,
            'base_price_usd': self.base_price_usd,
            'tax_usd': self.tax_usd,
            'total_price_usd': self.total_price_usd,
            'baggage_allowance': self.baggage_allowance,
            'is_simulated': self.is_simulated,
            'data_source_label': self.data_source_label,
            'aircraft_type': self.aircraft_type,
            'available_seats': self.available_seats
        }
