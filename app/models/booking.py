from datetime import datetime
from . import db

class BookingInquiry(db.Model):
    __tablename__ = 'booking_inquiries'

    id = db.Column(db.Integer, primary_key=True)
    itinerary_id = db.Column(db.Integer, db.ForeignKey('itineraries.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    customer_name = db.Column(db.String(120), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    customer_phone = db.Column(db.String(30), nullable=True)
    assigned_employee_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    status = db.Column(db.String(30), default='Pending')  # 'Pending', 'In Review', 'Quoted', 'Confirmed', 'Cancelled'
    quote_amount = db.Column(db.Float, nullable=False)
    discount_applied = db.Column(db.Float, default=0.0)
    commission_earned = db.Column(db.Float, default=0.0)
    customer_special_requests = db.Column(db.Text, nullable=True)
    agent_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'itinerary_id': self.itinerary_id,
            'itinerary_title': self.itinerary.title if self.itinerary else 'Trip Plan',
            'destination_name': self.itinerary.destination_name if self.itinerary else 'Destination',
            'user_id': self.user_id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone or '',
            'assigned_employee_id': self.assigned_employee_id,
            'assigned_employee_name': self.agent.full_name if self.agent else 'Unassigned',
            'status': self.status,
            'quote_amount': self.quote_amount,
            'discount_applied': self.discount_applied,
            'commission_earned': self.commission_earned,
            'customer_special_requests': self.customer_special_requests or '',
            'agent_notes': self.agent_notes or '',
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
