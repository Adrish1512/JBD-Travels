import json
from datetime import datetime
from . import db

class Hotel(db.Model):
    __tablename__ = 'hotels'

    id = db.Column(db.Integer, primary_key=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=True)
    name = db.Column(db.String(150), nullable=False, index=True)
    city = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    stars = db.Column(db.Integer, nullable=False, default=4)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    standard_rate_per_night = db.Column(db.Float, nullable=False)  # Normal public rate
    is_partner = db.Column(db.Boolean, default=True)               # JBD Partner Hotel flag
    partner_discount_percent = db.Column(db.Float, default=15.0)   # Discount for JBD customers (e.g. 15%)
    jbd_commission_percent = db.Column(db.Float, default=12.0)     # Commission earned by JBD from hotel (e.g. 12%)
    amenities = db.Column(db.Text, nullable=True, default='[]')
    room_types = db.Column(db.Text, nullable=True, default='[]')
    nearby_attractions = db.Column(db.Text, nullable=True, default='[]')
    contact_email = db.Column(db.String(120), nullable=True)
    contact_phone = db.Column(db.String(50), nullable=True)
    rating = db.Column(db.Float, default=4.6)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_amenities_list(self):
        try:
            return json.loads(self.amenities) if self.amenities else []
        except Exception:
            return [a.strip() for a in self.amenities.split(',') if a.strip()]

    def set_amenities_list(self, amenities_list):
        self.amenities = json.dumps(amenities_list)

    def get_room_types_list(self):
        try:
            return json.loads(self.room_types) if self.room_types else []
        except Exception:
            return []

    def set_room_types_list(self, room_types_list):
        self.room_types = json.dumps(room_types_list)

    def get_nearby_attractions_list(self):
        try:
            return json.loads(self.nearby_attractions) if self.nearby_attractions else []
        except Exception:
            return []

    def set_nearby_attractions_list(self, attractions_list):
        self.nearby_attractions = json.dumps(attractions_list)

    @property
    def jbd_partner_rate(self):
        """Calculates special JBD negotiated rate after applying discount"""
        if not self.is_partner:
            return self.standard_rate_per_night
        discount_factor = 1.0 - (self.partner_discount_percent / 100.0)
        return round(self.standard_rate_per_night * max(0.0, discount_factor), 2)

    @property
    def savings_per_night(self):
        """Savings per night compared to standard public rate"""
        return round(self.standard_rate_per_night - self.jbd_partner_rate, 2)

    @property
    def commission_per_night(self):
        """JBD Travel agency commission earned per night"""
        return round(self.jbd_partner_rate * (self.jbd_commission_percent / 100.0), 2)

    def to_dict(self):
        return {
            'id': self.id,
            'destination_id': self.destination_id,
            'destination_name': self.destination.name if self.destination else self.city,
            'name': self.name,
            'city': self.city,
            'country': self.country,
            'address': self.address,
            'stars': self.stars,
            'description': self.description,
            'image_url': self.image_url,
            'standard_rate_per_night': self.standard_rate_per_night,
            'is_partner': self.is_partner,
            'partner_discount_percent': self.partner_discount_percent,
            'jbd_commission_percent': self.jbd_commission_percent,
            'jbd_partner_rate': self.jbd_partner_rate,
            'savings_per_night': self.savings_per_night,
            'commission_per_night': self.commission_per_night,
            'amenities': self.get_amenities_list(),
            'room_types': self.get_room_types_list(),
            'nearby_attractions': self.get_nearby_attractions_list(),
            'contact_email': self.contact_email or '',
            'contact_phone': self.contact_phone or '',
            'rating': self.rating,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
