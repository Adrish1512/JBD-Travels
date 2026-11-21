import json
from datetime import datetime
from . import db

class Itinerary(db.Model):
    __tablename__ = 'itineraries'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    title = db.Column(db.String(150), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=True)
    destination_name = db.Column(db.String(120), nullable=False)
    origin_city = db.Column(db.String(100), default='New York')
    start_date = db.Column(db.String(30), nullable=True)
    duration_days = db.Column(db.Integer, nullable=False, default=5)
    travelers_count = db.Column(db.Integer, nullable=False, default=1)
    total_budget = db.Column(db.Float, nullable=False)
    estimated_cost = db.Column(db.Float, nullable=False)
    travel_style = db.Column(db.String(100), default='Cultural & Sightseeing')  # e.g. Adventure, Relax, Cultural
    accommodation_tier = db.Column(db.String(50), default='Comfort (3-4 Star)')

    # JSON Serialized complex details
    cost_breakdown = db.Column(db.Text, nullable=False)  # {"flights": 500, "hotel": 600, "activities": 300, "food": 250, "contingency": 100}
    daily_schedule = db.Column(db.Text, nullable=False)  # List of days with morning, afternoon, evening activities
    selected_flight = db.Column(db.Text, nullable=True)  # JSON flight object
    selected_hotel = db.Column(db.Text, nullable=True)   # JSON hotel object
    user_notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), default='Saved')   # 'Draft', 'Saved', 'Inquired', 'Confirmed', 'Completed'
    is_customized = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    inquiries = db.relationship('BookingInquiry', backref='itinerary', lazy='dynamic', cascade='all, delete-orphan')

    def get_cost_breakdown(self):
        try:
            return json.loads(self.cost_breakdown) if self.cost_breakdown else {}
        except Exception:
            return {}

    def set_cost_breakdown(self, breakdown_dict):
        self.cost_breakdown = json.dumps(breakdown_dict)

    def get_daily_schedule(self):
        try:
            return json.loads(self.daily_schedule) if self.daily_schedule else []
        except Exception:
            return []

    def set_daily_schedule(self, schedule_list):
        self.daily_schedule = json.dumps(schedule_list)

    def get_selected_flight(self):
        try:
            return json.loads(self.selected_flight) if self.selected_flight else None
        except Exception:
            return None

    def set_selected_flight(self, flight_dict):
        self.selected_flight = json.dumps(flight_dict) if flight_dict else None

    def get_selected_hotel(self):
        try:
            return json.loads(self.selected_hotel) if self.selected_hotel else None
        except Exception:
            return None

    def set_selected_hotel(self, hotel_dict):
        self.selected_hotel = json.dumps(hotel_dict) if hotel_dict else None

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'customer_name': self.user.full_name if self.user else 'Guest Traveler',
            'customer_email': self.user.email if self.user else 'guest@traveler.com',
            'title': self.title,
            'destination_id': self.destination_id,
            'destination_name': self.destination_name,
            'origin_city': self.origin_city,
            'start_date': self.start_date,
            'duration_days': self.duration_days,
            'travelers_count': self.travelers_count,
            'total_budget': self.total_budget,
            'estimated_cost': self.estimated_cost,
            'budget_variance': round(self.total_budget - self.estimated_cost, 2),
            'travel_style': self.travel_style,
            'accommodation_tier': self.accommodation_tier,
            'cost_breakdown': self.get_cost_breakdown(),
            'daily_schedule': self.get_daily_schedule(),
            'selected_flight': self.get_selected_flight(),
            'selected_hotel': self.get_selected_hotel(),
            'user_notes': self.user_notes or '',
            'status': self.status,
            'is_customized': self.is_customized,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
