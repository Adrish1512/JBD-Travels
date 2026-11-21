import json
from datetime import datetime
from . import db

class Destination(db.Model):
    __tablename__ = 'destinations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True, index=True)
    city = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    continent = db.Column(db.String(50), nullable=False)
    airport_code = db.Column(db.String(10), nullable=False, default='XXX')
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    banner_url = db.Column(db.String(500), nullable=True)
    best_time_to_visit = db.Column(db.String(120), nullable=False)
    climate = db.Column(db.String(80), nullable=False)
    avg_cost_per_day_budget = db.Column(db.Float, default=70.0)    # in USD
    avg_cost_per_day_mid = db.Column(db.Float, default=160.0)      # in USD
    avg_cost_per_day_luxury = db.Column(db.Float, default=400.0)   # in USD
    tags = db.Column(db.Text, nullable=False)  # JSON list of strings e.g. ["adventure", "culture"]
    safety_rating = db.Column(db.Float, default=4.5)
    currency_code = db.Column(db.String(10), default='USD')
    languages = db.Column(db.String(120), default='English')
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    attractions = db.relationship('TouristAttraction', backref='destination', lazy='dynamic', cascade='all, delete-orphan')
    hotels = db.relationship('Hotel', backref='destination', lazy='dynamic')

    def get_tags_list(self):
        try:
            return json.loads(self.tags) if self.tags else []
        except Exception:
            return [t.strip() for t in self.tags.split(',') if t.strip()]

    def set_tags_list(self, tags_list):
        self.tags = json.dumps(tags_list)

    def to_dict(self, include_attractions=False):
        data = {
            'id': self.id,
            'name': self.name,
            'city': self.city,
            'country': self.country,
            'continent': self.continent,
            'airport_code': self.airport_code,
            'description': self.description,
            'image_url': self.image_url,
            'banner_url': self.banner_url or self.image_url,
            'best_time_to_visit': self.best_time_to_visit,
            'climate': self.climate,
            'avg_cost_per_day_budget': self.avg_cost_per_day_budget,
            'avg_cost_per_day_mid': self.avg_cost_per_day_mid,
            'avg_cost_per_day_luxury': self.avg_cost_per_day_luxury,
            'tags': self.get_tags_list(),
            'safety_rating': self.safety_rating,
            'currency_code': self.currency_code,
            'languages': self.languages,
            'is_featured': self.is_featured,
            'attractions_count': self.attractions.count()
        }
        if include_attractions:
            data['attractions'] = [a.to_dict() for a in self.attractions.all()]
        return data


class TouristAttraction(db.Model):
    __tablename__ = 'tourist_attractions'

    id = db.Column(db.Integer, primary_key=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(80), nullable=False)  # Sightseeing, Adventure, Cultural, Nature, Relaxation, Dining
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    estimated_duration_hours = db.Column(db.Float, default=2.5)
    ticket_price_usd = db.Column(db.Float, default=0.0)
    rating = db.Column(db.Float, default=4.7)
    address_or_location = db.Column(db.String(255), nullable=True)
    tips = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'destination_id': self.destination_id,
            'destination_name': self.destination.name if self.destination else '',
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'image_url': self.image_url,
            'estimated_duration_hours': self.estimated_duration_hours,
            'ticket_price_usd': self.ticket_price_usd,
            'rating': self.rating,
            'address_or_location': self.address_or_location or '',
            'tips': self.tips or ''
        }
