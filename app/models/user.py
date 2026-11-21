from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='customer')  # 'customer', 'employee', 'admin'
    full_name = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(30), nullable=True)
    preferred_currency = db.Column(db.String(10), default='USD')
    nationality = db.Column(db.String(60), default='United States')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    itineraries = db.relationship('Itinerary', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    inquiries = db.relationship('BookingInquiry', foreign_keys='BookingInquiry.user_id', backref='customer', lazy='dynamic')
    assigned_inquiries = db.relationship('BookingInquiry', foreign_keys='BookingInquiry.assigned_employee_id', backref='agent', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role == 'admin'

    def is_employee(self):
        return self.role in ['employee', 'admin']

    def is_customer(self):
        return self.role == 'customer'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'full_name': self.full_name or self.username,
            'phone': self.phone or '',
            'preferred_currency': self.preferred_currency,
            'nationality': self.nationality,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
